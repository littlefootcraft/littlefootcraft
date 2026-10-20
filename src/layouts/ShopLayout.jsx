// layouts/ShopLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";

// COMPONENTS
import { PageTopTitle } from "../components/PageTopTitle";
import { ShopToolbar } from "../components/ShopToolbar";
import { FiltersDrawer } from "../components/FiltersDrawer";

// HOKS
import { useFilters } from "../hooks/useFilters";

// CONSTANS
import { COLOR_BY_CODE } from "../constants/color_shades_system";

// CONTEXT
import { useProducts, useProductsStatus } from "../context/ProductsContext";

// Get date out of SKU
const getProductDate = (sku = "") => {
	const datePart = sku.split("-")[1];

	if (!/^\d{8}$/.test(datePart ?? "")) return 0;

	const year = Number(datePart.slice(0, 4));
	const month = Number(datePart.slice(4, 6));
	const day = Number(datePart.slice(6, 8));

	const timestamp = Date.UTC(year, month - 1, day);
	const date = new Date(timestamp);

	// Reject invalid dates rather than allowing JS to normalize them.
	if (
		date.getUTCFullYear() !== year ||
		date.getUTCMonth() !== month - 1 ||
		date.getUTCDate() !== day
	) {
		return 0;
	}

	return timestamp;
};

const normalizeSku = (value = "") =>
	String(value).toLowerCase().replaceAll("-", "").trim();

// This function lives outside the component — that's fine because
// it's not a hook, just a plain helper function.
// It takes all products and the active filters object,
// and returns only the products that match every selected filter.
function applyFilters(products, activeFilters) {
	return products.filter((product) => {
		// For each filter key (category, color, collection)...
		return Object.entries(activeFilters).every(([key, values]) => {
			// If no values selected for this key, don't filter by it
			if (values.length === 0) return true;

			// Check if the product matches at least one selected value
			// product.specifications is where your product data stores these values
			let productValues = product.specifications?.[key];

			if (key === "color") {
				productValues = product.specifications?.colors?.map(
					(colorCode) => COLOR_BY_CODE[colorCode]?.group,
				);
			}
			if (!productValues) return false;

			// Normalize a value to array of lowercase strings
			// handles: string, { en, ua } object, or array of those
			const normalize = (val) => {
				if (Array.isArray(val)) {
					return val.flatMap(normalize);
				}

				if (typeof val === "object" && val !== null) {
					return Object.values(val).map((v) => String(v).toLowerCase());
				}
				return [String(val).toLowerCase()];
			};

			// ← lowercase both sides so "Brooch" matches "brooch"
			return values.some((v) =>
				normalize(productValues).some(
					(pv) => pv.toLowerCase() === v.toLowerCase(),
				),
			);
		});
	});
}

const ShopLayout = () => {
	// 1. Raw products from context
	const products = useProducts();
	const { loading, error } = useProductsStatus();

	const { pathname } = useLocation();

	const isSalePage = pathname.endsWith("/sale");

	const {
		activeFilters,
		toggleFilter,
		clearFilters,
		hasActiveFilters,
		sortKey,
		setSort,
		query,
		setQuery,
	} = useFilters();

	// Page title is set by each child page (ShopPage, ProductPage)
	const [pageTitle, setPageTitle] = useState({ title: "", subtitle: "" });

	// drawer open/close
	const [isFiltersOpen, setIsFiltersOpen] = useState(false);

	// Step 1: Search
	const searchedProducts = useMemo(() => {
		const searchQuery = query.trim().toLowerCase();

		if (!searchQuery) return products;

		return products.filter((product) => {
			const matchesName =
				product.name?.en?.toLowerCase().includes(searchQuery) ||
				product.name?.ua?.toLowerCase().includes(searchQuery);

			const matchesSku = normalizeSku(product.sku).includes(
				normalizeSku(searchQuery),
			);

			return matchesName || matchesSku;
		});
	}, [query, products]);

	// Step 2: Filter (receives searched, not raw products)
	const filteredProducts = useMemo(
		() => applyFilters(searchedProducts, activeFilters),
		[searchedProducts, activeFilters],
	);

	// Step 3: Sort (receives filtered, not searched products)
	const sortedProducts = useMemo(() => {
		const sorted = [...filteredProducts]; // copy — never mutate the original
		switch (sortKey) {
			case "newest":
				sorted.sort((a, b) => {
					const dateDifference = getProductDate(b.sku) - getProductDate(a.sku);

					if (dateDifference !== 0) {
						return dateDifference;
					}

					return String(b.sku ?? "").localeCompare(String(a.sku ?? ""));
				});
				break;
			case "price-asc":
				sorted.sort((a, b) => a.price - b.price);
				break;
			case "price-desc":
				sorted.sort((a, b) => b.price - a.price);
				break;
			default:
				break;
		}
		return sorted;
	}, [filteredProducts, sortKey]);

	// Step 4: Select products for the current page
	const pageProducts = useMemo(() => {
		if (!isSalePage) return sortedProducts;

		return sortedProducts.filter(
			(product) =>
				product.oldPrice != null &&
				Number(product.oldPrice) > Number(product.price),
		);
	}, [sortedProducts, isSalePage]);

	return (
		<div className="shop-layout">
			{/* 1. title */}
			<PageTopTitle
				title={pageTitle.title}
				subtitle={pageTitle.subtitle}
			/>

			{/* 2. toolbar */}
			<ShopToolbar
				query={query}
				sortKey={sortKey}
				onSortChange={setSort}
				onFiltersOpen={() => setIsFiltersOpen(true)}
				count={loading || error ? null : pageProducts.length}
				activeFilters={activeFilters}
				toggleFilter={toggleFilter}
				clearFilters={clearFilters}
				hasActiveFilters={hasActiveFilters}
			/>
			{isFiltersOpen && (
				<FiltersDrawer
					isOpen={isFiltersOpen}
					onClose={() => setIsFiltersOpen(false)}
					activeFilters={activeFilters}
					toggleFilter={toggleFilter}
					clearFilters={clearFilters}
					hasActiveFilters={hasActiveFilters}
				/>
			)}

			{/* 3. cards */}
			<Outlet
				context={{
					setPageTitle,
					sortedProducts: pageProducts,
					activeFilters,
					toggleFilter,
					clearFilters,
					hasActiveFilters,
					sortKey,
					setSort,
					query,
					setQuery,
				}}
			/>
		</div>
	);
};

export default ShopLayout;

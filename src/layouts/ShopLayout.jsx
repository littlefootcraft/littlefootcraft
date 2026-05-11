// layouts/ShopLayout.jsx
import { Outlet } from "react-router-dom";
import { useMemo, useState } from "react";
import { PageTopTitle } from "../components/PageTopTitle";
import { useCatalogPagination } from "../hooks/useCatalogPagination";
import { PaginationBar } from "../components/Pagination";
import { useProducts } from "../context/ProductsContext";
import { ShopToolbar } from "../components/ShopToolbar";
import { FiltersDrawer } from "../components/FiltersDrawer";
import { useFilters } from "../hooks/useFilters";

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
			const productValues = product.specifications?.[key];
			if (!productValues) return false;

			// Normalize a value to array of lowercase strings
			// handles: string, { en, ua } object, or array of those
			const normalize = (val) => {
				if (typeof val === "object" && val !== null && !Array.isArray(val)) {
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

	// Display count
	const [displayCount, setDisplayCount] = useState(null);

	const {
		activeFilters,
		toggleFilter,
		clearFilters,
		hasActiveFilters,
		sortKey,
		setSort,
	} = useFilters();

	// Page title is set by each child page (ShopPage, ProductPage)
	const [pageTitle, setPageTitle] = useState({ title: "", subtitle: "" });

	// Search filter
	const [query, setQuery] = useState("");

	// drawer open/close
	const [isFiltersOpen, setIsFiltersOpen] = useState(false);
	const openFilters = () => setIsFiltersOpen(true);
	const closeFilters = () => setIsFiltersOpen(false);

	// --- THE PIPELINE ---
	// Each step feeds into the next.

	// Step 1: Search
	const searchedProducts = useMemo(() => {
		if (!query) return products; // skip filtering if no query
		return products.filter((p) =>
			p.name.en.toLowerCase().includes(query.toLowerCase()),
		);
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
				sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
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

	// Step 4: Paginate (always last — paginates whatever survived the pipeline)
	const { page, totalPages, paginatedItems, setParams } = useCatalogPagination(
		sortedProducts,
		20,
	);

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
				onQueryChange={setQuery}
				sortKey={sortKey}
				onSortChange={setSort}
				onFiltersOpen={() => setIsFiltersOpen(true)}
				count={displayCount ?? sortedProducts.length}
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
					sortedProducts,
					setDisplayCount,
					// To let child pages read filter state if needed
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

			{/* 3. pagination */}
			{/* <div className="shop-page__pagination-slot">
				<PaginationBar
					page={page}
					totalPages={totalPages}
					setParams={setParams}
				/>
			</div> */}
		</div>
	);
};

export default ShopLayout;

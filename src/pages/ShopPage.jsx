//ShopPage.jsx
import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../context/ProductsContext";
import { useLanguage } from "../context/LanguageContext";
import shopPage from "../content/pages/shop-page.json";
import { useCatalogPagination } from "../hooks/useCatalogPagination";

const ShopPage = () => {
	const { sortedProducts, setPageTitle } = useOutletContext();

	// For language switching
	const { currentLang } = useLanguage();
	const t = (field) => field?.[currentLang] ?? field?.en ?? "";

	// Tell ShopLayout what title to show
	useEffect(() => {
		setPageTitle({
			title: t(shopPage.title),
			subtitle: t(shopPage.subtitle),
		});
	}, [currentLang]); // ← needed to sync title up to ShopLayout on language change

	// Pagination
	const { page, totalPages, paginatedItems, setParams } = useCatalogPagination(
		sortedProducts,
		20,
	);

	// Empty state — filters returned nothing
	if (paginatedItems.length === 0) {
		return (
			<section className="shop-page">
				<div className="shop-page__empty">
					<p>{t(shopPage.emptyState)}</p>
				</div>
			</section>
		);
	}

	return (
		<section className="shop-page container">
			{/* <span className="shop-page__count">{t(sortedProducts.length)}</span> */}
			<div className="shop-page__cards">
				{paginatedItems.map((product) => (
					<ProductCard
						key={product.sku}
						product={product}
					/>
				))}
			</div>
		</section>
	);
};

export default ShopPage;

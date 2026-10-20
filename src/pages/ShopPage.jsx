//ShopPage.jsx
import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";

// COMPONENTS
import { ProductCard } from "../components/ProductCard";
import Seo from "../components/Seo";
import { PaginationBar } from "../components/Pagination";

// CONTEXTS
import { useProductsStatus } from "../context/ProductsContext";
import { useLanguage } from "../context/LanguageContext";
import shopPage from "../content/pages/shop-page.json";

// HOOKS
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
	}, [currentLang, setPageTitle]); // ← needed to sync title up to ShopLayout on language change

	// Pagination
	const { page, totalPages, paginatedItems, setParams } = useCatalogPagination(
		sortedProducts,
		16,
	);

	const { loading, error } = useProductsStatus();

	return (
		<section className="shop-page">
			<Seo
				title={t(shopPage.seo.title)}
				description={t(shopPage.seo.description)}
				image={shopPage.seo.image}
				imageAlt={t(shopPage.seo.imageAlt)}
				url={`/${currentLang}/shop`}
			/>

			{loading ? (
				<div
					className="shop-page__empty container"
					role="status"
				>
					<p>{t(shopPage.loadingState)}</p>
				</div>
			) : error ? (
				<div
					className="shop-page__empty container"
					role="alert"
				>
					<p>{t(shopPage.errorState)}</p>
				</div>
			) : paginatedItems.length === 0 ? (
				<div className="shop-page__empty container">
					<p>{t(shopPage.emptyState)}</p>
				</div>
			) : (
				<div className="container">
					<div className="shop-page__cards">
						{paginatedItems.map((product) => (
							<ProductCard
								key={product.sku}
								product={product}
							/>
						))}
					</div>
				</div>
			)}
			{!loading && !error && totalPages > 1 && (
				<div className="shop-page__pagination-slot">
					<PaginationBar
						page={page}
						totalPages={totalPages}
						setParams={setParams}
					/>
				</div>
			)}
		</section>
	);
};

export default ShopPage;

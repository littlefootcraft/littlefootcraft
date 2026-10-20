//SalePage.jsx

import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

// CONTEXT
import { useLanguage } from "../context/LanguageContext";
import { useProductsStatus } from "../context/ProductsContext";

// COMPONENTS
import { ProductCard } from "../components/ProductCard";
import { PaginationBar } from "../components/Pagination";

// CONTENT
import salePage from "../content/pages/sale-page.json";

// HOOKS
import { useCatalogPagination } from "../hooks/useCatalogPagination";

// SEO
import Seo from "../components/Seo";

const SalePage = () => {
	const { sortedProducts, setPageTitle } = useOutletContext();
	const { currentLang } = useLanguage();
	const { loading, error } = useProductsStatus();

	const t = (field) => field?.[currentLang] ?? field?.en ?? "";

	// Tell ShopLayout what title to show
	useEffect(() => {
		setPageTitle({
			title: t(salePage.title),
			subtitle: t(salePage.subtitle),
		});
	}, [currentLang, setPageTitle]); // ← needed to sync title up to ShopLayout on language change

	// Pagination
	const { page, totalPages, paginatedItems, setParams } = useCatalogPagination(
		sortedProducts, // ← paginate sale items only
		16,
	);

	return (
		<section className="sale-page">
			<Seo
				title={t(salePage.seo.title)}
				description={t(salePage.seo.description)}
				image={salePage.seo.image}
				imageAlt={t(salePage.seo.imageAlt)}
				url={`/${currentLang}/sale`}
			/>
			{loading ? (
				<div
					className="sale-page__empty container"
					role="status"
				>
					<p>{currentLang === "ua" ? "Завантаження..." : "Loading..."}</p>
				</div>
			) : error ? (
				<div
					className="sale-page__empty container"
					role="alert"
				>
					<p>
						{currentLang === "ua"
							? "Не вдалося завантажити товари."
							: "Unable to load products."}
					</p>
				</div>
			) : paginatedItems.length === 0 ? (
				<div className="sale-page__empty container">
					<p>{t(salePage.emptyState)}</p>
				</div>
			) : (
				<div className="container">
					<div className="sale-page__cards">
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

export default SalePage;

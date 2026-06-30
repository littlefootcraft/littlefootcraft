//SalePage.jsx

import { useEffect, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useCartDetails } from "../hooks/useCartDetails";
import { useOutletContext } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import salePage from "../content/pages/sale-page.json";
import { useCatalogPagination } from "../hooks/useCatalogPagination";
import Seo from "../components/Seo";
import { PaginationBar } from "../components/Pagination";

const SalePage = () => {
	const { sortedProducts, setPageTitle, setDisplayCount } = useOutletContext();
	const { currentLang } = useLanguage();
	const { cartProducts, totalAmount, totalDiscount, originalTotal } =
		useCartDetails();
	const t = (field) => field?.[currentLang] ?? field?.en ?? "";

	// Tell ShopLayout what title to show
	useEffect(() => {
		setPageTitle({
			title: t(salePage.title),
			subtitle: t(salePage.subtitle),
		});
	}, [currentLang, setPageTitle]); // ← needed to sync title up to ShopLayout on language change

	// Calculate sale items from what ShopLayout already filtered/sorted
	const saleItems = useMemo(
		() =>
			sortedProducts.filter(
				(product) =>
					product.oldPrice != null &&
					Number(product.oldPrice) > Number(product.price),
			),
		[sortedProducts],
	);

	// Pagination
	const { page, totalPages, paginatedItems, setParams } = useCatalogPagination(
		saleItems, // ← paginate sale items only
		4,
	);

	// Tell ShopLayout how many sale items there are
	useEffect(() => {
		setDisplayCount(saleItems.length);
		return () => setDisplayCount(null); // reset on unmount
	}, [saleItems.length, setDisplayCount]);

	// Empty state — filters returned nothing
	if (paginatedItems.length === 0) {
		return (
			<section className="sale-page">
				<div className="sale-page__empty">
					<p>{t(salePage.emptyState)}</p>
				</div>
			</section>
		);
	}
	return (
		<section className="sale-page">
			<Seo
				title={t(salePage.seo.title)}
				description={t(salePage.seo.description)}
				image={salePage.seo.image}
				imageAlt={t(salePage.seo.imageAlt)}
				url={`/${currentLang}/sale`}
			/>
			{paginatedItems.length === 0 ? (
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
			<div className="shop-page__pagination-slot">
				<PaginationBar
					page={page}
					totalPages={totalPages}
					setParams={setParams}
				/>
			</div>
		</section>
	);
};

export default SalePage;

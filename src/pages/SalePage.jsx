//SalePage.jsx

import { useEffect, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useCartDetails } from "../hooks/useCartDetails";
import { useOutletContext } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import salePage from "../content/pages/sale-page.json";
import { useCatalogPagination } from "../hooks/useCatalogPagination";
import Seo from "../components/Seo";

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
	}, [currentLang]); // ← needed to sync title up to ShopLayout on language change

	// Calculate sale items from what ShopLayout already filtered/sorted
	const saleItems = useMemo(
		() =>
			sortedProducts.filter((p) => p.oldPrice != null && p.oldPrice > p.price),
		[sortedProducts],
	);

	// Pagination
	const { page, totalPages, paginatedItems, setParams } = useCatalogPagination(
		saleItems, // ← paginate sale items only
		20,
	);

	// Tell ShopLayout how many sale items there are
	useEffect(() => {
		setDisplayCount(saleItems.length);
		return () => setDisplayCount(null); // reset on unmount
	}, [saleItems.length]);

	// Empty state — filters returned nothing
	if (paginatedItems.length === 0) {
		return (
			<section className="sale-page container">
				<div className="sale-page__empty">
					<p>{t(salePage.emptyState)}</p>
				</div>
			</section>
		);
	}
	return (
		<section className="sale-page ">
			<Seo
				title={t(salePage.seo.title)}
				description={t(salePage.seo.description)}
				image={salePage.seo.image}
				imageAlt={t(salePage.seo.imageAlt)}
				url={`/${currentLang}/sale`}
			/>
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
		</section>
	);
};

export default SalePage;

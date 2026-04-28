//ShopPage.jsx
import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../context/ProductsContext";
import { useLanguage } from "../context/LanguageContext";
import shopPage from "../content/pages/shop-page.json";

const ShopPage = () => {
	const { paginatedItems, setPageTitle } = useOutletContext();

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

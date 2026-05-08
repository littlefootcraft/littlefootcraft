//WishlistPage.jsx

import { useWishlist } from "../context/WishlistContext";
import { useLanguage } from "../context/LanguageContext";
import { useProducts } from "../context/ProductsContext";
import { ProductCard } from "../components/ProductCard";
import { PageTopTitle } from "../components/PageTopTitle";
import { wishlistPageUA, wishlistPageEN } from "../translations/translation";
import WishlistPageContent from "../content/pages/wishlist-page.json";

import { Star } from "lucide-react";
import { PrimaryBtn } from "../components/PrimaryBtn";
import Seo from "../components/Seo";

const WishlistPage = () => {
	const { wishlist } = useWishlist();
	const products = useProducts();

	// For language switching
	const { currentLang } = useLanguage();
	// Pick the right translation object based on language
	const dict = currentLang === "ua" ? wishlistPageUA : wishlistPageEN;
	const t = (field) => field?.[currentLang] ?? field?.en ?? "";

	// wishlist is SKUs → find the full product objects
	const wishlistProducts = products.filter((p) => wishlist.includes(p.sku));

	return (
		<div className="wishlist">
			<Seo
				title={t(WishlistPageContent.seo.title)}
				description={t(WishlistPageContent.seo.description)}
				image={WishlistPageContent.seo.image}
				imageAlt={t(WishlistPageContent.seo.imageAlt)}
				url={`/${currentLang}/shop`}
			/>
			{/* 1. title */}
			<PageTopTitle
				title={dict.title}
				subtitle={dict.subtitle}
			/>

			<div className="container">
				{/* <span className="wishlist__count">
					<Star />
					{dict.itemsFound(wishlistProducts.length)}
				</span> */}
				<div className="wishlist__content">
					{wishlistProducts.length === 0 ? (
						<div className="wishlist-empty">
							<span className="wishlist-empty__icon">✦</span>
							<h2 className="wishlist-empty__title">{dict["empty-title"]}</h2>
							<p className="wishlist-empty__text">{dict["empty-text"]}</p>

							<PrimaryBtn
								variant="to-catalog"
								to="/shop"
							>
								{dict["empty-btn"]}
							</PrimaryBtn>
						</div>
					) : (
						<div>
							<span className="wishlist__count">
								<Star />
								{dict.itemsFound(wishlistProducts.length)}
							</span>
							<div className="wishlist__cards">
								{wishlistProducts.map((product) => (
									<ProductCard
										key={product.sku}
										product={product}
									/>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default WishlistPage;

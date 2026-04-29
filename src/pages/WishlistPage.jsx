//WishlistPage.jsx

import { useWishlist } from "../context/WishlistContext";
import { useLanguage } from "../context/LanguageContext";
import { useProducts } from "../context/ProductsContext";
import { ProductCard } from "../components/ProductCard";
import { PageTopTitle } from "../components/PageTopTitle";
import { wishlistPageUA, wishlistPageEN } from "../translations/translation";

import { Star } from "lucide-react";
import { PrimaryBtn } from "../components/PrimaryBtn";

const WishlistPage = () => {
	const { wishlist } = useWishlist();
	const products = useProducts();

	// For language switching
	const { currentLang } = useLanguage();
	// Pick the right translation object based on language
	const dict = currentLang === "ua" ? wishlistPageUA : wishlistPageEN;

	// wishlist is SKUs → find the full product objects
	const wishlistProducts = products.filter((p) => wishlist.includes(p.sku));

	return (
		<div className="wishlist">
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

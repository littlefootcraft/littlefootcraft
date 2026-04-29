//ProductCard.jsx

import { Link } from "react-router-dom";
import { useProductCardState } from "../hooks/useProductCardState";
import { useLanguage } from "../context/LanguageContext";
import { useWishlist } from "../context/WishlistContext";
import { productCardEN, productCardUA } from "../translations/translation";
import MagicBadge from "./MagicBadge";

import { Star } from "lucide-react";
import { IoArrowForward } from "react-icons/io5";
import { formatPrice } from "../utils/formatPrice";

export const ProductCard = ({ product }) => {
	const { name, price, badges, specifications } = product;
	const { image, selectedSku } = useProductCardState(product);
	const { toggleWishlist, isInWishlist } = useWishlist();
	const inWish = isInWishlist(product.sku);

	const { currentLang } = useLanguage();

	// t() inline — same pattern you use everywhere else
	const t = (field) => field?.[currentLang] ?? field?.en ?? "";
	const dict = currentLang === "en" ? productCardEN : productCardUA;

	// background image style
	const imageStyle = image ? { "--card-image": `url(${image})` } : {};

	return (
		<div className="product-card">
			<Link to={`/${currentLang}/shop/${product.sku}`}>
				<div
					className="product-card__media"
					style={imageStyle}
				>
					{/* overlay слой */}
					<div className="product-card__media-top">
						{badges?.isNew && (
							<MagicBadge className="product-card__badge">
								{dict.new}
							</MagicBadge>
						)}

						<button
							className={`product-card__favorite-btn ${inWish ? "product-card__favorite-btn--active" : ""}`}
							aria-label={inWish ? dict.removeFromWishlist : dict.addToWishlist}
							aria-pressed={inWish}
							onClick={(e) => {
								e.preventDefault(); // don't follow the Link
								e.stopPropagation(); // don't bubble up to the card click
								toggleWishlist(product.sku);
							}}
						>
							<Star
								className="product-card__heart-icon"
								fill={inWish ? "#d4af37" : "none"}
								stroke="#d4af37"
							/>
						</button>
					</div>
				</div>
				<div className="product-card__footer">
					<span className="product-card__category">
						{specifications?.category}
					</span>
					<h3 className="product-card__title">{t(name)}</h3>
					<div className="product-card__price-container">
						<div className="product-card__prices">
							<p className="product-card__price">{formatPrice(price)}</p>
							{product.oldPrice && (
								<p className="product-card__price--old">
									{formatPrice(product.oldPrice)}
								</p>
							)}
						</div>
						<span>
							{dict["details-btn"]}
							<IoArrowForward />
						</span>
					</div>
				</div>
			</Link>
		</div>
	);
};

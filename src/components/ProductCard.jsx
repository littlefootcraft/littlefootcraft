//ProductCard.jsx

import { Link } from "react-router-dom";
import MagicBadge from "./MagicBadge";

import { Star } from "lucide-react";
import { IoArrowForward } from "react-icons/io5";
import { useProductCardState } from "../hooks/useProductCardState";
import { useLanguage } from "../context/LanguageContext";

export const ProductCard = ({ product }) => {
	const { name, price, badges, specifications } = product;
	const { image, selectedSku } = useProductCardState(product);
	const { currentLang } = useLanguage();

	// t() inline — same pattern you use everywhere else
	const t = (field) => field?.[currentLang] ?? field?.en ?? "";

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
							<MagicBadge className="product-card__badge">New</MagicBadge>
						)}
						<button className="product-card__favorite-btn">
							<Star />
						</button>
						{/* <button
							className={`product-card__favorite-btn ${inWish ? "product-card__favorite-btn--active" : ""}`}
							aria-label={inWish ? "Прибрати з обраного" : "Додати в обране"}
							aria-pressed={inWish}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								toggleWishlist(product.sku);
							}}
						>
							{inWish ? (
								<FaHeart className="product-card__heart-icon" />
							) : (
								<FaRegHeart className="product-card__heart-icon" />
							)}
						</button> */}
					</div>
				</div>
				<div className="product-card__footer">
					<span className="product-card__category">
						{t(specifications?.category)}
					</span>
					<h3 className="product-card__title">{t(name)}</h3>
					<div className="product-card__price-container">
						<p className="product-card__price">€{price}</p>
						<span>
							View Details <IoArrowForward />
						</span>
					</div>
				</div>
			</Link>
		</div>
	);
};

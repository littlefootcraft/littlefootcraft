//ProductCard.jsx

import { Link } from "react-router-dom";
import MagicBadge from "./MagicBadge";

import image from "/uploads/images/broches/broche_1.png";

import { Star } from "lucide-react";
import { IoArrowForward } from "react-icons/io5";

export const ProductCard = () => {
	// background image style
	const imageStyle = {
		backgroundImage: image ? `url(${image})` : undefined,
	};
	return (
		<div className="product-card">
			<Link to="/product">
				<div
					className="product-card__media"
					style={imageStyle}
					alt="broche"
				>
					{/* overlay слой */}
					<div className="product-card__media-top">
						<MagicBadge className="product-card__badge">New</MagicBadge>
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
					<span className="product-card__category">Category</span>
					<h3 className="product-card__title">Product Name</h3>
					<div className="product-card__price-container">
						<p className="product-card__price">€99.99</p>
						<span>
							View Details <IoArrowForward />
						</span>
					</div>
				</div>
			</Link>
		</div>
	);
};

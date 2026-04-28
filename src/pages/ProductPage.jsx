// ProductPage.jsx
import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { CgClose } from "react-icons/cg";

import { useProducts } from "../context/ProductsContext";
import { useLanguage } from "../context/LanguageContext";
import { useWishlist } from "../context/WishlistContext";
import { useProductGallery } from "../hooks/useProductGallery";
import { ProductCard } from "../components/ProductCard";
import NotFoundPage from "./NotFoundPage";
import { productPageUA, productPageEN } from "../translations/translation";
import { Star } from "lucide-react";

const ProductPage = () => {
	const { sku } = useParams();
	const products = useProducts();
	const product = products.find((p) => p.sku === sku);

	if (!product) return <NotFoundPage />;

	const { currentLang } = useLanguage();
	const t = (field) => field?.[currentLang] ?? field?.en ?? "";
	const dict = currentLang === "ua" ? productPageUA : productPageEN;

	// Wishlist
	const { toggleWishlist, isInWishlist } = useWishlist();
	const inWish = isInWishlist(product.sku);

	// Gallery — all logic lives in the hook
	const {
		mediaItems,
		activeIndex,
		activeItem,
		isVideoModalOpen,
		setIsVideoModalOpen,
		handleThumbClick,
		goToPrev,
		goToNext,
	} = useProductGallery(product);

	// Related products — same collection first, then same category
	const relatedProducts = useMemo(() => {
		const others = products.filter((p) => p.sku !== product.sku);

		const sameCollection = others.filter(
			(p) =>
				p.specifications?.collection === product.specifications?.collection,
		);

		if (sameCollection.length >= 4) return sameCollection.slice(0, 4);

		// fill remaining slots with same category
		const sameCategory = others.filter(
			(p) =>
				p.specifications?.category?.toLowerCase() ===
					product.specifications?.category?.toLowerCase() &&
				!sameCollection.find((s) => s.sku === p.sku),
		);

		return [...sameCollection, ...sameCategory].slice(0, 4);
	}, [product, products]);

	return (
		<div className="product-page container">
			{/* Breadcrumbs */}
			<nav
				className="product-page__breadcrumbs"
				aria-label="Breadcrumbs"
			>
				<Link
					className="product-page__breadcrumbs-link"
					to={`/${currentLang}`}
				>
					{dict.breadcrumbs.home}
				</Link>
				<span className="product-page__breadcrumbs-separator">/</span>
				<Link
					className="product-page__breadcrumbs-link"
					to={`/${currentLang}/shop`}
				>
					{dict.breadcrumbs.catalog}
				</Link>
				<span className="product-page__breadcrumbs-separator">/</span>
				<span className="product-page__breadcrumbs-current">
					{t(product.name)}
				</span>
			</nav>

			{/* Main content — gallery left, info right */}
			<div className="product-page__content">
				{/* LEFT — Gallery */}
				<div className="product-page__media">
					{/* Main image / active item */}
					<div className="product-page__stage">
						<button
							type="button"
							className="product-page__nav product-page__nav--prev"
							onClick={goToPrev}
							disabled={activeIndex === 0}
						>
							<IoIosArrowBack size={28} />
						</button>

						{/* Show image or video poster depending on active item */}
						{activeItem?.type === "video" ? (
							<button
								className="product-page__stage-video"
								onClick={() => setIsVideoModalOpen(true)}
							>
								<video
									src={product.video}
									muted
									playsInline
									preload="metadata"
									className="product-page__image"
								/>
								<span className="product-page__play-icon">▶</span>
							</button>
						) : (
							<img
								className="product-page__image"
								src={activeItem?.src}
								alt={t(activeItem?.alt)}
							/>
						)}

						<button
							type="button"
							className="product-page__nav product-page__nav--next"
							onClick={goToNext}
							disabled={activeIndex === mediaItems.length - 1}
						>
							<IoIosArrowForward size={28} />
						</button>
					</div>

					{/* Thumbnails */}
					{mediaItems.length > 1 && (
						<div className="product-page__thumbs">
							{mediaItems.map((item, index) => (
								<button
									key={index}
									type="button"
									className={`product-page__thumb ${
										index === activeIndex ? "product-page__thumb--active" : ""
									}`}
									onClick={() => handleThumbClick(index)}
									aria-label={`Photo ${index + 1}`}
								>
									{item.type === "video" ? (
										<div className="product-page__thumb-video">
											<video
												src={item.src}
												muted
												playsInline
												preload="metadata"
											/>
											<span className="product-page__thumb-play">▶</span>
										</div>
									) : (
										<img
											src={item.src}
											alt={t(item.alt)}
										/>
									)}
								</button>
							))}
						</div>
					)}
				</div>

				{/* RIGHT — Product info */}
				<div className="product-page__info">
					<span className="product-page__category">
						{product.specifications?.category}
					</span>

					<h1 className="product-page__name">{t(product.name)}</h1>

					{/* Price — shows old price if it exists */}
					<div className="product-page__price">
						<span className="product-page__price--current">
							€{product.price}
						</span>
						{product.oldPrice && (
							<span className="product-page__price--old">
								€{product.oldPrice}
							</span>
						)}
					</div>

					<article className="product-page__description">
						{t(product.description)}
					</article>

					{/* Specs */}
					<div className="product-page__specs">
						{product.specifications?.size && (
							<div className="product-page__spec">
								<span className="product-page__spec-label">
									{dict.specs.size}
								</span>
								<span>{t(product.specifications.size)}</span>
							</div>
						)}
						{product.specifications?.collection && (
							<div className="product-page__spec">
								<span className="product-page__spec-label">
									{dict.specs.collection}
								</span>
								<span>{product.specifications.collection}</span>
							</div>
						)}
						{product.specifications?.color && (
							<div className="product-page__spec">
								<span className="product-page__spec-label">
									{dict.specs.color}
								</span>
								<div className="product-page__colors">
									{product.specifications.color.map((color) => (
										<span
											key={color}
											className="product-page__color-dot"
											style={{ backgroundColor: color }}
											title={color}
										/>
									))}
								</div>
							</div>
						)}
						<div className="product-page__spec">
							<span className="product-page__spec-label">{dict.specs.sku}</span>
							<span>{product.sku}</span>
						</div>
					</div>

					{/* Action buttons */}
					<div className="product-page__btns">
						<button
							className="product-page__add-to-cart"
							disabled
						>
							{dict.addToCart}
						</button>
						<button
							className={`product-page__wishlist-btn ${inWish ? "product-page__wishlist-btn--active" : ""}`}
							onClick={() => toggleWishlist(product.sku)}
							aria-label={inWish ? "Remove from wishlist" : "Add to wishlist"}
							aria-pressed={inWish}
						>
							<Star
								fill={inWish ? "#d4af37" : "none"}
								stroke="#d4af37"
							/>
						</button>
					</div>
				</div>
			</div>

			{/* Video modal */}
			{isVideoModalOpen && (
				<div
					className="product-page__video-modal"
					onClick={() => setIsVideoModalOpen(false)}
				>
					<div
						className="product-page__video-modal-content"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							type="button"
							className="product-page__video-modal-close"
							onClick={() => setIsVideoModalOpen(false)}
						>
							<CgClose />
						</button>
						<video
							className="product-page__video-modal-player"
							src={product.video}
							controls
							autoPlay
							playsInline
						/>
					</div>
				</div>
			)}

			{/* Related products */}
			{relatedProducts.length > 0 && (
				<div className="product-page__related">
					<h2 className="product-page__related-title">{dict.related}</h2>
					<div className="product-page__related-cards">
						{relatedProducts.map((p) => (
							<ProductCard
								key={p.sku}
								product={p}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductPage;

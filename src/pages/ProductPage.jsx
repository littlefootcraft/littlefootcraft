// ProductPage.jsx
import { useState, useMemo, useRef, useEffect } from "react";
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
import { SecondaryBtn } from "../components/SecondaryBtn";

import ProductPageContent from "../content/pages/product-page.json";

//Icons
import { Check, Star, Sparkles } from "lucide-react";
import { IoShareSocialOutline } from "react-icons/io5";
import {
	FaFacebookF,
	FaTelegramPlane,
	FaWhatsapp,
	FaViber,
} from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { FiLink } from "react-icons/fi";

import { formatPrice } from "../utils/formatPrice";
import { ProcessSection } from "../components/ProcessSection";
import { PrimaryBtn } from "../components/PrimaryBtn";
import { useCart } from "../context/CartContext";
import Seo from "../components/Seo";

import { ShieldCheck, PackageCheck, Truck } from "lucide-react";

const RECENTLY_VIEWED_KEY = "recently_viewed_skus";
const MAX_RECENTLY_VIEWED = 8;

const ICONS = {
	shield: ShieldCheck,
	package: PackageCheck,
	truck: Truck,
};

const ProductPage = () => {
	const { sku } = useParams();
	const products = useProducts();
	const { addToCart, cartList } = useCart();
	const product = products.find((p) => p.sku === sku);

	if (!product) return <NotFoundPage />;

	const { currentLang } = useLanguage();
	const t = (field) => field?.[currentLang] ?? field?.en ?? "";
	const dict = currentLang === "ua" ? productPageUA : productPageEN;

	// Wishlist
	const { toggleWishlist, isInWishlist } = useWishlist();
	const inWish = isInWishlist(product.sku);

	// Share link
	const [isShareOpen, setIsShareOpen] = useState(false);
	const shareRef = useRef(null);
	const shareUrl = window.location.href;
	const encodedUrl = encodeURIComponent(shareUrl);
	const shareText = t(product.name);
	const encodedText = encodeURIComponent(`${shareText} ${shareUrl}`);
	const encodedSubject = encodeURIComponent(t(product.name));
	const encodedBody = encodeURIComponent(`${shareText}\n\n${shareUrl}`);

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(shareUrl);
			setIsShareOpen(false);
		} catch (error) {
			console.error("Copy failed:", error);
		}
	};

	// Close share menu when clicking outside
	useEffect(() => {
		if (!isShareOpen) return;
		const handleClickOutside = (e) => {
			if (shareRef.current && !shareRef.current.contains(e.target)) {
				setIsShareOpen(false);
			}
		};
		const handleEscape = (e) => {
			if (e.key === "Escape") setIsShareOpen(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		window.addEventListener("keydown", handleEscape);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			window.removeEventListener("keydown", handleEscape);
		};
	}, [isShareOpen]);

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

		const currentCollection = product.specifications?.collection?.en;
		const currentCategory = product.specifications?.category?.en;

		const sameCollection = others.filter(
			(p) =>
				p.specifications?.collection?.en?.toLowerCase() ===
				currentCollection?.toLowerCase(),
		);

		const sameCategory = others.filter(
			(p) =>
				p.specifications?.category?.en?.toLowerCase() ===
					currentCategory?.toLowerCase() &&
				!sameCollection.some((item) => item.sku === p.sku),
		);

		return [...sameCollection, ...sameCategory].slice(0, 4);
	}, [product, products]);

	// Save current product to recently viewed
	useEffect(() => {
		if (!product?.sku) return;
		const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
		const prev = raw ? JSON.parse(raw) : [];
		const next = [product.sku, ...prev.filter((s) => s !== product.sku)].slice(
			0,
			MAX_RECENTLY_VIEWED,
		);
		localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
	}, [product?.sku]);

	// Build recently viewed list — exclude current product
	const recentlyViewed = useMemo(() => {
		const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
		const skus = raw ? JSON.parse(raw) : [];
		return skus
			.filter((s) => s !== product.sku)
			.map((s) => products.find((p) => p.sku === s))
			.filter(Boolean)
			.slice(0, 4);
	}, [product?.sku, products]);

	// Lock body scroll when video modal is open
	useEffect(() => {
		if (isVideoModalOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		// Cleanup when component unmounts
		return () => {
			document.body.style.overflow = "";
		};
	}, [isVideoModalOpen]);

	// Adding to cart

	const [isAdded, setIsAdded] = useState(false);

	const handleAddToCart = () => {
		addToCart({ sku: product.sku });
		setIsAdded(true);
	};

	return (
		<div className="product-page container">
			<Seo
				title={t(product.seo?.title) || `${t(product.name)} | LittleFootCraft`}
				description={
					t(product.seo?.description) ||
					t(product.description) ||
					"Handcrafted magical treasure created with care and imagination."
				}
				image={product.photo?.[0]?.src}
				imageAlt={t(product.seo?.imageAlt) || t(product.name)}
				url={`/${currentLang}/shop/${product.sku}`}
			/>
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
									src={activeItem.src}
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
						{t(product.specifications?.category)}
					</span>

					<h1 className="product-page__name">{t(product.name)}</h1>

					{/* Price — shows old price if it exists */}
					<div className="product-page__price">
						<span className="product-page__price--current">
							{formatPrice(product.price)}
						</span>
						{product.oldPrice && (
							<span className="product-page__price--old">
								{formatPrice(product.oldPrice)}
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
								<span>{t(product.specifications?.collection)}</span>
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
						<div className="product-page__cart-actions">
							<PrimaryBtn
								variant="add-to-cart"
								onClick={handleAddToCart}
								className={isAdded ? "is-active" : ""}
								disabled={isAdded}
							>
								{isAdded ? (
									<>
										<Check />
										{dict.addedToCart}
									</>
								) : (
									dict.addToCart
								)}
							</PrimaryBtn>

							{/* View cart button — only appears after adding */}
							<SecondaryBtn
								variant="to-cart"
								to={`/${currentLang}/cart`}
								className={`product-page__cart-btn ${
									isAdded
										? "product-page__cart-btn--visible"
										: "product-page__cart-btn--hidden"
								}`}
							>
								{dict.viewCart}
							</SecondaryBtn>
						</div>

						<button
							className={`product-page__wishlist-btn ${inWish ? "product-page__wishlist-btn--active" : ""}`}
							onClick={() => toggleWishlist(product.sku)}
							aria-label={
								inWish ? dict.removeWishlistAria : dict.addToWishlistAria
							}
							aria-pressed={inWish}
						>
							<Star
								fill={inWish ? "#d4af37" : "none"}
								stroke="#d4af37"
							/>
						</button>

						{/* Share button */}
						<div
							className="product-page__share-wrap"
							ref={shareRef}
						>
							<button
								className="product-page__share-btn"
								onClick={() => setIsShareOpen((prev) => !prev)}
								aria-expanded={isShareOpen}
							>
								<IoShareSocialOutline size={22} />
							</button>
							{isShareOpen && (
								<div className="product-page__share-menu">
									<a
										className="product-page__share-item"
										href={`mailto:?subject=${encodedSubject}&body=${encodedBody}`}
										target="_blank"
										rel="noreferrer"
										onClick={() => setIsShareOpen(false)}
									>
										<MdOutlineEmail />
										<span>Email</span>
									</a>
									<a
										className="product-page__share-item"
										href={`viber://forward?text=${encodedText}`}
										onClick={() => setIsShareOpen(false)}
									>
										<FaViber />
										<span>Viber</span>
									</a>
									<a
										className="product-page__share-item"
										href={`https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(shareText)}`}
										target="_blank"
										rel="noreferrer"
										onClick={() => setIsShareOpen(false)}
									>
										<FaTelegramPlane />
										<span>Telegram</span>
									</a>
									<a
										className="product-page__share-item"
										href={`https://wa.me/?text=${encodedText}`}
										target="_blank"
										rel="noreferrer"
										onClick={() => setIsShareOpen(false)}
									>
										<FaWhatsapp />
										<span>WhatsApp</span>
									</a>
									<a
										className="product-page__share-item"
										href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
										target="_blank"
										rel="noreferrer"
										onClick={() => setIsShareOpen(false)}
									>
										<FaFacebookF />
										<span>Facebook</span>
									</a>
									<button
										type="button"
										className="product-page__share-item product-page__share-item--button"
										onClick={handleCopyLink}
									>
										<FiLink />
										<span>Copy link</span>
									</button>
								</div>
							)}
						</div>
					</div>

					{/* Highlights */}
					<ul className="product-page__highlights">
						{ProductPageContent.highlights.map((item) => {
							const Icon = ICONS[item.icon];

							return (
								<li
									key={item.icon}
									className="product-page__highlight"
								>
									<Icon />

									<span>{t(item.text)}</span>
								</li>
							);
						})}
					</ul>
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
							src={product.video.src} // ← .src now, not just product.video
							controls
							autoPlay
							playsInline
						/>
					</div>
				</div>
			)}
			<div className="product-page__process-section">
				<ProcessSection
					title={t(ProductPageContent.process.title)}
					text={t(ProductPageContent.process.text)}
					titleOne={t(ProductPageContent.process.steps[0]["title-one"])}
					textOne={t(ProductPageContent.process.steps[0]["text-one"])}
					titleTwo={t(ProductPageContent.process.steps[1]["title-two"])}
					textTwo={t(ProductPageContent.process.steps[1]["text-two"])}
					titleThree={t(ProductPageContent.process.steps[2]["title-three"])}
					textThree={t(ProductPageContent.process.steps[2]["text-three"])}
				/>
			</div>

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
			{console.log("relatedProducts", relatedProducts)}

			{/* Recently viewed */}
			{recentlyViewed.length > 0 && (
				<div className="product-page__recently-viewed">
					<h2 className="product-page__recently-viewed-title">
						{dict.recentlyViewed}
					</h2>
					<div className="product-page__recently-viewed-cards">
						{recentlyViewed.map((p) => (
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

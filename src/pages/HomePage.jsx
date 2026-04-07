//HomePage
// import HomeAboutImage from "/public/uploads/images/home_about_image.jpeg";
// import WorkshopsImage from "/public/uploads/images/home_workshop_image.jpeg";
import MagicBadge from "../components/MagicBadge";
import { PrimaryBtn } from "../components/PrimaryBtn";

import { Sparkles, ChevronRight, Star, Globe, Shield } from "lucide-react";
import { SecondaryBtn } from "../components/SecondaryBtn";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../context/ProductsContext";
import { useMemo } from "react";

const HomeAboutImage = "/uploads/images/home_about_image.jpeg";
const WorkshopsImage = "/uploads/images/home_workshop_image.jpeg";

const HomePage = () => {
	const products = useProducts();

	// All products
	const allProducts = useMemo(() => {
		if (!Array.isArray(products)) {
			return { new: [] };
		}
		return {
			new: products.filter((product) => product.badges?.isNew === true),
		};
	}, [products]);

	// New products only
	const onlyFourNewProducts = allProducts.new.slice(0, 4);

	return (
		<section className="home-page">
			<section className="home-page__top">
				<div className="home-page__top-content container">
					<MagicBadge>✦ Handcrafted with Magic ✦</MagicBadge>
					<h1 className="home-page__top-title">Made to Tell Stories</h1>
					<p className="home-page__top-info">
						One-of-a-kind handcrafted pieces, each imbued with story, care, and
						a touch of magic.
					</p>
					<PrimaryBtn
						variant="to-catalog"
						to="/shop"
					>
						Discover collection
					</PrimaryBtn>
				</div>
			</section>
			{/* --- HIGHLIGHTS --- */}
			<div className="home-page__highlights">
				<ul className="home-page__highlights-list container">
					<li className="home-page__highlights-item">
						<Sparkles />
						Handcrafted with Care
					</li>
					<li className="home-page__highlights-item">
						<Star />
						One-of-a-Kind Pieces
					</li>
					<li className="home-page__highlights-item">
						<Globe />
						Worldwide Shipping
					</li>
					<li className="home-page__highlights-item">
						<Shield />
						Secure Ordering
					</li>
				</ul>
			</div>

			{/* --- NEW ARRIVALS --- */}
			<section className="home-page__new-arrivals">
				<div className="container">
					<div className="home-page__new-arrivals-top">
						<div>
							<h2 className="home-page__new-arrivals-title main-title">
								New Arrivals
							</h2>
							<p className="home-page__new-arrivals-info">
								Discover our latest enchanted pieces
							</p>
						</div>
						<button
							className="home-page__to-catalog-btn"
							variant="to-catalog"
							to="/shop"
						>
							See all
							<ChevronRight />
						</button>
					</div>
					<div className="home-page__new-arrivals-cards">
						{onlyFourNewProducts.map((p) => (
							<ProductCard
								key={p.sku}
								product={p}
							/>
						))}
					</div>
				</div>
			</section>

			{/* --- COLLECTIONS --- */}
			<section className="home-page__collections">
				<div className="container">
					<h2 className="home-page__collections-title main-title">
						Explore Collections
					</h2>
					<div className="home-page__collections-cards"></div>
				</div>
			</section>

			{/* --- ABOUT SECTION --- */}
			<section className="home-page__about">
				<div className="home-page__about-content container">
					<img
						className="home-page__about-image"
						src={HomeAboutImage}
						alt="Our story"
					/>
					<div className="home-page__about-info">
						<span>Our Story</span>
						<h2 className="home-page__about-title main-title">
							Where Magic Meets Craftsmanship
						</h2>
						<article className="home-page__about-text text">
							LittleFootCraft was born from a love of quiet beauty — of
							forgotten materials, second chances, and stories waiting to be
							told. Each brooch is handcrafted with care and intuition, becoming
							a small, soulful piece meant to feel personal, rare, and full of
							gentle magic.
						</article>
						<SecondaryBtn
							variant="to-other-page"
							to="/about"
						>
							Learn More
						</SecondaryBtn>
					</div>
				</div>
			</section>

			{/* --- PROCESS SECTION --- */}
			<section className="home-page__process">
				<div className="container">
					<div className="home-page__process-header">
						<h2 className="home-page__process-title main-title">
							Why Every Piece is Unique
						</h2>
						<p className="home-page__process-text">
							Our order request system ensures that each handcrafted piece finds
							its destined owner. No mass production, no duplicates — just
							artisanal magic.
						</p>
					</div>
					<ul className="home-page__process-steps">
						<li className="home-page__process-step">
							<span className="home-page__process-number">1</span>
							<h3 className="home-page__process-step-title">
								Request to Order
							</h3>
							<p className="home-page__process-step-text">
								Choose your piece and submit an order request
							</p>
						</li>
						<li className="home-page__process-step">
							<span className="home-page__process-number">2</span>
							<h3 className="home-page__process-step-title">We Confirm</h3>
							<p className="home-page__process-step-text">
								We verify availability and reach out to you
							</p>
						</li>
						<li className="home-page__process-step">
							<span className="home-page__process-number">3</span>
							<h3 className="home-page__process-step-title">Secure Payment</h3>
							<p className="home-page__process-step-text">
								Complete your purchase knowing your piece is reserved
							</p>
						</li>
					</ul>
				</div>
			</section>

			{/* --- WORKSHOPS --- */}
			<div className="home-page__workshops">
				<div className="home-page__workshops-content container">
					<div className="home-page__workshops-info">
						<span>Workshops</span>
						<h2 className="home-page__workshops-title main-title">
							Introduction to Brooch Making
						</h2>
						<article className="home-page__workshops-text text">
							Learn the fundamentals of brooch crafting in this
							beginner-friendly workshop.
						</article>
						<div className="home-page__workshops-details">
							<div className="home-page__workshops-duration">
								<h4>Duration</h4>
								<span>3 hours</span>
							</div>
							<div className="home-page__workshops-group">
								<h4>Group Size</h4>
								<span>6 participants</span>
							</div>
							<div className="home-page__workshops-price">
								<h4>Price</h4>
								<span>€85</span>
							</div>
						</div>
						<SecondaryBtn
							variant="to-other-page"
							to="/about"
						>
							See all workshops
						</SecondaryBtn>
					</div>
					<img
						className="home-page__workshops-image"
						src={WorkshopsImage}
						alt="Workshop image"
					/>
				</div>
			</div>

			{/* --- SUBSCRIBE SECTION --- */}
			<section className="home-page__subscription container">
				<Sparkles className="home-page__subscription-icon" />
				<h1 className="home-page__subscription-title main-title">
					Join Our Enchanted Circle
				</h1>
				<p className="home-page__subscription-info">
					Subscribe to receive updates about new pieces and workshops
				</p>
				<div className="home-page__subscription-action">
					<input
						className="home-page__subscription-input"
						type="text"
						// placeholder={dict.placeholder}
					/>

					<PrimaryBtn
						variant="subscription"
						type="button"
					>
						Subscribe
					</PrimaryBtn>
				</div>
			</section>
		</section>
	);
};

export default HomePage;

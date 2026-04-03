//HomePage
import HomeAboutImage from "../assets/images/home_about_image.jpeg";
import MagicBadge from "../components/MagicBadge";
import { PrimaryBtn } from "../components/PrimaryBtn";

import { Sparkles, ChevronRight, Star, Globe, Shield } from "lucide-react";
import { SecondaryBtn } from "../components/SecondaryBtn";
import { ProductCard } from "../components/ProductCard";

const HomePage = () => {
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
							<h2 className="home-page__new-arrivals-title">New Arrivals</h2>
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
						<ProductCard />
					</div>
				</div>
			</section>

			{/* --- COLLECTIONS --- */}
			<section className="home-page__new-collections">
				<div className="container">
					<h2 className="home-page__new-collections-title">
						Explore Collections
					</h2>
					<div className="home-page__new-collections-cards"></div>
				</div>
			</section>
			{/* --- PROCESS SECTION --- */}
			<section className="home-page__process">
				<div className="container">
					<div className="home-page__process-header">
						<h2 className="home-page__process-title">
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
						<h2 className="home-page__about-title">
							Where Magic Meets Craftsmanship
						</h2>
						<article className="home-page__about-text">
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

			{/* --- SUBSCRIBE SECTION --- */}
			<section className="home-page__subscription container">
				<Sparkles className="home-page__subscription-icon" />
				<h1 className="home-page__subscription-title">
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

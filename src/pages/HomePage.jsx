//HomePage
import { useMemo } from "react";

import { useLanguage } from "../context/LanguageContext";
import HomePageContent from "../content/pages/home-page.json";

import MagicBadge from "../components/MagicBadge";
import { PrimaryBtn } from "../components/PrimaryBtn";

import { Sparkles, ChevronRight, Star, Globe, Shield } from "lucide-react";
import { SecondaryBtn } from "../components/SecondaryBtn";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../context/ProductsContext";

import { useWorkshops } from "../context/WorkshopsContext";
import { getVisibleWorkshops } from "../hooks/useVisibleWorkshops";

import WorkshopsPageContent from "../content/pages/workshops-page.json";
import { ProcessSection } from "../components/ProcessSection";

const WorkshopsImage = "/uploads/images/home_workshop_image.jpeg";

const HomePage = ({ workshop }) => {
	const products = useProducts();
	const workshops = useWorkshops();

	// For language switching
	const { currentLang } = useLanguage();
	const t = (field) => field?.[currentLang] ?? field?.en ?? "";

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

	// To show only active workshops
	const visibleWorkshops = useMemo(() => {
		return getVisibleWorkshops(workshops);
	}, [workshops]);
	const featuredWorkshop = visibleWorkshops[0] || null;

	// To show collection title images
	const collections = useMemo(() => {
		return HomePageContent.collections.set.slice(0, 4);
	}, []);

	return (
		<section className="home-page">
			<section className="home-page__top">
				<div className="home-page__top-content container">
					<MagicBadge>✦ {t(HomePageContent.hero.badge)} ✦</MagicBadge>
					<h1 className="home-page__top-title">
						{t(HomePageContent.hero.title)}
					</h1>
					<p className="home-page__top-text">{t(HomePageContent.hero.text)}</p>

					<PrimaryBtn
						variant="to-catalog"
						to="/shop"
					>
						{t(HomePageContent.hero.button.label)}
					</PrimaryBtn>
				</div>
			</section>
			{/* --- HIGHLIGHTS --- */}
			<div className="home-page__highlights">
				<ul className="home-page__highlights-list container">
					<li className="home-page__highlights-item">
						<Sparkles />
						{t(HomePageContent.highlights[0]["text-sparkles"])}
					</li>
					<li className="home-page__highlights-item">
						<Star />
						{t(HomePageContent.highlights[1]["text-star"])}
					</li>
					<li className="home-page__highlights-item">
						<Globe />
						{t(HomePageContent.highlights[2]["text-globe"])}
					</li>
					<li className="home-page__highlights-item">
						<Shield />
						{t(HomePageContent.highlights[3]["text-shield"])}
					</li>
				</ul>
			</div>

			{/* --- NEW ARRIVALS --- */}
			<section className="home-page__new-arrivals">
				<div className="container">
					<div className="home-page__new-arrivals-top">
						<div>
							<h2 className="home-page__new-arrivals-title main-title">
								{t(HomePageContent.newArrivals.title)}
							</h2>
							<p className="home-page__new-arrivals-info">
								{t(HomePageContent.newArrivals.text)}
							</p>
						</div>
						<button
							className="home-page__to-catalog-btn"
							variant="to-catalog"
							to="/shop"
						>
							{t(HomePageContent.newArrivals.button.label)}
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
						{t(HomePageContent.collections.title)}
					</h2>
					{/* <div className="home-page__collections-cards">
						{collections.map((collection) => (
							<div className="home-page__collections-card">
								<img
									key={collection.name.en}
									src={collection.src}
									alt={t(collection.name)}
								/>{" "}
								<span>{t(collection.group)}</span>
								<h3>{t(collection.name)}</h3>
							</div>
						))}
					</div> */}
					<div className="home-page__collections-cards">
						{collections.map((collection) => (
							<div
								key={t(collection.name.en)}
								className="home-page__collections-card"
							>
								<img
									className="home-page__collections-card-image"
									src={collection.src}
									alt={t(collection.name)}
								/>

								<div className="home-page__collections-card-overlay"></div>

								<div className="home-page__collections-card-text">
									<span className="home-page__collections-card-group">
										{t(collection.group)}
									</span>
									<h3 className="home-page__collections-card-title">
										{t(collection.name)}
									</h3>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* --- ABOUT SECTION --- */}
			<section className="home-page__about">
				<div className="home-page__about-content container">
					<img
						className="home-page__about-image"
						src={HomePageContent.about.image?.src || null}
						alt={t(HomePageContent.about.image.alt)}
					/>
					<div className="home-page__about-info">
						<span>{t(HomePageContent.about.eyebrow)}</span>
						<h2 className="home-page__about-title main-title">
							{t(HomePageContent.about.title)}
						</h2>
						<article className="home-page__about-text text">
							{t(HomePageContent.about.text)}
						</article>
						<SecondaryBtn
							variant="to-other-page"
							to="/about"
						>
							{t(HomePageContent.about.button.label)}
						</SecondaryBtn>
					</div>
				</div>
			</section>

			{/* --- PROCESS SECTION --- */}
			{/* <section className="home-page__process">
				<div className="container">
					<div className="home-page__process-header">
						<h2 className="home-page__process-title main-title">
							{t(HomePageContent.process.title)}
						</h2>
						<p className="home-page__process-text">
							{t(HomePageContent.process.text)}
						</p>
					</div>
					<ul className="home-page__process-steps">
						<li className="home-page__process-step">
							<span className="home-page__process-number">1</span>
							<h3 className="home-page__process-step-title">
								{t(HomePageContent.process.steps[0]["title-one"])}
							</h3>
							<p className="home-page__process-step-text">
								{t(HomePageContent.process.steps[0]["text-one"])}
							</p>
						</li>
						<li className="home-page__process-step">
							<span className="home-page__process-number">2</span>
							<h3 className="home-page__process-step-title">
								{t(HomePageContent.process.steps[1]["title-two"])}
							</h3>
							<p className="home-page__process-step-text">
								{t(HomePageContent.process.steps[1]["text-two"])}
							</p>
						</li>
						<li className="home-page__process-step">
							<span className="home-page__process-number">3</span>
							<h3 className="home-page__process-step-title">
								{t(HomePageContent.process.steps[2]["title-three"])}
							</h3>
							<p className="home-page__process-step-text">
								{t(HomePageContent.process.steps[2]["text-three"])}
							</p>
						</li>
					</ul>
				</div>
			</section> */}
			<ProcessSection
				title={t(HomePageContent.process.title)}
				text={t(HomePageContent.process.text)}
				titleOne={t(HomePageContent.process.steps[0]["title-one"])}
				textOne={t(HomePageContent.process.steps[0]["text-one"])}
				titleTwo={t(HomePageContent.process.steps[1]["title-two"])}
				textTwo={t(HomePageContent.process.steps[1]["text-two"])}
				titleThree={t(HomePageContent.process.steps[2]["title-three"])}
				textThree={t(HomePageContent.process.steps[2]["text-three"])}
			/>

			{/* --- WORKSHOPS --- */}
			<div className="home-page__workshops">
				<div className="home-page__workshops-content container">
					<div className="home-page__workshops-info">
						<span>{t(HomePageContent.workshops.eyebrow)}</span>

						{!featuredWorkshop ? (
							<div className="home-page__workshops__empty">
								<div className="workshops-empty__content">
									<h2 className="workshops-empty__title main-title">
										{t(WorkshopsPageContent.emptyState.title)}
									</h2>
									{WorkshopsPageContent.emptyState.info.paragraphs.map(
										(paragraph, index) => (
											<article
												key={index}
												className="workshops-empty__info text"
											>
												{t(paragraph)}
											</article>
										),
									)}
								</div>
							</div>
						) : (
							<div className="home-page__workshops-card">
								<h2 className="home-page__workshops-title main-title">
									{t(featuredWorkshop.title)}
								</h2>

								<article className="home-page__workshops-text text">
									{t(featuredWorkshop.description)}
								</article>

								<div className="home-page__workshops-details">
									<div className="home-page__workshops-duration">
										<h4>Duration</h4>
										<span>
											{featuredWorkshop.duration?.value}{" "}
											{t(featuredWorkshop.duration?.unit)}
										</span>
									</div>

									<div className="home-page__workshops-group">
										<h4>Group Size</h4>
										<span>
											{featuredWorkshop.participants["amount-of-people"]}{" "}
										</span>
									</div>

									<div className="home-page__workshops-price">
										<h4>Price</h4>
										<span>
											{featuredWorkshop.currency === "EUR"
												? "€"
												: workshop.currency}
											{featuredWorkshop.price}
										</span>
									</div>
								</div>
								<SecondaryBtn
									variant="to-other-page"
									to="/about"
								>
									{t(HomePageContent.workshops.button.label)}
								</SecondaryBtn>
							</div>
						)}
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
					{t(HomePageContent.subscription.title)}
				</h1>
				<p className="home-page__subscription-info">
					{t(HomePageContent.subscription.text)}
				</p>
				<div className="home-page__subscription-action">
					<input
						className="home-page__subscription-input"
						type="text"
						placeholder={t(HomePageContent.subscription.placeholder)}
					/>

					<PrimaryBtn
						variant="subscription"
						type="button"
					>
						{t(HomePageContent.subscription.buttonLabel)}
					</PrimaryBtn>
				</div>
			</section>
		</section>
	);
};

export default HomePage;

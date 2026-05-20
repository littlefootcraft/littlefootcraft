//HomePage
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import HomePageContent from "../content/pages/home-page.json";
// import CollectionsContent from "../content/collections/collections.json";

// CONTEXTS
import { useWorkshops } from "../context/WorkshopsContext";
import { useProducts } from "../context/ProductsContext";
import WorkshopsPageContent from "../content/pages/workshops-page.json";
import { useLanguage } from "../context/LanguageContext";

// HOOKS
import { getVisibleWorkshops } from "../hooks/useVisibleWorkshops";
import { useSubscribe } from "../hooks/useSubscribe";

// COMPONENTS
import { PrimaryBtn } from "../components/PrimaryBtn";
import MagicBadge from "../components/MagicBadge";
import { SecondaryBtn } from "../components/SecondaryBtn";
import { ProductCard } from "../components/ProductCard";
import { ProcessSection } from "../components/ProcessSection";

// ICONS
import { Sparkles, ChevronRight, Star, Globe, Shield } from "lucide-react";

// SEO
import Seo from "../components/Seo";

import { subscriptiopnEN, subscriptiopnUA } from "../translations/translation";

const WorkshopsImage = "/uploads/images/home_workshop_image.jpeg";

// GET COLLECTIONS
const collectionModules = import.meta.glob("../content/collections/*.json", {
	eager: true,
});

const collectionsData = Object.values(collectionModules).map(
	(module) => module.default ?? module,
);

const HomePage = ({ workshop }) => {
	const products = useProducts();
	const workshops = useWorkshops();

	// For language switching
	const { currentLang } = useLanguage();
	const t = (field) => field?.[currentLang] ?? field?.en ?? "";
	const dict = currentLang === "en" ? subscriptiopnEN : subscriptiopnUA;

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

	// TO SHOW COLLECTION TITLES
	const collections = useMemo(() => {
		return [...collectionsData]
			.filter((collection) => collection.image)
			.sort(() => Math.random() - 0.5)
			.slice(0, 4);
	}, []);

	// Subscription
	const {
		email,
		setEmail,
		status,
		message,
		subscribe,
		clearMessage,
		interests,
		toggleInterest,
	} = useSubscribe(dict);

	const [showTopics, setShowTopics] = useState(false);

	return (
		<section className="home-page">
			<Seo
				title={t(HomePageContent.seo.title)}
				description={t(HomePageContent.seo.description)}
				image={HomePageContent.seo.image}
				imageAlt={t(HomePageContent.seo.imageAlt)}
				url={`/${currentLang}`}
			/>
			<section className="home-page__top">
				<div className="home-page__top-content container">
					<MagicBadge>✦ {t(HomePageContent.hero.badge)} ✦</MagicBadge>
					<h1 className="home-page__top-title">
						{t(HomePageContent.hero.title)}
					</h1>
					<p className="home-page__top-text">{t(HomePageContent.hero.text)}</p>

					<div className="home-page__top-btn__wrap">
						<PrimaryBtn
							variant="to-shop"
							to={`/${currentLang}/shop`}
						>
							{t(HomePageContent.hero.button.label)}
						</PrimaryBtn>
					</div>
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
						<Link
							className="home-page__to-catalog-btn"
							variant="to-shop"
							to={`/${currentLang}/shop`}
						>
							<span>{t(HomePageContent.newArrivals.button.label)}</span>
							<ChevronRight />
						</Link>
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

					<div className="home-page__collections-cards">
						{collections.map((collection) => (
							<Link
								// key={`${collection.group?.en}-${collection.id}`}
								key={collection.id}
								// to={`/${currentLang}/shop?collection=${encodeURIComponent(collection.name.en)}`}
								to={`/${currentLang}/shop?collection=${encodeURIComponent(collection.id)}`}
								className="home-page__collections-card"
							>
								<img
									className="home-page__collections-card-image"
									src={collection.image}
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
							</Link>
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
							to={`/${currentLang}/about`}
						>
							{t(HomePageContent.about.button.label)}
						</SecondaryBtn>
					</div>
				</div>
			</section>

			{/* --- PROCESS SECTION --- */}

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
									to={`/${currentLang}/workshops`}
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
				<h2 className="home-page__subscription-title main-title">
					{t(HomePageContent.subscription.title)}
				</h2>
				<p className="home-page__subscription-info">
					{t(HomePageContent.subscription.text)}
				</p>

				<div className="home-page__subscription-topics">
					<label className="home-page__subscription-topic">
						<input
							type="checkbox"
							checked={interests.includes("workshops")}
							onChange={() => toggleInterest("workshops")}
						/>
						<span>{dict.workshopsLabel}</span>
					</label>

					<label className="home-page__subscription-topic">
						<input
							type="checkbox"
							checked={interests.includes("master-classes")}
							onChange={() => toggleInterest("master-classes")}
						/>
						<span>{dict.masterClassesLabel}</span>
					</label>

					<label className="home-page__subscription-topic">
						<input
							type="checkbox"
							checked={interests.includes("sales")}
							onChange={() => toggleInterest("sales")}
						/>
						<span>{dict.salesLabel}</span>
					</label>
				</div>

				<div className="home-page__subscription-action">
					<input
						type="email"
						className="home-page__subscription-input"
						value={email}
						placeholder={dict.placeholder}
						onChange={(event) => {
							setEmail(event.target.value);
							clearMessage();
						}}
						aria-label={dict.ariaLabel}
						onFocus={() => setShowTopics(true)}
					/>

					<PrimaryBtn
						variant="subscription"
						type="button"
						onClick={subscribe}
						disabled={status === "loading"}
					>
						{dict.buttonLabel}
					</PrimaryBtn>
					<p
						className={`home-page__subscription-message ${
							message ? `home-page__subscription-message--${status}` : ""
						}`}
					>
						{message}
					</p>
				</div>
			</section>
		</section>
	);
};

export default HomePage;

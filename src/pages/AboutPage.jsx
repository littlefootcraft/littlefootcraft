//AboutPage.jsx
import AboutPageContent from "../content/pages/about-page.json";

// CONTEXTS
import { useLanguage } from "../context/LanguageContext";

// COMPONENTS
import { PrimaryBtn } from "../components/PrimaryBtn";

// ICONS
import { WandSparkles, Star, Heart, Gem, Sparkles } from "lucide-react";

import Seo from "../components/Seo";

const AboutPage = () => {
	// For language switching
	const { currentLang } = useLanguage();
	const t = (field) => field?.[currentLang] ?? field?.en ?? "";
	return (
		<section className="about">
			<Seo
				title={t(AboutPageContent.seo.title)}
				description={t(AboutPageContent.seo.description)}
				image={AboutPageContent.seo.image}
				imageAlt={t(AboutPageContent.seo.imageAlt)}
				url={`/${currentLang}/about`}
			/>

			<section className="about__top">
				<div className="about__top-content container">
					<div className="about__top-info">
						<span>{t(AboutPageContent.top.eyebrow)}</span>
						<h2 className="about__top-title main-title">
							{t(AboutPageContent.top.title)}
						</h2>
						<article className="about__top-text text">
							{t(AboutPageContent.top.text)}
						</article>
					</div>
					<img
						className="about__top-image"
						src={AboutPageContent.top.image.src}
						alt={t(AboutPageContent.top.image.alt)}
					/>
				</div>
			</section>
			<section className="about__story">
				<div className="about__story-content container">
					<h2 className="about__story-title main-title">
						{t(AboutPageContent.story.title)}
					</h2>
					{AboutPageContent.story.paragraphs.map((paragraph, index) => (
						<article
							key={index}
							className="about__story-text text"
						>
							{t(paragraph)}
						</article>
					))}
				</div>
			</section>
			<section className="about__values">
				<div className="container">
					<div className="about__values-header">
						<h2 className="about__values-title main-title">
							{t(AboutPageContent.values.title)}
						</h2>
						<p className="about__values-text">
							{t(AboutPageContent.values.text)}
						</p>
					</div>
					<div className="about__values-items">
						<div className="about__values-item">
							<WandSparkles className="about__values-item-icon" />
							<h4 className="about__values-item-title">
								{t(AboutPageContent.values.items[0]["title"])}
							</h4>
							<p className="about__values-item-text">
								{t(AboutPageContent.values.items[0]["text"])}
							</p>
						</div>
						<div className="about__values-item">
							<Star className="about__values-item-icon" />
							<h4 className="about__values-item-title">
								{t(AboutPageContent.values.items[1]["title"])}
							</h4>
							<p className="about__values-item-text">
								{t(AboutPageContent.values.items[1]["text"])}
							</p>
						</div>
						<div className="about__values-item">
							<Heart className="about__values-item-icon" />
							<h4 className="about__values-item-title">
								{t(AboutPageContent.values.items[2]["title"])}
							</h4>
							<p className="about__values-item-text">
								{t(AboutPageContent.values.items[2]["text"])}
							</p>
						</div>
						<div className="about__values-item">
							<Gem className="about__values-item-icon" />
							<h4 className="about__values-item-title">
								{t(AboutPageContent.values.items[3]["title"])}
							</h4>
							<p className="about__values-item-text">
								{t(AboutPageContent.values.items[3]["text"])}
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="about__cta">
				<div className="about__cta-content container">
					<Sparkles className="about__cta-icon" />

					<h2 className="about__cta-title main-title">
						{t(AboutPageContent.cta.title)}
					</h2>

					<p className="about__cta-text">{t(AboutPageContent.cta.text)}</p>

					<div>
						<PrimaryBtn
							className="about__cta-button"
							variant="to-shop"
							to={`/${currentLang}${AboutPageContent.cta.button.to}`}
						>
							{t(AboutPageContent.cta.button.label)}
						</PrimaryBtn>
					</div>
				</div>
			</section>
		</section>
	);
};

export default AboutPage;

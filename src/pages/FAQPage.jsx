//FAQPage.jsx

import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import faqQuestions from "../content/pages/faq.json";
import { PageTopTitle } from "../components/PageTopTitle";
// import { Accordion } from "../components/Accordion";
import {
	Heart,
	Truck,
	RefreshCw,
	Package,
	ChevronDown,
	CalendarX,
} from "lucide-react";
import Seo from "../components/Seo";

const SECTION_ICONS = {
	about_handmade: Heart,
	shipping: Truck,
	returns_and_care: RefreshCw,
	order_and_payment: Package,
	other_questions: Heart,
	workshop_cancellation: CalendarX,
};

const FAQPage = () => {
	// For language switching
	const { currentLang } = useLanguage();
	const t = (field) => field?.[currentLang] ?? field?.en ?? "";

	// State for tracking which question is open in the accordion
	const [openQuestion, setOpenQuestion] = useState({});

	const handleToggle = (sectionKey, questionId) => {
		setOpenQuestion((current) => ({
			...current,
			[sectionKey]: current?.[sectionKey] === questionId ? null : questionId,
		}));
	};

	return (
		<div className="faq-page">
			<Seo
				title={t(faqQuestions.seo.title)}
				description={t(faqQuestions.seo.description)}
				image={faqQuestions.seo.image}
				imageAlt={t(faqQuestions.seo.imageAlt)}
				url={`/${currentLang}/faq`}
			/>
			<PageTopTitle
				title={t(faqQuestions.title)}
				subtitle={t(faqQuestions.subtitle)}
			/>

			<div className="faq-page__content container">
				{Object.entries(faqQuestions.sections).map(([sectionKey, section]) => {
					const Icon = SECTION_ICONS[sectionKey];
					return (
						<section className="faq-page__section">
							<div className="faq-page__section-header">
								<div className="faq-page__section-icon-wrap">
									{Icon && <Icon className="faq-page__section-icon" />}
								</div>
								<h2 className="faq-page__section-title">{t(section.title)}</h2>
							</div>
							<div className="faq-page__accordion-list">
								{section.items.map((question, index) => {
									const itemId = `${sectionKey}-${index}`;
									const isOpen = openQuestion[sectionKey] === itemId;
									return (
										<div
											key={itemId}
											className={`faq-page__accordion ${
												isOpen ? "faq-page__accordion--open" : ""
											}`}
										>
											<button
												type="button"
												className="faq-page__accordion-trigger"
												onClick={() => handleToggle(sectionKey, itemId)}
												aria-expanded={isOpen}
												aria-controls={`${itemId}-content`}
											>
												<span className="faq-page__accordion-question">
													{t(question.question)}
												</span>
												<span className="faq-page__accordion-symbol">
													{isOpen ? <ChevronDown /> : <ChevronDown />}
												</span>
											</button>
											{isOpen && (
												<div
													className="faq-page__accordion-answer"
													id={`${itemId}-content`}
												>
													{Array.isArray(question.answer) ? (
														<div className="faq-page__care">
															{question.answer.map((block, blockIndex) => (
																<div
																	key={blockIndex}
																	className="faq-page__care-block"
																>
																	<p className="faq-page__care-title">
																		{t(block.type)}
																	</p>

																	<ul className="faq-page__care-list">
																		{block.care.map((item, itemIndex) => (
																			<li
																				key={itemIndex}
																				className="faq-page__care-item"
																			>
																				{t(item)}
																			</li>
																		))}
																	</ul>

																	{block.additional && (
																		<p className="faq-page__care-note">
																			{t(block.additional)}
																		</p>
																	)}
																</div>
															))}
														</div>
													) : (
														t(question.answer)
													)}
												</div>
											)}
										</div>
									);
								})}
							</div>
						</section>
					);
				})}
			</div>
		</div>
	);
};

export default FAQPage;

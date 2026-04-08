//WorkshopCard.jsx

import { useLanguage } from "../context/LanguageContext";
import { Clock3, Users, MapPin } from "lucide-react";
import { PrimaryBtn } from "./PrimaryBtn";

export const WorkshopCard = ({ workshop }) => {
	// For language switching
	const { currentLang } = useLanguage();
	const t = (field) => field?.[currentLang] ?? field?.en ?? "";

	// Torn date from "2026-02-14" to Feb 14
	// const formatDate = (dateStr, lang = "en") => {
	// 	return new Intl.DateTimeFormat(lang, {
	// 		month: "short",
	// 		day: "numeric",
	// 	}).format(new Date(dateStr));
	// };
	const formatDate = (dateStr, lang = "en") => {
		const locale = lang === "ua" ? "uk-UA" : "en-US";

		return new Intl.DateTimeFormat(locale, {
			day: "numeric",
			month: "long",
		}).format(new Date(dateStr));
	};

	return (
		<div className="workshop-card">
			<img
				className="workshop-card__image"
				src={workshop.image?.src}
				alt={
					workshop.image?.alt?.[currentLang] ?? workshop.image?.alt?.en ?? ""
				}
			/>

			<div className="workshop-card__content">
				<div>
					<h2 className="workshop-card__title main-title">
						{t(workshop.title)}
					</h2>
				</div>

				<p className="workshop-card__subtitle">{t(workshop.subtitle)}</p>

				<p className="workshop-card__meta">
					<span>
						<Clock3 />
						{workshop.duration?.value} {t(workshop.duration?.unit)}
					</span>
					<span>
						<Users />
						{workshop.participants["amount-of-people"]}{" "}
						{t(workshop.participants.text)}
					</span>
					<span>
						<MapPin />
						{t(workshop.location)}
					</span>
				</p>
				<div className="workshop-card__calendar">
					<span className="workshop-card__calendar-title">
						{t(workshop.upcomingDates.title)}
					</span>
					<ul className="workshop-card__calendar-items">
						{workshop.upcomingDates.dates.map((date) => (
							<li
								key={date}
								className="workshop-card__calendar-item"
							>
								{formatDate(date, currentLang)}
							</li>
						))}
					</ul>
				</div>

				<div className="workshop-card__footer">
					<p className="workshop-card__price">
						{workshop.currency === "EUR" ? "€" : workshop.currency}
						{workshop.price}
					</p>
					<PrimaryBtn
						variant="booking"
						to="/shop"
					>
						Book now
					</PrimaryBtn>
				</div>
			</div>
		</div>
	);
};

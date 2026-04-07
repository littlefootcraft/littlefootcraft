//WorkshopCard.jsx

import { useLanguage } from "../context/LanguageContext";
import { Clock3, Users, MapPin } from "lucide-react";
import { PrimaryBtn } from "./PrimaryBtn";

export const WorkshopCard = ({ workshop }) => {
	const { currentLang } = useLanguage();

	// Torn date from "2026-02-14" to Feb 14
	const formatDate = (dateStr, lang = "en") => {
		return new Intl.DateTimeFormat(lang, {
			month: "short",
			day: "numeric",
		}).format(new Date(dateStr));
	};

	return (
		<div className="workshop-card">
			<img
				className="workshop-card__image"
				src={workshop.image?.src}
				alt={workshop.image?.alt?.[currentLang]}
			/>

			<div className="workshop-card__content">
				<div>
					<h2 className="workshop-card__title main-title">
						{workshop.title?.[currentLang]}
					</h2>
					<span>In person</span>
				</div>

				<p className="workshop-card__subtitle">
					{workshop.subtitle?.[currentLang]}
				</p>

				<p className="workshop-card__meta">
					<span>
						<Clock3 />
						{workshop.duration?.value} {workshop.duration?.unit}
					</span>
					<span>
						<Users />
						up to {workshop.participants?.max} participants
					</span>
					<span>
						<MapPin />
						{workshop.location}
					</span>
				</p>
				<div className="workshop-card__calendar">
					<span className="workshop-card__calendar-title">Upcoming Dates</span>
					<ul className="workshop-card__calendar-items">
						{workshop.upcomingDates.map((date) => (
							<li className="workshop-card__calendar-item">
								{formatDate(date, currentLang)}
							</li>
						))}
					</ul>
				</div>

				<div className="workshop-card__footer">
					<p className="workshop-card__price">€{workshop.price}</p>
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

//WorkshopCard.jsx

import { useState } from "react";

// CONTEXTS
import { useLanguage } from "../context/LanguageContext";

// COMPONENTS
import { WorkshopBookingModal } from "../components/WorkshopBookingModal";
import { PrimaryBtn } from "./PrimaryBtn";

// ICONS
import { Clock3, Users, MapPin, CalendarClock } from "lucide-react";

// UTILS
import { formatPrice } from "../utils/formatPrice";

import { buttonsEN, buttonsUA } from "../translations/translation";

export const WorkshopCard = ({ workshop }) => {
	const [isBookingOpen, setIsBookingOpen] = useState(false);
	// For language switching
	const { currentLang } = useLanguage();
	const t = (field) => field?.[currentLang] ?? field?.en ?? "";
	const dict = currentLang === "en" ? buttonsEN : buttonsUA;

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
				<div className="workshop-card__details">
					{workshop.time && (
						<p className="workshop-card__detail">
							<CalendarClock />
							<span>{t(workshop.time)}</span>
						</p>
					)}

					{workshop.exactLocation && (
						<p className="workshop-card__detail">
							<MapPin />
							<span>{t(workshop.exactLocation)}</span>
						</p>
					)}
				</div>
				{workshop.includes && (
					<div className="workshop-card__includes">
						<span className="workshop-card__includes-title">
							{currentLang === "ua" ? "Що включено" : "What's Included"}
						</span>

						<ul className="workshop-card__includes-list">
							{t(workshop.includes)?.map((item) => (
								<li
									key={item}
									className="workshop-card__includes-item"
								>
									{item}
								</li>
							))}
						</ul>
					</div>
				)}
				{workshop.description && (
					<p className="workshop-card__description">
						{t(workshop.description)}
					</p>
				)}
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
					<p className="workshop-card__price">{formatPrice(workshop.price)}</p>
					<div>
						<PrimaryBtn
							variant="booking"
							type="button"
							onClick={() => setIsBookingOpen(true)}
						>
							{dict.bookNow}
						</PrimaryBtn>
					</div>
				</div>
			</div>
			<WorkshopBookingModal
				isOpen={isBookingOpen}
				onClose={() => setIsBookingOpen(false)}
				currentLang={currentLang}
				workshop={workshop}
			/>
		</div>
	);
};

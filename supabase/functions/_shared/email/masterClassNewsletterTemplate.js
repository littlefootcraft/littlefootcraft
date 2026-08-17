import { emailLayout } from "./layout.js";

const formatDate = (date, language) => {
	return new Intl.DateTimeFormat(language === "ua" ? "uk-UA" : "en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(new Date(`${date}T00:00:00`));
};

export const masterClassNewsletterTemplate = ({
	type,
	workshop,
	language,
	reminderDate,
	subscriberId,
	customMessage = "",
}) => {
	const isUA = language === "ua";

	const title = workshop.title?.[language] ?? "";
	const subtitle = workshop.subtitle?.[language] ?? "";
	const description = workshop.description?.[language] ?? "";

	const allDates = workshop.upcomingDates?.dates ?? [];

	const datesHtml = allDates
		.map(
			(date) => `
				<li style="margin-bottom: 6px;">
					${formatDate(date, language)}
				</li>
			`,
		)
		.join("");

	const reminderDateText = reminderDate
		? formatDate(reminderDate, language)
		: "";

	const imageHtml = workshop.image?.src
		? `
			<div style="text-align: center; margin-bottom: 24px;">
				<img
					src="https://littlefootcraft.art${workshop.image.src}"
					alt="${workshop.image.alt?.[language] ?? title}"
					style="
						max-width: 100%;
						height: auto;
						border-radius: 14px;
					"
				/>
			</div>
		`
		: "";

	let content = "";

	if (type === "new-master-class") {
		content = `
			${imageHtml}

			<p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
				${subtitle}
			</p>

			<p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
				${customMessage.trim() || description}
			</p>

			<p style="color: #1a2b4c; font-weight: bold; font-size: 16px;">
				${workshop.upcomingDates?.title?.[language] ?? ""}
			</p>

			<ul style="color: #4a5568; line-height: 1.6;">
				${datesHtml}
			</ul>

			<p style="color: #4a5568; font-size: 16px; line-height: 1.8;">
				<strong>${isUA ? "Час" : "Time"}:</strong>
				${workshop.time?.[language] ?? ""}
				<br />

				<strong>${isUA ? "Тривалість" : "Duration"}:</strong>
				${workshop.duration?.value ?? ""}
				${workshop.duration?.unit?.[language] ?? ""}
				<br />

				<strong>${isUA ? "Формат" : "Format"}:</strong>
				${workshop.location?.[language] ?? ""}
				<br />

				<strong>${isUA ? "Вартість" : "Price"}:</strong>
				€${workshop.price ?? ""}
			</p>
		`;
	}

	if (type === "master-class-reminder") {
		content = `
			${imageHtml}

			<p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
				${
					customMessage.trim() ||
					(isUA
						? "Майстер-клас уже зовсім скоро ✨ Ще є час приєднатися."
						: "This master class is coming up soon ✨ There is still time to join us.")
				}
			</p>

			<p style="color: #1a2b4c; font-size: 17px; line-height: 1.8;">
				<strong>${isUA ? "Дата" : "Date"}:</strong>
				${reminderDateText}
				<br />

				<strong>${isUA ? "Час" : "Time"}:</strong>
				${workshop.time?.[language] ?? ""}
				<br />

				<strong>${isUA ? "Місце" : "Location"}:</strong>
				${workshop.exactLocation?.[language] ?? ""}
				<br />

				<strong>${isUA ? "Вартість" : "Price"}:</strong>
				€${workshop.price ?? ""}
			</p>
		`;
	}

	const footer = `
		<p
			style="
				color: #9ca3af;
				font-size: 12px;
				margin-top: 28px;
				text-align: center;
			"
		>
			${
				isUA
					? "Ви отримали цей лист, тому що підписалися на новини LittleFootCraft."
					: "You received this email because you subscribed to LittleFootCraft updates."
			}

			<br />

			<a
				href="https://littlefootcraft.art/${language}/unsubscribe?id=${subscriberId}"
				style="
					color: #9ca3af;
					text-decoration: underline;
				"
			>
				${isUA ? "Керувати підпискою" : "Manage subscription"}
			</a>
		</p>
	`;

	const emailTitle =
		type === "master-class-reminder"
			? isUA
				? `${title} — уже скоро`
				: `${title} — Coming Soon`
			: title;

	return emailLayout({
		title: emailTitle,
		content,
		buttonText: isUA ? "Забронювати місце" : "Book your place",
		buttonUrl: `https://littlefootcraft.art/${language}/workshops`,
		footer,
	});
};

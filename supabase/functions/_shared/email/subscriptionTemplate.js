import { emailLayout } from "./layout.js";

// // TRANSLATIONS
// import {
// 	newsletterEN,
// 	newsletterUA,
// } from "../../../../src/translations/translation.js";

const newsletterEN = {
	emailSubject: "Thank you for subscribing to LittleFootCraft",
	emailTitle: "Thank you for subscribing ✨",
	emailIntro:
		"You have successfully joined the magical LittleFootCraft community.",
	emailSubscribedTo: "You subscribed to:",
	emailUpdates: "We'll send you updates based on your selected topics.",
	emailButton: "Visit LittleFootCraft",
	emailClosing: "Warm wishes,",
	emailUnsubscribe:
		"You received this email because you subscribed to LittleFootCraft updates.",
	emailUnsubscribeButton: "Unsubscribe",

	interests: {
		workshops: "Workshops",
		sales: "Sales",
	},
};

const newsletterUA = {
	emailSubject: "Дякуємо за підписку на LittleFootCraft",
	emailTitle: "Дякуємо за підписку ✨",
	emailIntro: "Ви успішно приєдналися до магічної спільноти LittleFootCraft.",
	emailSubscribedTo: "Ви підписалися на:",
	emailUpdates: "Ми надсилатимемо вам новини відповідно до вибраних тем.",
	emailButton: "Відвідати сайт",
	emailClosing: "З теплом,",
	emailUnsubscribe:
		"Ви отримали цей лист, тому що підписалися на новини LittleFootCraft.",
	emailUnsubscribeButton: "Відписатися",

	interests: {
		workshops: "Майстер-класи",
		sales: "Знижки та пропозиції",
	},
};

export const subscriptionTemplate = ({ language, interests, subscriberId }) => {
	const emailDict = language === "ua" ? newsletterUA : newsletterEN;

	const selectedInterestList = interests
		.map((interest) => emailDict.interests?.[interest] ?? interest)
		.map((label) => `<li style="list-style: none;">✧ ${label}</li>`)
		.join("");

	const content = `
		<p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
			${emailDict.emailIntro}
		</p>

		<p style="color: #1a2b4c; font-weight: bold; font-size: 16px;">
			${emailDict.emailSubscribedTo}
		</p>

		<ul style="margin-top: 8px; padding-left: 0; color: #4a5568;">
			${selectedInterestList}
		</ul>

		<p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
			${emailDict.emailUpdates}
		</p>
	`;

	const footer = `
		<p
			style="
				color: #9ca3af;
				font-size: 12px;
				margin-top: 28px;
				text-align: center;
			"
		>
			${emailDict.emailUnsubscribe}
			<br />

			<a
				href="https://littlefootcraft.art/${language}/unsubscribe?id=${subscriberId}"
				style="color: #9ca3af; text-decoration: underline;"
			>
				${emailDict.emailUnsubscribeButton}
			</a>
		</p>
	`;

	const html = emailLayout({
		title: emailDict.emailTitle,
		content,
		buttonText: emailDict.emailButton,
		buttonUrl: "https://littlefootcraft.art",
		footer,
	});

	return {
		subject: emailDict.emailSubject,
		html,
	};
};

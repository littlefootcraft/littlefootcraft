import { emailLayout } from "./layout.js";

// TRANSLATIONS
import {
	newsletterEN,
	newsletterUA,
} from "../../../../src/translations/translation.js";

export const subscriptionTemplate = ({ language, interests, subscriberId }) => {
	const emailDict = language === "ua" ? newsletterUA : newsletterEN;

	// const interestLabels = {
	// 	en: {
	// 		workshops: "Workshops",
	// 		"master-classes": "Master classes",
	// 		sales: "Sales",
	// 	},
	// 	ua: {
	// 		workshops: "Воркшопи",
	// 		"master-classes": "Майстер-класи",
	// 		sales: "Знижки та пропозиції",
	// 	},
	// };

	const selectedInterestList = interests
		.map((interest) => emailDict.interest ?? interest)
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

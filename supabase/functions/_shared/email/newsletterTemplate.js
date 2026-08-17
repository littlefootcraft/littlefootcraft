//supabase/functions/_shared/email/newsletterTemplate.js
import { emailLayout } from "./layout.js";

export const newsletterTemplate = ({
	title,
	message,
	buttonText,
	buttonUrl,
	language,
	subscriberId,
}) => {
	const footerText =
		language === "ua"
			? "Ви отримали цей лист, тому що підписалися на новини LittleFootCraft."
			: "You received this email because you subscribed to LittleFootCraft updates.";

	const manageSubscriptionText =
		language === "ua" ? "Керувати підпискою" : "Manage subscription";

	const content = `
		<p
			style="
				color: #4a5568;
				font-size: 16px;
				line-height: 1.6;
			"
		>
			${message}
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
			${footerText}
			<br />

			<a
				href="https://littlefootcraft.art/${language}/unsubscribe?id=${subscriberId}"
				style="
					color: #9ca3af;
					text-decoration: underline;
				"
			>
				${manageSubscriptionText}
			</a>
		</p>
	`;

	return emailLayout({
		title,
		content,
		buttonText,
		buttonUrl,
		footer,
	});
};

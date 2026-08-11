import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

import { useLanguage } from "../context/LanguageContext";

// import { newsletterEN, newsletterUA } from "../translations/translation";

export const useSubscribe = (dict) => {
	// Current website language
	const { currentLang } = useLanguage();

	// Form state
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState("idle");
	const [message, setMessage] = useState("");

	// // Email translations
	// const emailDict = currentLang === "ua" ? newsletterUA : newsletterEN;

	// Newsletter interests
	const INTERESTS = ["workshops", "master-classes", "sales"];
	const [interests, setInterests] = useState(INTERESTS);

	// Toggle interest selection
	const toggleInterest = (interest) => {
		if (interests.includes(interest)) {
			setInterests(interests.filter((item) => item !== interest));
		} else {
			setInterests([...interests, interest]);
		}
	};

	// Reset feedback message
	const clearMessage = () => {
		setMessage("");
		setStatus("idle");
	};

	// Create newsletter subscription
	const subscribe = async () => {
		const trimmedEmail = email.trim().toLowerCase();

		setMessage("");
		setStatus("idle");

		if (!trimmedEmail) {
			setStatus("error");
			setMessage(dict.emptyEmailMessage);
			return;
		}

		// Validation: email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(trimmedEmail)) {
			setStatus("error");
			setMessage(dict.invalidEmailMessage);
			return;
		}

		// Validation: at least one interest selected
		if (interests.length === 0) {
			setStatus("error");
			setMessage(dict.emptyInterestsMessage);
			return;
		}

		setStatus("loading");

		// Save subscriber in Supabase
		const { data, error } = await supabase
			.from("subscribers")
			.insert({
				email: trimmedEmail,
				interests,
				language: currentLang,
			})
			.select()
			.single();

		// Handle database errors
		if (error) {
			setStatus("error");

			if (error.code === "23505") {
				setMessage(dict.alreadySubscribedMessage);
			} else {
				setMessage(dict.errorMessage);
			}

			return;
		}

		// // Interest labels for confirmation email
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

		// // Build selected interests list for email
		// const selectedInterestList = interests
		// 	.map((interest) => interestLabels[currentLang]?.[interest] ?? interest)
		// 	.map((label) => `<li style=list-style:none;>✧ ${label}</li>`)
		// 	.join("");

		// // Email subject
		// const confirmationSubject = emailDict.emailSubject;

		// // Confirmation email HTML
		// const confirmationHtml = `<div style="font-family: Verdana, sans-serif; background:#fdfbf7; padding:32px;">
		// 		<div style="max-width: 600px; margin: 0 auto; background:#ffffff; border:1px solid rgba(212,175,55,.35); border-radius:18px; padding:32px;">
		// 			<div style="text-align:center; margin-bottom:12px;">
		// 	      <img
		// 		      src="https://littlefootcraft.art/uploads/images/logo.png"
		// 		      alt="LittleFootCraft"
		// 		      style="width:180px; height:auto;"
		// 	      />
		//       </div>

		// 			<h1 style="color:#1a2b4c; margin:0 0 16px; font-size:28px; text-align:center;">
		// 				${emailDict.emailTitle}
		// 			</h1>

		// 			<p style="color:#4a5568; font-size:16px; line-height:1.6;">
		// 				${emailDict.emailIntro}
		// 			</p>

		// 			<p style="color:#1a2b4c; font-weight:bold; font-size:16px;">
		// 				${emailDict.emailSubscribedTo}
		// 			</p>

		// 			<ul style="margin-top:8px; color:#4a5568;">
		// 				${selectedInterestList}
		// 			</ul>

		// 			<p style="color:#4a5568; font-size:16px; line-height:1.6;">
		// 				${emailDict.emailUpdates}
		// 			</p>

		// 			<div style="text-align:center; margin-top:24px;">
		// 				<a
		// 					href="https://littlefootcraft.art"
		// 					style="display:inline-block; padding:12px 22px; background:#1a2b4c; 					color:#ffffff; text-decoration:none; border-radius:999px; font-size:15px;"
		// 				>
		// 					${emailDict.emailButton}
		// 				</a>
		// 			</div>

		// 			<p style="color:#9ca3af; font-size:12px; margin-top:28px; text-align:center;">
		// 				${emailDict.emailUnsubscribe}
		// 				<br />
		// 				<a
		// 					href="https://littlefootcraft.art/${currentLang}/unsubscribe?id=${data.id}"
		// 					style="color:#9ca3af; text-decoration:underline;"
		// 				>
		// 					${emailDict.emailUnsubscribeButton}
		// 				</a>
		// 			</p>
		// 		</div>
		// 	</div>`;

		// Send confirmation email
		const { error: emailError } = await supabase.functions.invoke(
			"resend-email",
			{
				body: {
					to: trimmedEmail,
					subject: confirmationSubject,
					html: confirmationHtml,
				},
			},
		);

		if (emailError) {
			console.log("Confirmation email error:", emailError);
		}

		setEmail("");
		setStatus("success");
		setMessage(dict.successMessage);
	};

	return {
		email,
		setEmail,
		status,
		message,
		subscribe,
		clearMessage,
		interests,
		toggleInterest,
	};
};

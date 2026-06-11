import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../context/LanguageContext";

export const useSubscribe = (dict) => {
	const { currentLang } = useLanguage();
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState("idle");
	const [message, setMessage] = useState("");

	// INTERESTS
	const INTERESTS = ["workshops", "master-classes", "sales"];
	const [interests, setInterests] = useState(INTERESTS);

	const toggleInterest = (interest) => {
		if (interests.includes(interest)) {
			setInterests(interests.filter((item) => item !== interest));
		} else {
			setInterests([...interests, interest]);
		}
	};

	const clearMessage = () => {
		setMessage("");
		setStatus("idle");
	};

	const subscribe = async () => {
		const trimmedEmail = email.trim().toLowerCase();

		setMessage("");
		setStatus("idle");

		if (!trimmedEmail) {
			setStatus("error");
			setMessage(dict.emptyEmailMessage);
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(trimmedEmail)) {
			setStatus("error");
			setMessage(dict.invalidEmailMessage);
			return;
		}

		if (interests.length === 0) {
			setStatus("error");
			setMessage(dict.emptyInterestsMessage);
			return;
		}

		setStatus("loading");

		const { error } = await supabase.from("subscribers").insert({
			email: trimmedEmail,
			interests,
			language: currentLang,
		});

		if (error) {
			setStatus("error");

			if (error.code === "23505") {
				setMessage(dict.alreadySubscribedMessage);
			} else {
				setMessage(dict.errorMessage);
			}

			return;
		}

		const interestLabels = {
			en: {
				workshops: "Workshops",
				"master-classes": "Master classes",
				sales: "Sales",
			},
			ua: {
				workshops: "Воркшопи",
				"master-classes": "Майстер-класи",
				sales: "Знижки та пропозиції",
			},
		};

		const selectedInterestList = interests
			.map((interest) => interestLabels[currentLang]?.[interest] ?? interest)
			.map((label) => `<li>${label}</li>`)
			.join("");

		const confirmationSubject =
			currentLang === "ua"
				? "Дякуємо за підписку на LittleFootCraft"
				: "Thank you for subscribing to LittleFootCraft";

		const confirmationHtml =
			currentLang === "ua"
				? `
			<div style="font-family: Arial, sans-serif; background:#fdfbf7; padding:32px;">
	    	<div style="max-width: 600px; margin: 0 auto; background:#ffffff; border:1px solid rgba(212,175,55,.35); border-radius:18px; padding:32px;">
		    	<h1 style="color:#1a2b4c; margin:0 0 16px; font-size:28px;">Дякуємо за підписку ✨</h1>

		    	<p style="color:#4a5568; font-size:16px; line-height:1.6;">
			    	Ви успішно приєдналися до магічної спільноти LittleFootCraft.
		    	</p>

		    	<p style="color:#1a2b4c; font-weight:bold; font-size:16px;">Ви підписалися на:</p>

		      	<ul style="padding-left:22px; margin-top:8px;">
			      	${selectedInterestList}
		      	</ul>

		    	<p style="color:#4a5568; font-size:16px; line-height:1.6;">
			    	Ми надсилатимемо вам новини відповідно до вибраних тем.
		    	</p>

		      <a href="https://littlefootcraft.art"
			      style="display:inline-block; margin-top:16px; padding:12px 22px; background:#1a2b4c; color:#ffffff; text-decoration:none;       border-radius:999px; font-size:15px;">
			      Відвідати сайт
		      </a>

		    	<p style="color:#9ca3af; font-size:13px; margin-top:28px;">
			    	З теплом,<br/>LittleFootCraft
		    	</p>
	    	</div>
    	</div>`
				: `<div style="font-family: Arial, sans-serif; background:#fdfbf7; padding:32px;">
	    	<div style="max-width:600px; margin:0 auto; background:#ffffff; border:1px solid rgba(212,175,55,.35); border-radius:18px; padding:32px;">
		    	<h1 style="color:#1a2b4c; margin:0 0 16px; font-size:28px;">Thank you for subscribing ✨</h1>

		      <p style="color:#4a5568; font-size:16px; line-height:1.6;">
			      You have successfully joined the magical LittleFootCraft community.
		      </p>

		      <p style="color:#1a2b4c; font-weight:bold; font-size:16px;">You subscribed to:</p>

		      <ul style="padding-left:22px; margin-top:8px;">
			      ${selectedInterestList}
		      </ul>

		      <p style="color:#4a5568; font-size:16px; line-height:1.6;">
			      We'll send you updates based on your selected topics.
		      </p>

					<a href="https://littlefootcraft.art"
						style="display:inline-block; margin-top:16px; padding:12px 22px; background:#1a2b4c; color:#ffffff; text-decoration:none; 			border-radius:999px; font-size:15px;">
						Visit LittleFootCraft
					</a>

					<p style="color:#9ca3af; font-size:13px; margin-top:28px;">
						Warm wishes,<br/>LittleFootCraft
					</p>
				</div>
			</div>`;

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

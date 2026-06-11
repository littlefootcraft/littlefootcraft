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

		const confirmationSubject =
			currentLang === "ua"
				? "Дякуємо за підписку на LittleFootCraft"
				: "Thank you for subscribing to LittleFootCraft";

		const selectedInterestList = interests
			.map((interest) => interestLabels[currentLang]?.[interest] ?? interest)
			.map((label) => `<li>${label}</li>`)
			.join("");

		const confirmationHtml =
			currentLang === "ua"
				? `
			<h2>Дякуємо за підписку на LittleFootCraft!</h2>
			<p>Ви успішно підписалися на:</p>
			<ul>${selectedInterestList}</ul>
			<p>Ми надсилатимемо вам лише новини за вибраними темами.</p>
			<p>З теплом,<br/>LittleFootCraft</p>
		`
				: `
			<h2>Thank you for subscribing to LittleFootCraft!</h2>
			<p>You successfully subscribed to:</p>
			<ul>${selectedInterestList}</ul>
			<p>We'll only send you updates related to your selected topics.</p>
			<p>Warm wishes,<br/>LittleFootCraft</p>
		`;

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

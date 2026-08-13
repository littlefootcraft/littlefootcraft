import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

import { useLanguage } from "../context/LanguageContext";

export const useSubscribe = (dict) => {
	// Current website language
	const { currentLang } = useLanguage();

	// Form state
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState("idle");
	const [message, setMessage] = useState("");

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

		// Send confirmation email
		const { error: emailError } = await supabase.functions.invoke(
			"resend-email",
			{
				body: {
					type: "subscription",
					email: trimmedEmail,
					language: currentLang,
					interests,
					subscriberId: data.id,
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

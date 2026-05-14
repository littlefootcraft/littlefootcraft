//useContactForm.js
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export const useContactForm = (dict, currentLang) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [status, setStatus] = useState("idle");
	const [feedbackMessage, setFeedbackMessage] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		const trimmedName = name.trim();
		const trimmedEmail = email.trim().toLowerCase();
		const trimmedMessage = message.trim();

		setStatus("idle");
		setFeedbackMessage("");

		if (!trimmedName) {
			setStatus("error");
			setFeedbackMessage(dict.emptyNameMessage);
			return;
		}

		if (!trimmedEmail) {
			setStatus("error");
			setFeedbackMessage(dict.emptyEmailMessage);
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(trimmedEmail)) {
			setStatus("error");
			setFeedbackMessage(dict.invalidEmailMessage);
			return;
		}

		if (!trimmedMessage) {
			setStatus("error");
			setFeedbackMessage(dict.emptyMessageMessage);
			return;
		}

		if (trimmedMessage.length < 10) {
			setStatus("error");
			setFeedbackMessage(dict.shortMessageMessage);
			return;
		}

		setStatus("loading");
		setFeedbackMessage(dict.sendingMessage);

		const { error } = await supabase.from("contact_messages").insert({
			name: trimmedName,
			email: trimmedEmail,
			message: trimmedMessage,
			language: currentLang,
			status: "new",
		});

		if (error) {
			console.log("Supabase contact error:", error);

			setStatus("error");
			setFeedbackMessage(dict.errorMessage);
			return;
		}

		setStatus("success");
		setFeedbackMessage(dict.successMessage);

		setName("");
		setEmail("");
		setMessage("");
	};

	return {
		name,
		setName,
		email,
		setEmail,
		message,
		setMessage,
		status,
		feedbackMessage,
		handleSubmit,
	};
};

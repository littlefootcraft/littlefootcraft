//src/components/ContactModal.jsx

import { useEffect } from "react";
import { X, Mail, Sparkles } from "lucide-react";
import { PrimaryBtn } from "./PrimaryBtn";
import { useContactForm } from "../hooks/useContactForm";

import { getInTouchEN, getInTouchUA } from "../translations/translation";
const MESSAGE_MAX_LENGTH = 500;

export const ContactModal = ({ isOpen, onClose, currentLang = "en" }) => {
	const t = currentLang === "ua" ? getInTouchUA : getInTouchEN;

	const {
		name,
		setName,
		email,
		setEmail,
		message,
		setMessage,
		status,
		feedbackMessage,
		handleSubmit,
	} = useContactForm(t, currentLang);

	// To show message if NaN enrtered
	// const handlePhoneChange = (e) => {
	// 	const value = e.target.value;

	// 	if (/^\d*$/.test(value)) {
	// 		setPhone(value);
	// 		setErrors((currentErrors) => ({
	// 			...currentErrors,
	// 			phone: "",
	// 		}));
	// 	}
	// };

	// For name do not accept numbers
	const handleNameChange = (e) => {
		const value = e.target.value;

		if (/^[\p{L}\s'ʼ-]*$/u.test(value)) {
			setName(value);
		}
	};

	useEffect(() => {
		if (!isOpen) return;

		document.body.style.overflow = "hidden";

		const handleEscape = (e) => {
			if (e.key === "Escape") onClose();
		};

		window.addEventListener("keydown", handleEscape);

		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div
			className="contact-modal"
			onClick={onClose}
		>
			<div
				className="contact-modal__content"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					type="button"
					className="contact-modal__close"
					onClick={onClose}
					aria-label="Close contact form"
				>
					<X />
				</button>

				<div className="contact-modal__icon">
					<Sparkles />
				</div>

				<h2 className="contact-modal__title">{t.title}</h2>
				<p className="contact-modal__text">{t.text}</p>

				<form
					className="contact-modal__form"
					name="contact"
					onSubmit={handleSubmit}
					noValidate
				>
					<input
						className="contact-modal__input"
						type="text"
						name="name"
						placeholder={t.name}
						value={name}
						onChange={handleNameChange}
						disabled={status === "loading"}
					/>

					<input
						className="contact-modal__input"
						type="email"
						name="email"
						placeholder={t.email}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						disabled={status === "loading"}
					/>

					<textarea
						className="contact-modal__textarea"
						name="message"
						placeholder={t.message}
						rows="5"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						disabled={status === "loading"}
						maxLength={MESSAGE_MAX_LENGTH}
					/>
					<p className="contact-modal__counter">
						{message.length}/{MESSAGE_MAX_LENGTH}
					</p>
					<p
						className={`contact-modal__message contact-modal__message--${status}`}
					>
						{feedbackMessage}
					</p>

					<PrimaryBtn
						variant="subscription"
						type="submit"
						className="contact-modal__submit"
						disabled={status === "loading"}
					>
						{t.button}
					</PrimaryBtn>
				</form>

				<div className="contact-modal__email">
					<Mail />
					<span>{t.emailText}</span>
					<a href="mailto:littlefootcraft@gmail.com">
						littlefootcraft@gmail.com
					</a>
				</div>
			</div>
		</div>
	);
};

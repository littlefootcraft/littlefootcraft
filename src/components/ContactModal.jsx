import { useEffect } from "react";
import { X, Mail, Sparkles } from "lucide-react";
import { PrimaryBtn } from "./PrimaryBtn";

export const ContactModal = ({ isOpen, onClose, currentLang = "en" }) => {
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

	const t =
		currentLang === "ua"
			? {
					title: "Звʼяжіться з нами",
					text: "Маєте запитання щодо виробу, замовлення чи майстер-класу? Напишіть нам.",
					name: "Ваше імʼя",
					email: "Електронна пошта",
					message: "Повідомлення",
					button: "Надіслати",
					emailText: "Або напишіть нам напряму:",
				}
			: {
					title: "Get in Touch",
					text: "Have a question about a piece, order, or workshop? Send us a message.",
					name: "Your name",
					email: "Email address",
					message: "Message",
					button: "Send Message",
					emailText: "Or email us directly:",
				};

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
					method="POST"
					data-netlify="true"
				>
					<input
						type="hidden"
						name="form-name"
						value="contact"
					/>

					<input
						className="contact-modal__input"
						type="text"
						name="name"
						placeholder={t.name}
						required
					/>

					<input
						className="contact-modal__input"
						type="email"
						name="email"
						placeholder={t.email}
						required
					/>

					<textarea
						className="contact-modal__textarea"
						name="message"
						placeholder={t.message}
						rows="5"
						required
					/>

					<PrimaryBtn
						variant="subscription"
						type="submit"
						className="contact-modal__submit"
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

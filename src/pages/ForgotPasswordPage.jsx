import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

// COMPONENTS
import { PrimaryBtn } from "../components/PrimaryBtn";
import Seo from "../components/Seo";

// CONTEXT
import { useLanguage } from "../context/LanguageContext";

// TRANSLATIONS
import {
	forgotPasswordPageEN,
	forgotPasswordPageUA,
} from "../translations/translation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPasswordPage = () => {
	const { currentLang } = useLanguage();

	const dict =
		currentLang === "en" ? forgotPasswordPageEN : forgotPasswordPageUA;

	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [formMessage, setFormMessage] = useState("");

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
		setError("");
		setFormMessage("");
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const normalizedEmail = email.trim();

		if (!normalizedEmail) {
			setError(dict.emptyEmailMessage);
			return;
		}

		if (!EMAIL_REGEX.test(normalizedEmail)) {
			setError(dict.invalidEmailMessage);
			return;
		}

		setError("");

		// Later:
		// await customerAuthService.resetPasswordForEmail(
		//   normalizedEmail
		// );

		setFormMessage(dict.notConnectedMessage);
	};

	return (
		<div className="forgot-password-page">
			<Seo
				title={dict.seoTitle}
				description={dict.seoDescription}
				url={`/${currentLang}/forgot-password`}
			/>

			<div className="forgot-password-page__block-wrap container">
				<form
					className="forgot-password-page__block"
					onSubmit={handleSubmit}
					noValidate
				>
					<div className="forgot-password-page__icon">
						<Mail size={40} />
					</div>

					<h2 className="forgot-password-page__title">{dict.title}</h2>

					<p className="forgot-password-page__comment">{dict.subtitle}</p>

					<div className="forgot-password-page__field">
						<label
							htmlFor="forgot-email"
							className="forgot-password-page__label"
						>
							{dict.emailLabel}
						</label>

						<input
							id="forgot-email"
							name="email"
							className={`forgot-password-page__input ${
								error ? "forgot-password-page__input--error" : ""
							}`}
							type="email"
							value={email}
							onChange={handleEmailChange}
							placeholder="email@example.com"
							autoComplete="email"
							aria-invalid={Boolean(error)}
							aria-describedby={error ? "forgot-email-error" : undefined}
						/>

						{error && (
							<p
								id="forgot-email-error"
								className="forgot-password-page__field-message"
								role="alert"
							>
								{error}
							</p>
						)}
					</div>

					{formMessage && (
						<p
							className="forgot-password-page__field-message"
							role="status"
						>
							{formMessage}
						</p>
					)}

					<PrimaryBtn
						variant="login"
						type="submit"
						className="forgot-password-page__submit-btn"
					>
						{dict.submitBtn}
					</PrimaryBtn>

					<Link
						to={`/${currentLang}/login`}
						className="forgot-password-page__back-link"
					>
						{dict.backToLogin}
					</Link>
				</form>
			</div>
		</div>
	);
};

export default ForgotPasswordPage;

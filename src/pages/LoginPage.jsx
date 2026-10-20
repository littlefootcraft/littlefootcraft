import { useState } from "react";
import { Link } from "react-router-dom";

// CONTENT
import LoginPageContent from "../content/pages/login-page.json";

// CONTEXT
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";

// COMPONENTS
import { PrimaryBtn } from "../components/PrimaryBtn";
import Seo from "../components/Seo";

// ICONS
import { User } from "lucide-react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

// TRANSLATIONS
import { loginPageEN, loginPageUA } from "../translations/translation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginPage = () => {
	const { currentLang } = useLanguage();
	const { cartList } = useCart();
	const dict = currentLang === "en" ? loginPageEN : loginPageUA;
	const t = (field) => field?.[currentLang] ?? field?.en ?? "";

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState({});

	const messages =
		currentLang === "en"
			? {
					notConnected: "Login is not available yet. Please try again later.",
				}
			: {
					notConnected: "Вхід поки недоступний. Спробуйте пізніше.",
				};

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		setErrors((prev) => ({
			...prev,
			[name]: "",
			form: "",
		}));
	};

	const validateForm = () => {
		const nextErrors = {};
		const normalizedEmail = formData.email.trim();

		if (!normalizedEmail) {
			nextErrors.email = dict.emptyEmailMessage;
		} else if (!EMAIL_REGEX.test(normalizedEmail)) {
			nextErrors.email = dict.invalidEmailMessage;
		}

		// Do not trim passwords. Spaces can be valid password characters.
		if (!formData.password) {
			nextErrors.password = dict.emptyPasswordMessage;
		}

		return nextErrors;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const nextErrors = validateForm();
		setErrors(nextErrors);

		if (Object.keys(nextErrors).length > 0) {
			return;
		}

		// Supabase signInWithPassword will be integrated here.
		// Never log plaintext passwords.

		setErrors({
			form: messages.notConnected,
		});
	};

	const renderFieldError = (field) => (
		<p
			id={`login-${field}-error`}
			className="login-page__field-message"
			role={errors[field] ? "alert" : undefined}
		>
			{errors[field] || ""}
		</p>
	);

	return (
		<div className="login-page">
			<Seo
				title={t(LoginPageContent.seo.title)}
				description={t(LoginPageContent.seo.description)}
				image={LoginPageContent.seo.image}
				imageAlt={t(LoginPageContent.seo.imageAlt)}
				url={`/${currentLang}/login`}
			/>

			<div className="login-page__block-wrap container">
				<form
					className="login-page__block"
					onSubmit={handleSubmit}
					noValidate
				>
					<div className="login-page__icon">
						<User size={40} />
					</div>

					<h2 className="login-page__title">{dict.title}</h2>

					<span className="login-page__comment">{dict.subtitle}</span>

					{/* EMAIL */}
					<div className="login-page__field">
						<label
							className="login-page__label"
							htmlFor="email"
						>
							{dict.emailLabel}
						</label>

						<input
							id="email"
							name="email"
							className={`login-page__input ${
								errors.email ? "login-page__input--error" : ""
							}`}
							type="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="email@example.com"
							autoComplete="email"
							aria-invalid={Boolean(errors.email)}
							aria-describedby="login-email-error"
						/>

						{renderFieldError("email")}
					</div>

					{/* PASSWORD */}
					<div className="login-page__field">
						<label
							className="login-page__label"
							htmlFor="password"
						>
							{dict.passwordLabel}
						</label>

						<div className="login-page__input-wrap">
							<input
								id="password"
								name="password"
								className={`login-page__input ${
									errors.password ? "login-page__input--error" : ""
								}`}
								type={showPassword ? "text" : "password"}
								value={formData.password}
								onChange={handleChange}
								placeholder={dict.passwordPlaceholder}
								autoComplete="current-password"
								aria-invalid={Boolean(errors.password)}
								aria-describedby="login-password-error"
							/>

							<button
								type="button"
								className="login-page__toggle-password"
								onClick={() => setShowPassword((prev) => !prev)}
								aria-label={
									showPassword
										? dict.hidePasswordAriaLabel
										: dict.showPasswordAriaLabel
								}
								aria-pressed={showPassword}
							>
								{showPassword ? (
									<FaRegEye size={18} />
								) : (
									<FaRegEyeSlash size={18} />
								)}
							</button>
						</div>

						{renderFieldError("password")}
					</div>

					{/* FORM STATUS */}
					{errors.form && (
						<p
							className="login-page__field-message"
							role="alert"
						>
							{errors.form}
						</p>
					)}

					{/* LOGIN */}
					<PrimaryBtn
						variant="login"
						type="submit"
						className="login-page__login-btn"
					>
						{dict.loginBtn}
					</PrimaryBtn>

					{/* REGISTRATION */}
					<Link
						to={`/${currentLang}/registration`}
						className="login-page__register-invitation-btn"
					>
						{dict.registerInvitation}
					</Link>
					<Link
						to={
							cartList.length > 0
								? `/${currentLang}/cart`
								: `/${currentLang}/shop`
						}
						className="login-page__continue-link"
					>
						{dict.continueWithoutAccount}
					</Link>
					<Link
						to={`/${currentLang}/forgot-password`}
						className="login-page__forgot-password-link"
					>
						{dict.forgotPassword}
					</Link>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;

//LoginPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

import LoginPageContent from "../content/pages/login-page.json";

// CONTEXTS
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";

// COMPONENTS
import { PrimaryBtn } from "../components/PrimaryBtn";
import Seo from "../components/Seo";

//ICONS
import { User } from "lucide-react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

import { loginPageEN, loginPageUA } from "../translations/translation";

const LoginPage = () => {
	const { cartList } = useCart();
	const { currentLang } = useLanguage();
	const dict = currentLang === "en" ? loginPageEN : loginPageUA;
	const t = (field) => field?.[currentLang] ?? field?.en ?? "";

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState({});

	const handleEmailChange = (e) => {
		setEmail(e.target.value);

		setErrors((currentErrors) => ({
			...currentErrors,
			email: "",
		}));
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);

		setErrors((currentErrors) => ({
			...currentErrors,
			password: "",
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const trimmedEmail = email.trim().toLowerCase();
		const trimmedPassword = password.trim();

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		const nextErrors = {};

		if (!trimmedEmail) {
			nextErrors.email = dict.emptyEmailMessage;
		} else if (!emailRegex.test(trimmedEmail)) {
			nextErrors.email = dict.invalidEmailMessage;
		}

		if (!trimmedPassword) {
			nextErrors.password = dict.emptyPasswordMessage;
		}

		if (Object.keys(nextErrors).length > 0) {
			setErrors(nextErrors);
			return;
		}

		setErrors({});

		console.log({
			email: trimmedEmail,
		});

		// Later: Supabase login logic
	};

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
						<User size="40" />
					</div>
					<h2 className="login-page__title">{dict.title}</h2>
					<span className="login-page__comment">{dict.subtitle}</span>
					<div className="login-page__field">
						<label
							className="login-page__label"
							htmlFor="email"
						>
							{dict.emailLabel}
						</label>
						<input
							id="email"
							className={`login-page__input ${errors.email ? "login-page__input--error" : ""}`}
							type="email"
							value={email}
							onChange={handleEmailChange}
							placeholder="email@example.com"
							autoComplete="email"
						/>
						<p className="login-page__field-message">{errors.email}</p>
					</div>

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
								className={`login-page__input ${errors.password ? "login-page__input--error" : ""}`}
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={handlePasswordChange}
								placeholder={dict.passwordPlaceholder}
								autoComplete="current-password"
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
							>
								{showPassword ? (
									<FaRegEye size={18} />
								) : (
									<FaRegEyeSlash size={18} />
								)}
							</button>
						</div>
						<p className="login-page__field-message">{errors.password}</p>
					</div>

					<PrimaryBtn
						variant="login"
						type="submit"
						className="login-page__login-btn"
					>
						{dict.loginBtn}
					</PrimaryBtn>

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
				</form>
			</div>
		</div>
	);
};

export default LoginPage;

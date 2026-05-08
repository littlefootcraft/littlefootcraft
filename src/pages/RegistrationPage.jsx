//RegisterPage.jsx

import { IoPersonOutline } from "react-icons/io5";
import { PrimaryBtn } from "../components/PrimaryBtn";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Link } from "react-router-dom";
import {
	registrationPageEN,
	registrationPageUA,
} from "../translations/translation";
import { useLanguage } from "../context/LanguageContext";

import { User } from "lucide-react";
import Seo from "../components/Seo";

import RegistrationPageContent from "../content/pages/registration-page.json";

const RegistrationPage = () => {
	const { currentLang } = useLanguage();
	const dict = currentLang === "en" ? registrationPageEN : registrationPageUA;
	const t = (field) => field?.[currentLang] ?? field?.en ?? "";

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");

	return (
		<div className="registration-page">
			<Seo
				title={t(RegistrationPageContent.seo.title)}
				description={t(RegistrationPageContent.seo.description)}
				image={RegistrationPageContent.seo.image}
				imageAlt={t(RegistrationPageContent.seo.imageAlt)}
				url={`/${currentLang}/shop`}
			/>
			<div className="registration-page__block-wrap container">
				<div className="registration-page__block ">
					<div className="registration-page__icon">
						<User size="40" />
					</div>
					<h2 className="registration-page__title">{dict.title}</h2>
					<span className="registration-page__comment">{dict.subtitle}</span>
					<div className="registration-page__field">
						<label
							className="registration-page__label"
							htmlFor="firstName"
						>
							{dict.firstNameLabel}
						</label>
						<input
							id="firstName"
							className="registration-page__input"
							type="text"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							placeholder={dict.firstNamePlaceholder}
							autoComplete="given-name"
						/>
					</div>
					<div className="registration-page__field">
						<label
							className="registration-page__label"
							htmlFor="lastName"
						>
							{dict.lastNameLabel}
						</label>
						<input
							id="lastName"
							className="registration-page__input"
							type="text"
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
							placeholder={dict.lastNamePlaceholder}
							autoComplete="family-name"
						/>
					</div>
					<div className="registration-page__field">
						<label
							className="registration-page__label"
							htmlFor="email"
						>
							{dict.emailLabel}
						</label>
						<input
							id="email"
							className="registration-page__input"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="email@example.com"
							autoComplete="email"
						/>
					</div>
					<div className="registration-page__field">
						<label
							className="registration-page__label"
							htmlFor="password"
						>
							{dict.passwordLabel}
						</label>
						<div className="registration-page__input-wrap">
							<input
								id="password"
								className="registration-page__input"
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder={dict.passwordPlaceholder}
								autoComplete="new-password"
							/>
							<button
								type="button"
								className="registration-page__toggle-password"
								onClick={() => setShowPassword((prev) => !prev)}
								aria-label={showPassword ? "Сховати пароль" : "Показати пароль"}
							>
								{showPassword ? (
									<FaRegEye size={18} />
								) : (
									<FaRegEyeSlash size={18} />
								)}
							</button>
						</div>
					</div>
					<div className="registration-page__field">
						<label
							className="registration-page__label"
							htmlFor="confirmPassword"
						>
							{dict.confirmPasswordLabel}
						</label>
						<div className="registration-page__input-wrap">
							<input
								id="confirmPassword"
								className="registration-page__input"
								type={showConfirmPassword ? "text" : "password"}
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder={dict.passwordConfirmLabel}
								autoComplete="new-password"
							/>
							<button
								type="button"
								className="registration-page__toggle-password"
								onClick={() => setShowConfirmPassword((prev) => !prev)}
								aria-label={
									showConfirmPassword ? "Сховати пароль" : "Показати пароль"
								}
							>
								{showConfirmPassword ? (
									<FaRegEye size={18} />
								) : (
									<FaRegEyeSlash size={18} />
								)}
							</button>
						</div>
					</div>
					<PrimaryBtn
						variant="register"
						className="registration-page__register-btn"
					>
						{dict.registerBtn}
					</PrimaryBtn>
					<Link
						to={`/${currentLang}/login`}
						className="registration-page__register-invitation-btn"
					>
						{dict.loginInvitation}
					</Link>
					<Link
						to={`/${currentLang}/order`}
						className="registration-page__continue-link"
					>
						{dict.continueWithoutAccount}
					</Link>
				</div>
			</div>
		</div>
	);
};

export default RegistrationPage;

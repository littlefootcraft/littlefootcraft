import { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { User } from "lucide-react";

// COMPONENTS
import { PrimaryBtn } from "../components/PrimaryBtn";
import Seo from "../components/Seo";

// CONTEXT
import { useLanguage } from "../context/LanguageContext";

// TRANSLATIONS
import {
	registrationPageEN,
	registrationPageUA,
} from "../translations/translation";

// CONTENT
import RegistrationPageContent from "../content/pages/registration-page.json";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

const RegistrationPage = () => {
	const { currentLang } = useLanguage();
	const dict = currentLang === "en" ? registrationPageEN : registrationPageUA;

	const t = (field) => field?.[currentLang] ?? field?.en ?? "";

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [errors, setErrors] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const messages =
		currentLang === "en"
			? {
					required: "This field is required.",
					invalidEmail: "Enter a valid email address.",
					shortPassword: "Password must be at least 8 characters.",
					passwordMismatch: "Passwords do not match.",
					showPassword: "Show password",
					hidePassword: "Hide password",
					notConnected:
						"Account registration is not available yet. Please try again later.",
				}
			: {
					required: "Це поле обов'язкове.",
					invalidEmail: "Введіть правильну електронну адресу.",
					shortPassword: "Пароль має містити щонайменше 8 символів.",
					passwordMismatch: "Паролі не збігаються.",
					showPassword: "Показати пароль",
					hidePassword: "Сховати пароль",
					notConnected: "Реєстрація поки недоступна. Спробуйте пізніше.",
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

		if (!formData.firstName.trim()) {
			nextErrors.firstName = messages.required;
		}

		if (!formData.lastName.trim()) {
			nextErrors.lastName = messages.required;
		}

		const normalizedEmail = formData.email.trim();

		if (!normalizedEmail) {
			nextErrors.email = messages.required;
		} else if (!EMAIL_REGEX.test(normalizedEmail)) {
			nextErrors.email = messages.invalidEmail;
		}

		if (!formData.password) {
			nextErrors.password = messages.required;
		} else if (formData.password.length < MIN_PASSWORD_LENGTH) {
			nextErrors.password = messages.shortPassword;
		}

		if (!formData.confirmPassword) {
			nextErrors.confirmPassword = messages.required;
		} else if (formData.password !== formData.confirmPassword) {
			nextErrors.confirmPassword = messages.passwordMismatch;
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

		// Supabase signUp integration will be added here.
		// Never log or store plaintext passwords.

		setErrors({
			form: messages.notConnected,
		});
	};

	const renderFieldError = (field) => (
		<p
			id={`registration-${field}-error`}
			className="registration-page__field-message"
			role={errors[field] ? "alert" : undefined}
		>
			{errors[field] || ""}
		</p>
	);

	return (
		<div className="registration-page">
			<Seo
				title={t(RegistrationPageContent.seo.title)}
				description={t(RegistrationPageContent.seo.description)}
				image={RegistrationPageContent.seo.image}
				imageAlt={t(RegistrationPageContent.seo.imageAlt)}
				url={`/${currentLang}/registration`}
			/>

			<div className="registration-page__block-wrap container">
				<form
					className="registration-page__block"
					onSubmit={handleSubmit}
					noValidate
				>
					<div className="registration-page__icon">
						<User size={40} />
					</div>

					<h2 className="registration-page__title">{dict.title}</h2>

					<span className="registration-page__comment">{dict.subtitle}</span>

					{/* FIRST NAME */}
					<div className="registration-page__field">
						<label
							className="registration-page__label"
							htmlFor="firstName"
						>
							{dict.firstNameLabel}
						</label>

						<input
							id="firstName"
							name="firstName"
							className={`registration-page__input ${
								errors.firstName ? "registration-page__input--error" : ""
							}`}
							type="text"
							value={formData.firstName}
							onChange={handleChange}
							placeholder={dict.firstNamePlaceholder}
							autoComplete="given-name"
							aria-invalid={Boolean(errors.firstName)}
							aria-describedby="registration-firstName-error"
						/>

						{renderFieldError("firstName")}
					</div>

					{/* LAST NAME */}
					<div className="registration-page__field">
						<label
							className="registration-page__label"
							htmlFor="lastName"
						>
							{dict.lastNameLabel}
						</label>

						<input
							id="lastName"
							name="lastName"
							className={`registration-page__input ${
								errors.lastName ? "registration-page__input--error" : ""
							}`}
							type="text"
							value={formData.lastName}
							onChange={handleChange}
							placeholder={dict.lastNamePlaceholder}
							autoComplete="family-name"
							aria-invalid={Boolean(errors.lastName)}
							aria-describedby="registration-lastName-error"
						/>

						{renderFieldError("lastName")}
					</div>

					{/* EMAIL */}
					<div className="registration-page__field">
						<label
							className="registration-page__label"
							htmlFor="email"
						>
							{dict.emailLabel}
						</label>

						<input
							id="email"
							name="email"
							className={`registration-page__input ${
								errors.email ? "registration-page__input--error" : ""
							}`}
							type="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="email@example.com"
							autoComplete="email"
							aria-invalid={Boolean(errors.email)}
							aria-describedby="registration-email-error"
						/>

						{renderFieldError("email")}
					</div>

					{/* PASSWORD */}
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
								name="password"
								className={`registration-page__input ${
									errors.password ? "registration-page__input--error" : ""
								}`}
								type={showPassword ? "text" : "password"}
								value={formData.password}
								onChange={handleChange}
								placeholder={dict.passwordPlaceholder}
								autoComplete="new-password"
								aria-invalid={Boolean(errors.password)}
								aria-describedby="registration-password-error"
							/>

							<button
								type="button"
								className="registration-page__toggle-password"
								onClick={() => setShowPassword((prev) => !prev)}
								aria-label={
									showPassword ? messages.hidePassword : messages.showPassword
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

					{/* CONFIRM PASSWORD */}
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
								name="confirmPassword"
								className={`registration-page__input ${
									errors.confirmPassword
										? "registration-page__input--error"
										: ""
								}`}
								type={showConfirmPassword ? "text" : "password"}
								value={formData.confirmPassword}
								onChange={handleChange}
								placeholder={dict.passwordConfirmLabel}
								autoComplete="new-password"
								aria-invalid={Boolean(errors.confirmPassword)}
								aria-describedby="registration-confirmPassword-error"
							/>

							<button
								type="button"
								className="registration-page__toggle-password"
								onClick={() => setShowConfirmPassword((prev) => !prev)}
								aria-label={
									showConfirmPassword
										? messages.hidePassword
										: messages.showPassword
								}
								aria-pressed={showConfirmPassword}
							>
								{showConfirmPassword ? (
									<FaRegEye size={18} />
								) : (
									<FaRegEyeSlash size={18} />
								)}
							</button>
						</div>

						{renderFieldError("confirmPassword")}
					</div>

					{/* FORM STATUS */}
					{errors.form && (
						<p
							className="registration-page__field-message"
							role="alert"
						>
							{errors.form}
						</p>
					)}

					{/* SUBMIT */}
					<PrimaryBtn
						variant="register"
						type="submit"
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
				</form>
			</div>
		</div>
	);
};

export default RegistrationPage;

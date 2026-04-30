//LoginPage.jsx

import { IoPersonOutline } from "react-icons/io5";
import { PrimaryBtn } from "../components/PrimaryBtn";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Link } from "react-router-dom";
// import { useCart } from "../context/CartContext";
import { User } from "lucide-react";
import { loginPageEN, loginPageUA } from "../translations/translation";
import { useLanguage } from "../context/LanguageContext";

const LoginPage = () => {
	// const { cartList } = useCart();
	const { currentLang } = useLanguage();
	const dict = currentLang === "en" ? loginPageEN : loginPageUA;

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="login-page">
			<div className="login-page__block-wrap container">
				<div className="login-page__block">
					<div className="login-page__icon">
						<User size="40" />
					</div>
					<h2 className="login-page__title">{dict.title}</h2>
					<span className="login-page__coment">{dict.subtitle}</span>
					<div className="login-page__field">
						<label
							className="login-page__label"
							htmlFor="email"
						>
							{dict.emailLabel}
						</label>
						<input
							id="email"
							className="login-page__input"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="email@example.com"
							autoComplete="email"
						/>
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
								className="login-page__input"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder={dict.passwordPlaceholder}
								autoComplete="current-password"
							/>
							<button
								type="button"
								className="login-page__toggle-password"
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
					<PrimaryBtn
						variant="login"
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
						// to={cartList.length > 0 ? "/order" : "/catalog"}
						className="login-page__continue-link"
					>
						{dict.continueWithoutAccount}
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;

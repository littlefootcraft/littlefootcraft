//Footer.jsx
import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import logo from "/uploads/images/logo.png";
import footerContent from "../content/layout/footer.json";

// UTILS
import { NavItems } from "../utils/navItems";

// CONTEXTS
import { useLanguage } from "../context/LanguageContext";

// HOOKS
import { useSubscribe } from "../hooks/useSubscribe";

// COMPONENTS
import { ContactModal } from "../components/ContactModal";
import { PrivacyPolicyModal } from "../components/PrivacyPolicyModal";
import { PrimaryBtn } from "../components/PrimaryBtn";

// ICONS
import { FaRegEnvelope } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { FaInstagram, FaTiktok } from "react-icons/fa6";

import devLogo from "../assets/images/jane_dev_sign_whiteBG.png";

import {
	menuUA,
	menuEN,
	subscriptiopnEN,
	subscriptiopnUA,
	devSignEN,
	devSignUA,
} from "../translations/translation";

const Footer = () => {
	const { currentLang, setCurrentLang } = useLanguage();
	const navigate = useNavigate();
	const location = useLocation();
	const menuDict = currentLang === "en" ? menuEN : menuUA;
	// const footerDict = currentLang === "en" ? footerEN : footerUA;

	function switchLang(lang) {
		setCurrentLang(lang);

		const segment = location.pathname.split("/");
		segment[1] = lang;
		const newPath = segment.join("/") || `/${lang}`;
		navigate(`${newPath}${location.search}`);
	}

	// LANGUAGE SWITCHING
	const t = (field) => field?.[currentLang] ?? field?.en ?? "";
	const dict = currentLang === "en" ? subscriptiopnEN : subscriptiopnUA;
	const developerSignature = currentLang === "en" ? devSignEN : devSignUA;

	// GET IN TOUCH
	const [isContactOpen, setIsContactOpen] = useState(false);

	// PRIVACY AND POLICY
	const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

	// SUBSCRIBTION
	const {
		email,
		setEmail,
		status,
		message,
		subscribe,
		clearMessage,
		interests,
		toggleInterest,
	} = useSubscribe(dict);

	const [showTopics, setShowTopics] = useState(false);

	return (
		<footer className="footer">
			<div className="footer__content container">
				<div className="footer__brand">
					<img
						className="footer__brand-logo"
						src={logo}
						alt="Little foot creft logo"
					/>
					<p className="footer__brand-text">{t(footerContent.brandText)}</p>
					<div className="footer__brand-social">
						<FaInstagram />
						<FaTiktok />
					</div>
				</div>

				{/* --- NAV SECTION --- */}
				<div className="footer__nav">
					<h3 className="footer__subtitle footer-title">
						{t(footerContent.menu.title)}
					</h3>
					<ul className="footer__nav-items">
						{NavItems.map(({ id, path }) => (
							<li key={id}>
								<NavLink
									to={`/${currentLang}${path === "/" ? "" : path}`}
									end={path === "/"}
									className={({ isActive }) =>
										`footer__nav-link ${isActive ? "footer__nav-link--active" : ""}`
									}
								>
									{menuDict[id]}
								</NavLink>
							</li>
						))}
					</ul>
				</div>

				{/* --- SUPPORT SECTION --- */}
				<div className="footer__support">
					<h3 className="footer__subtitle footer-title">
						{t(footerContent.support.title)}
					</h3>
					<ul className="footer__support-items">
						<li className="footer__support-item">
							<button
								type="button"
								className="footer__support-link"
								onClick={() => setIsContactOpen(true)}
							>
								{t(footerContent.support.contact)}
							</button>
							<ContactModal
								isOpen={isContactOpen}
								onClose={() => setIsContactOpen(false)}
								currentLang={currentLang}
							/>
						</li>
						<li className="footer__support-item">
							<Link to={`/${currentLang}/faq`}>
								{t(footerContent.support.faq)}
							</Link>
						</li>

						<li className="footer__support-item">
							<button
								type="button"
								onClick={() => setIsPrivacyOpen(true)}
								className="footer__support-link"
							>
								{t(footerContent.support.policy)}
								<PrivacyPolicyModal
									isOpen={isPrivacyOpen}
									onClose={() => setIsPrivacyOpen(false)}
								/>
							</button>
						</li>
					</ul>
				</div>

				{/* --- SUBSCRIBE SECTION --- */}
				<div className="footer__subscription">
					<h3 className="footer__subtitle footer-title">
						{t(footerContent.subscription.title)}
					</h3>
					<p>{t(footerContent.subscription.text)}</p>

					<div className="footer__subscription-topics">
						<label className="footer__subscription-topic">
							<input
								type="checkbox"
								checked={interests.includes("workshops")}
								onChange={() => toggleInterest("workshops")}
							/>
							<span>{dict.workshopsLabel}</span>
						</label>

						<label className="footer__subscription-topic">
							<input
								type="checkbox"
								checked={interests.includes("master-classes")}
								onChange={() => toggleInterest("master-classes")}
							/>
							<span>{dict.masterClassesLabel}</span>
						</label>

						<label className="footer__subscription-topic">
							<input
								type="checkbox"
								checked={interests.includes("sales")}
								onChange={() => toggleInterest("sales")}
							/>
							<span>{dict.salesLabel}</span>
						</label>
					</div>

					<div className="footer__subscription-action">
						<input
							type="email"
							className="footer__subscription-input"
							value={email}
							placeholder={t(footerContent.subscription.placeholder)}
							onChange={(event) => {
								setEmail(event.target.value);
								clearMessage();
							}}
							aria-label={dict.ariaLabel}
						/>
						<p
							className={`footer__subscription-message ${
								message ? `footer__subscription-message--${status}` : ""
							}`}
						>
							{message}
						</p>

						<PrimaryBtn
							variant="footer"
							type="button"
							onClick={subscribe}
							disabled={status === "loading"}
						>
							{t(footerContent.subscription.button)}
						</PrimaryBtn>
					</div>
				</div>
			</div>

			{/* --- METADATA SECTION --- */}
			<div className="footer__metadata">
				<a
					className="footer__metadata-email"
					href="mailto:littlefootcraft@gmail.com"
				>
					<FaRegEnvelope className="footer__metadata-icons" />
					{footerContent.email}
				</a>
				<a
					className="footer__metadata-address"
					href="https://www.google.com/maps?q=Galway,+Ireland"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Open location on the Google Maps"
				>
					<IoLocationOutline className="footer__metadata-icons" />
					{t(footerContent.location)}
				</a>
			</div>
			<div className="footer__signature">
				<p className="footer__rights container">
					© {new Date().getFullYear()} Little Foot Craft.{" "}
					{t(footerContent.signature)}.
				</p>

				<div className="footer__developer container">
					{developerSignature}
					<a
						href="https://www.jane.work"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Visit Little Foot Craft website"
					>
						<img
							src={devLogo}
							alt="Jane's logo"
							className="footer__developer-logo"
						/>
					</a>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

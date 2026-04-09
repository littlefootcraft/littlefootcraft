//Footer.jsx

import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "/uploads/images/logo.png";
import { NavItems } from "../utils/navItems";
import { menuUA, menuEN } from "../translations/translation";
import footerContent from "../content/layout/footer.json";

import { FaRegEnvelope } from "react-icons/fa6";

import { IoLocationOutline } from "react-icons/io5";
import { FaInstagram, FaTiktok } from "react-icons/fa6";
import { useLanguage } from "../context/LanguageContext";
import { PrimaryBtn } from "../components/PrimaryBtn";

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
		const newPath = segment.join("/") || `$/${lang}`;
		navigate(`${newPath}${location.search}`);
	}

	//
	// For language switching
	// const { currentLang } = useLanguage();
	const t = (field) => field?.[currentLang] ?? field?.en ?? "";

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
				<div className="footer__support">
					<h3 className="footer__subtitle footer-title">
						{t(footerContent.support.title)}
					</h3>
					<ul className="footer__support-items">
						<li className="footer__support-item">
							<Link to="/">{t(footerContent.support.contact)}</Link>
						</li>
						<li className="footer__support-item">
							<Link to="/">{t(footerContent.support.shipping)}</Link>
						</li>
						<li className="footer__support-item">
							<Link to="/">{t(footerContent.support.returns)}</Link>
						</li>
						<li className="footer__support-item">
							<Link to="/">{t(footerContent.support.policy)}</Link>
						</li>
					</ul>
				</div>
				<div className="footer__subscription">
					<h3 className="footer__subtitle footer-title">
						{t(footerContent.subscription.title)}
					</h3>
					<p>{t(footerContent.subscription.text)}</p>
					<div className="footer__subscription-action">
						<input
							className="footer__subscription-input"
							type="text"
							placeholder={t(footerContent.subscription.placeholder)}
						/>

						<PrimaryBtn
							variant="footer"
							type="button"
						>
							{t(footerContent.subscription.button)}
						</PrimaryBtn>
					</div>
				</div>
			</div>
			<div className="footer__metadata">
				<a
					className="footer__metadata-email"
					href="mailto:info@littlefootcraft.art"
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
			</div>
		</footer>
	);
};

export default Footer;

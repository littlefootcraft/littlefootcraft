//Footer.jsx

import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "/uploads/images/logo.png";
import { NavItems } from "../utils/navItems";
import { menuUA, menuEN } from "../translations/translation";

import { FaRegEnvelope } from "react-icons/fa6";

import { IoLocationOutline } from "react-icons/io5";
import { FaInstagram, FaTiktok } from "react-icons/fa6";
import { useLanguage } from "../utils/LanguageContext";
import { PrimaryBtn } from "../components/PrimaryBtn";

const Footer = () => {
	const { currentLang, setCurrentLang } = useLanguage();
	const navigate = useNavigate();
	const location = useLocation();
	const dict = currentLang === "en" ? menuEN : menuUA;

	function switchLang(lang) {
		setCurrentLang(lang);

		const segment = location.pathname.split("/");
		segment[1] = lang;
		const newPath = segment.join("/") || `$/${lang}`;
		navigate(`${newPath}${location.search}`);
	}

	return (
		<footer className="footer">
			<div className="footer__content container">
				<div className="footer__brand">
					<img
						className="footer__brand-logo"
						src={logo}
						alt="Little foot creft logo"
					/>
					<p className="footer__brand-text">
						Where magic meets craftsmanship. Each piece is handcrafted with love
						and imbued with enchantment.
					</p>
					<div className="footer__brand-social">
						<FaInstagram />
						<FaTiktok />
					</div>
				</div>
				<div className="footer__nav">
					<h3 className="footer__subtitle">Quick Links</h3>
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
									{dict[id]}
								</NavLink>
							</li>
						))}
					</ul>
				</div>
				<div className="footer__support">
					<h3 className="footer__subtitle">Support</h3>
					<ul className="footer__support-items">
						<li className="footer__support-item">
							<Link to="/">Get in Touch</Link>
						</li>
						<li className="footer__support-item">
							<Link to="/">Shipping Information</Link>
						</li>
						<li className="footer__support-item">
							<Link to="/">Returns & Exchanges</Link>
						</li>
						<li className="footer__support-item">
							<Link to="/">Privacy Policy</Link>
						</li>
					</ul>
				</div>
				<div className="footer__subscription">
					<h3 className="footer__subtitle">Newsletter</h3>
					<p>Subscribe to receive updates about new pieces and workshops</p>
					<div className="footer__subscription-action">
						<input
							className="footer__subscription-input"
							type="text"
							// placeholder={dict.placeholder}
						/>

						<PrimaryBtn
							variant="footer"
							type="button"
						>
							Subscribe
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
					littlefootcraft@gmail.com
				</a>
				<a
					className="footer__metadata-address"
					href="https://www.google.com/maps?q=Galway,+Ireland"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Open location on the Google Maps"
				>
					<IoLocationOutline className="footer__metadata-icons" />
					Galway, Ireland
				</a>
			</div>
			<div className="footer__signature">
				<p className="footer__rights container">
					© {new Date().getFullYear()} Little Foot Craft. All rights reserved.
				</p>
			</div>
		</footer>
	);
};

export default Footer;

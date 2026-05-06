// src/layouts/MobileMenu.jsx
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { NavItems } from "../utils/navItems";
import { menuEN, menuUA } from "../translations/translation";
import { Globe, Search } from "lucide-react";
import { useState } from "react";

import { ChevronDown } from "lucide-react";

export const MobileMenu = ({ isOpen, isClose, isSearchOpen }) => {
	const { currentLang } = useLanguage();
	const dict = currentLang === "en" ? menuEN : menuUA;
	const navigate = useNavigate();
	const location = useLocation();

	// const [query, setQuery] = useState("");

	// Language
	const [isLangOpen, setIsLangOpen] = useState(false);

	const switchLang = (lang) => {
		const segment = location.pathname.split("/");
		segment[1] = lang;
		const newPath = segment.join("/") || `/${lang}`;
		navigate(`${newPath}${location.search}`);
		isClose();
	};

	if (!isOpen) return null;

	return (
		<>
			{/* Backdrop */}
			<div
				className="mobile-menu__backdrop"
				onClick={isClose}
			></div>
			{/* Menu panel */}

			<div
				className={`mobile-menu ${isSearchOpen ? "mobile-menu--search-open" : ""}`}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Nav links */}
				<nav className="mobile-menu__nav">
					<ul className="mobile-menu__list">
						{NavItems.map(({ id, path }) => (
							<li
								key={id}
								className="mobile-menu__item"
							>
								<NavLink
									to={`/${currentLang}${path === "/" ? "" : path}`}
									end={path === "/"}
									className={({ isActive }) =>
										`mobile-menu__link ${isActive ? "mobile-menu__link--active" : ""}`
									}
									onClick={isClose}
								>
									{dict[id]}
								</NavLink>
							</li>
						))}
					</ul>
				</nav>

				{/* Divider */}
				<div className="mobile-menu__divider" />

				{/* Language */}

				<section className="mobile-menu__section">
					<button
						className="mobile-menu__link mobile-menu__link--toggle"
						onClick={() => setIsLangOpen((prev) => !prev)}
					>
						<Globe
							size={18}
							className="mobile-menu__icon"
						/>
						{currentLang === "ua" ? "Мова" : "Language"}
						<span
							className={`mobile-menu__chevron ${isLangOpen ? "mobile-menu__chevron--open" : ""}`}
						>
							<ChevronDown size={16} />
						</span>
					</button>
					{isLangOpen && (
						<ul className="mobile-menu__sublist">
							<li className="mobile-menu__subitem">
								<button
									className="mobile-menu__sublink"
									onClick={() => switchLang("en")}
								>
									English
								</button>
							</li>

							<li className="mobile-menu__subitem">
								<button
									className="mobile-menu__sublink"
									onClick={() => switchLang("ua")}
								>
									Українська
								</button>
							</li>
						</ul>
					)}
				</section>

				<section className="mobile-menu__section-login">
					<ul className="mobile-menu__sublist-login">
						<li className="mobile-menu__subitem-login">
							<NavLink
								to={`/${currentLang}/login`}
								className="mobile-menu__sublink-login"
								onClick={isClose}
							>
								{currentLang === "ua" ? "Увійти" : "Login"}
							</NavLink>
						</li>

						<li className="mobile-menu__subitem-login">
							<NavLink
								to={`/${currentLang}/register`}
								className="mobile-menu__sublink-login"
								onClick={isClose}
							>
								{currentLang === "ua" ? "Зареєструватися" : "Register"}
							</NavLink>
						</li>
					</ul>
				</section>
			</div>
		</>
	);
};

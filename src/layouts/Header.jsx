//Header.jsx

import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import { NavItems } from "../utils/navItems";
import { useLanguage } from "../context/LanguageContext";

import { menuUA, menuEN } from "../translations/translation";
import { Badge } from "../components/Badge";

import logo from "/uploads/images/logo.png";
// import { CgClose } from "react-icons/cg";
import { TbWorld } from "react-icons/tb";
import {
	IoBagOutline,
	IoHeartOutline,
	IoSearchOutline,
	IoPersonOutline,
	IoCloseOutline,
} from "react-icons/io5";
// import { Globe } from "lucide-react";
// import { Star } from "lucide-react";
import { Search, Globe, Star, ShoppingBag, User } from "lucide-react";

const Header = () => {
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
	//Search
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	//Language switcher
	const [isLangSwitcherOpen, setIsLangSwitcherOpen] = useState(false);

	return (
		<header className="header">
			<div className="header__content container">
				<Link to="/">
					<img
						className="header__logo"
						src={logo}
						alt="Little foot creft logo"
					/>
				</Link>
				<nav className="header__nav">
					<ul className="header__nav-items">
						{NavItems.map(({ id, path }) => (
							<li
								key={id}
								className="header__nav-item"
							>
								<NavLink
									to={`/${currentLang}${path === "/" ? "" : path}`}
									end={path === "/"}
									className={({ isActive }) =>
										`header__nav-link ${isActive ? "header__nav-link--active" : ""}`
									}
								>
									{dict[id]}
								</NavLink>
							</li>
						))}
					</ul>
				</nav>
				<div className="header__icons">
					<button
						className="header__input-btn"
						aria-label="Search button"
						onClick={() => setIsSearchOpen(true)}
					>
						<Search />
					</button>

					<div className="header__language">
						<button
							className="header__language-btn"
							aria-label="Language button"
							// onClick={() => switchLang(currentLang === "en" ? "ua" : "en")}
							onClick={() => setIsLangSwitcherOpen((prev) => !prev)}
						>
							<Globe />
						</button>
						{/* Language switcher*/}
						{isLangSwitcherOpen && (
							<div className="header__language-switcher">
								<button
									className="header__language-option"
									onClick={() => {
										switchLang("en");
										setIsLangSwitcherOpen(false);
									}}
								>
									English
								</button>
								<button
									className="header__language-option"
									onClick={() => {
										switchLang("ua");
										setIsLangSwitcherOpen(false);
									}}
								>
									Українська
								</button>
							</div>
						)}
					</div>
					<Link
						to=""
						className="header__icon"
						aria-label="Wishlist icon"
					>
						<Star />
						<Badge
							className="header__icon-badge"
							variant="top"
							shape="dot"
						>
							1
						</Badge>
					</Link>
					<Link
						to=""
						className="header__icon"
						aria-label="Cart icon"
					>
						<ShoppingBag />
						<Badge
							className="header__icon-badge"
							variant="top"
							shape="dot"
						>
							1
						</Badge>
					</Link>
					<Link
						to=""
						className="header__icon"
						aria-label="Login icon"
					>
						<User />
					</Link>
				</div>
			</div>
			{isSearchOpen && (
				<div className="header__search">
					<div className="header__search-row-inner container">
						<form
							className="header__search-form"
							// onSubmit={handleSubmit}
						>
							<input
								id="search"
								className="header__search-input"
								type="text"
								placeholder="Пошук"
								// value={query}
								// onChange={(e) => setQuery(e.target.value)}
							/>

							<button
								className="header__search-submit"
								type="submit"
								aria-label="Шукати"
							>
								<IoSearchOutline size={28} />
							</button>
						</form>

						<button
							className="header__search-close"
							type="button"
							// aria-label="Закрити пошук"
							// onClick={() => {
							// 	setIsSearchOpen(false);
							// 	setQuery("");
							// }}
							onClick={() => setIsSearchOpen(false)}
						>
							<IoCloseOutline size={32} />
						</button>
					</div>
				</div>
			)}
		</header>
	);
};

export default Header;

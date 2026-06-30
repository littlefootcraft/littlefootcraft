//Header.jsx
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

// Contexts
import { useLanguage } from "../context/LanguageContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

// UTILS
import { NavItems } from "../utils/navItems";

// TRANSLATION
import {
	menuUA,
	menuEN,
	headerEN,
	headerUA,
} from "../translations/translation";

import logo from "/uploads/images/logo.png";

// COMPONENTS
import { Badge } from "../components/Badge";

// ICONS
import { Search, Globe, Star, ShoppingBag, User, Menu, X } from "lucide-react";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";
import { MobileMenu } from "./MobileMenu";

const Header = () => {
	const { currentLang, setCurrentLang } = useLanguage();
	const navigate = useNavigate();
	const location = useLocation();

	// Dictionary
	const dict = currentLang === "en" ? menuEN : menuUA;
	const headerDict = currentLang === "en" ? headerEN : headerUA;

	function switchLang(lang) {
		// setCurrentLang(lang);

		const segment = location.pathname.split("/");
		segment[1] = lang;
		const newPath = segment.join("/") || `/${lang}`;
		navigate(`${newPath}${location.search}`);
	}

	//Search
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [query, setQuery] = useState("");

	//Language switcher
	const [isLangSwitcherOpen, setIsLangSwitcherOpen] = useState(false);

	// Wishlist
	const { wishlist } = useWishlist();

	// Cart
	const { cartCount } = useCart();
	// console.log("cart-count", cartCount);

	// Mobile Menu
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	// Prevent body scroll when Mobile menu opened
	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isMobileMenuOpen]);

	// Off language swither on outside click
	const langRef = useRef(null);

	useEffect(() => {
		function handleClickOutside(e) {
			if (langRef.current && !langRef.current.contains(e.target)) {
				setIsLangSwitcherOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Close Mobile menu when icons clicked
	const closeMobileMenu = () => {
		setIsMobileMenuOpen(false);
	};

	// For Search to work
	const handleSearchSubmit = (e) => {
		e.preventDefault();

		const cleanedQuery = query.trim();

		if (!cleanedQuery) return;

		setIsSearchOpen(false);
		navigate(`/${currentLang}/shop?search=${encodeURIComponent(cleanedQuery)}`);
	};

	return (
		<header className="header">
			<div className="header__content container">
				{/* Logo */}
				<Link to={`/${currentLang}`}>
					<img
						className="header__logo"
						src={logo}
						alt="Little foot creft logo"
					/>
				</Link>

				{/* Desktop nav — hidden on mobile */}
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
					{/* Search Input trigger button*/}
					<button
						// ref={searchBtnRef}
						className="header__input-btn"
						aria-label={headerDict.searchButton}
						onClick={() => setIsSearchOpen((prev) => !prev)}
					>
						<Search />
					</button>

					<Link
						to={`/${currentLang}/wishlist`}
						className={`header__icon ${wishlist.length > 0 ? "header__icon--has-items" : ""}`}
						aria-label={headerDict.wishlist}
						onClick={closeMobileMenu}
					>
						<Star />
						{wishlist.length > 0 && (
							<Badge
								className="header__icon-badge"
								variant="top"
								shape="dot"
							>
								{wishlist.length}
							</Badge>
						)}
					</Link>
					<Link
						to={`/${currentLang}/cart`}
						className={`header__icon ${cartCount > 0 ? "header__icon--has-items" : ""}`}
						aria-label={headerDict.cart}
						onClick={closeMobileMenu}
					>
						<ShoppingBag />
						{cartCount > 0 && (
							<Badge
								className="header__icon-badge"
								variant="top"
								shape="dot"
							>
								{cartCount}
							</Badge>
						)}
					</Link>

					{/* Login */}
					<Link
						to={`/${currentLang}/login`}
						className="header__icon header__icon-login"
						aria-label={headerDict.login}
						onClick={closeMobileMenu}
					>
						<User />
					</Link>

					{/* Language trigger button*/}
					<div
						className="header__language header__icon-language"
						ref={langRef}
					>
						<button
							className="header__language-btn"
							aria-label={headerDict.languageButton}
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

					{/* Hamburger — visible only on mobile */}
					<button
						className="header__hamburger"
						onClick={() => setIsMobileMenuOpen((prev) => !prev)}
						aria-label={headerDict.toggleMenu}
					>
						{isMobileMenuOpen ? <X /> : <Menu />}
					</button>
				</div>
			</div>

			{/* Search input */}
			{isSearchOpen && (
				<div className="header__search">
					<div
						className="header__search-row-inner container"
						onClick={(e) => e.stopPropagation()}
					>
						<form
							className="header__search-form"
							onSubmit={handleSearchSubmit}
						>
							<IoSearchOutline
								size={18}
								className="header__search-form-icon"
							/>
							<input
								id="search"
								className="header__search-input"
								type="text"
								placeholder={headerDict.search}
								value={query}
								onChange={(e) => setQuery(e.target.value)}
							/>

							<button
								className="header__search-submit"
								type="submit"
								aria-label={headerDict.search}
							></button>
						</form>

						<button
							className="header__search-close"
							type="button"
							aria-label={headerDict.closeSearch}
							onClick={() => {
								setIsSearchOpen(false);
								setQuery("");
							}}
						>
							<IoCloseOutline size={32} />
						</button>
					</div>
				</div>
			)}
			{/* Mobile menu */}
			<MobileMenu
				isOpen={isMobileMenuOpen}
				isClose={() => setIsMobileMenuOpen(false)}
				isSearchOpen={isSearchOpen}
			/>
		</header>
	);
};

export default Header;

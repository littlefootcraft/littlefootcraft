// layouts/SiteShell.jsx
import { useParams } from "react-router-dom";
import { LanguageProvider } from "../context/LanguageContext";
import Header from "./Header";
import Footer from "./Footer";
import { WishlistProvider } from "../context/WishlistContext";
import { CartProvider } from "../context/CartContext";
import { ScrollToTop } from "../components/ScrollToTop";

export const SiteShell = ({ children }) => {
	const { lang } = useParams();
	const currentLang = lang === "ua" ? "ua" : "en";

	return (
		<LanguageProvider initialLang={currentLang}>
			<WishlistProvider>
				<CartProvider>
					<div className={`page ${currentLang === "ua" ? "ua" : ""}`}>
						<ScrollToTop />
						<Header />
						<main>{children}</main>
						<Footer />
					</div>
				</CartProvider>
			</WishlistProvider>
		</LanguageProvider>
	);
};

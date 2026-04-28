//Layout.jsx
import { Outlet, useParams } from "react-router-dom";
import { LanguageProvider } from "../context/LanguageContext";

import Header from "./Header";
import Footer from "./Footer";
import NotFoundPage from "./../pages/NotFoundPage";
import { supportedLanguages } from "../utils/localeConfig";
import { ProductsProvider } from "../context/ProductsContext";
import { WorkshopsProvider } from "../context/WorkshopsContext";
import { WishlistProvider } from "../context/WishlistContext";

export const Layout = () => {
	const { lang } = useParams();

	// Validate route language before rendering the provider
	//URL → Layout validation → Provider state → UI
	const isValidLang = supportedLanguages.includes(lang);
	if (!isValidLang) {
		return <NotFoundPage />;
	}

	return (
		<LanguageProvider initialLang={lang}>
			<WishlistProvider>
				<div className={`page ${lang === "ua" ? "ua" : ""}`}>
					<Header />
					<main>
						<ProductsProvider>
							<WorkshopsProvider>
								<Outlet />
							</WorkshopsProvider>
						</ProductsProvider>
					</main>
					<Footer />
				</div>
			</WishlistProvider>
		</LanguageProvider>
	);
};

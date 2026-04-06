//Layout.jsx
import { Outlet, useParams } from "react-router-dom";
import { LanguageProvider } from "../utils/LanguageContext";

import Header from "./Header";
import Footer from "./Footer";
import NotFoundPage from "./../pages/NotFoundPage";
import { supportedLanguages } from "../utils/localeConfig";
import { ProductsProvider } from "../context/ProductsContext";

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
			<div className="page">
				<Header />
				<main>
					<ProductsProvider>
						<Outlet />
					</ProductsProvider>
				</main>
				<Footer />
			</div>
		</LanguageProvider>
	);
};

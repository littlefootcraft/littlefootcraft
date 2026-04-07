//Layout.jsx
import { Outlet, useParams } from "react-router-dom";
import { LanguageProvider } from "../context/LanguageContext";

import Header from "./Header";
import Footer from "./Footer";
import NotFoundPage from "./../pages/NotFoundPage";
import { supportedLanguages } from "../utils/localeConfig";
import { ProductsProvider } from "../context/ProductsContext";
import { WorkshopsProvider } from "../context/WorkshopsContext";

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
						<WorkshopsProvider>
							<Outlet />
						</WorkshopsProvider>
					</ProductsProvider>
				</main>
				<Footer />
			</div>
		</LanguageProvider>
	);
};

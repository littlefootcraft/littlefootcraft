//Layout.jsx
import { Outlet, useParams } from "react-router-dom";
// import { LanguageProvider } from "../context/LanguageContext";

// import Header from "./Header";
// import Footer from "./Footer";
import NotFoundPage from "./../pages/NotFoundPage";
import { supportedLanguages } from "../utils/localeConfig";

import { SiteShell } from "./SiteShell";

export const Layout = () => {
	const { lang } = useParams();

	// Validate route language before rendering the provider
	//URL → Layout validation → Provider state → UI
	const isValidLang = supportedLanguages.includes(lang);

	if (!isValidLang) {
		return <NotFoundPage />;
	}

	return (
		<SiteShell>
			<Outlet />
		</SiteShell>
	);
};

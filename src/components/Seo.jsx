// src/components/Seo.jsx

import { Helmet } from "react-helmet-async";
import { useLanguage } from "../context/LanguageContext";

const ABS_DOMAIN = "https://littlefootcraft.netlify.app";

function toAbsUrl(pathOrUrl) {
	if (!pathOrUrl) return "";

	return pathOrUrl.startsWith("http")
		? pathOrUrl
		: `${ABS_DOMAIN}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

const Seo = ({
	title = "LittleFootCraft",
	description = "Handcrafted magical treasures inspired by fantasy and wonder.",
	url = "/en",
	image = "/uploads/images/seo-default.jpg",
	imageAlt = "LittleFootCraft",
	noIndex = false,
}) => {
	const { currentLang } = useLanguage();

	const absUrl = toAbsUrl(url);
	const absImage = toAbsUrl(image);

	const locale = currentLang === "ua" ? "uk_UA" : "en_US";

	return (
		<Helmet>
			<html lang={currentLang} />

			<title>{title}</title>

			<meta
				name="description"
				content={description}
			/>

			{noIndex && (
				<meta
					name="robots"
					content="noindex,nofollow"
				/>
			)}

			<link
				rel="canonical"
				href={absUrl}
			/>

			{/* Open Graph */}
			<meta
				property="og:type"
				content="website"
			/>
			<meta
				property="og:site_name"
				content="LittleFootCraft"
			/>
			<meta
				property="og:locale"
				content={locale}
			/>
			<meta
				property="og:title"
				content={title}
			/>
			<meta
				property="og:description"
				content={description}
			/>
			<meta
				property="og:url"
				content={absUrl}
			/>
			<meta
				property="og:image"
				content={absImage}
			/>
			<meta
				property="og:image:alt"
				content={imageAlt}
			/>

			{/* Twitter */}
			<meta
				name="twitter:card"
				content="summary_large_image"
			/>
			<meta
				name="twitter:title"
				content={title}
			/>
			<meta
				name="twitter:description"
				content={description}
			/>
			<meta
				name="twitter:image"
				content={absImage}
			/>
		</Helmet>
	);
};

export default Seo;

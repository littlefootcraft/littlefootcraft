import { Link, useParams } from "react-router-dom";
import {
	networkErrorPageUA,
	networkErrorPageEN,
} from "../translations/translation";

const NetworkErrorPage = () => {
	const { lang } = useParams();
	const currentLang = lang === "ua" ? "ua" : "en";

	const homePath = `/${currentLang}`;
	const shopPath = `/${currentLang}/shop`;

	const dict = currentLang === "en" ? networkErrorPageEN : networkErrorPageUA;

	return (
		<main className="network-error">
			<section className="network-error__block">
				<div className="network-error__content">
					<p className="network-error__eyebrow">{dict.eyebrow}</p>

					<h1 className="network-error__code">{dict.code}</h1>

					<h2 className="network-error__title">{dict.title}</h2>

					<p className="network-error__text">{dict.text}</p>

					<div className="network-error__actions">
						<Link
							to={homePath}
							className="network-error__button network-error__button--error-primary"
						>
							{dict.goHome}
						</Link>

						<Link
							to={shopPath}
							className="network-error__button network-error__button--error-secondary"
						>
							{dict.browseShop}
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
};

export default NetworkErrorPage;

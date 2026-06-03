import { Link, useParams, useRouteError } from "react-router-dom";
import {
	serverErrorPageUA,
	serverErrorPageEN,
} from "../translations/translation";

import { SiteShell } from "../layouts/SiteShell";
const ServerErrorPage = () => {
	const { lang } = useParams();
	const currentLang = lang === "ua" ? "ua" : "en";

	const homePath = `/${currentLang}`;
	const shopPath = `/${currentLang}/shop`;

	const dict = currentLang === "en" ? serverErrorPageEN : serverErrorPageUA;

	return (
		<SiteShell>
			<section className="server-error">
				<div className="server-error__block">
					<div className="server-error__content">
						<p className="server-error__eyebrow">{dict.eyebrow}</p>

						<h1 className="server-error__code">{dict.code}</h1>

						<h2 className="server-error__title">{dict.title}</h2>

						<p className="server-error__text">{dict.text}</p>

						<div className="server-error__actions">
							<Link
								to={homePath}
								className="server-error__button server-error__button--error-primary"
							>
								{dict.goHome}
							</Link>

							<Link
								to={shopPath}
								className="server-error__button server-error__button--error-secondary"
							>
								{dict.browseShop}
							</Link>
						</div>
					</div>
				</div>
			</section>
		</SiteShell>
	);
};

export default ServerErrorPage;

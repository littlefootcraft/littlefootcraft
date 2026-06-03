import { Link, useParams } from "react-router-dom";
import { notFoundPageUA, notFoundPageEN } from "../translations/translation";

const NotFoundPage = () => {
	const { lang } = useParams();
	const currentLang = lang === "ua" ? "ua" : "en";

	const homePath = `/${currentLang}`;
	const shopPath = `/${currentLang}/shop`;

	const dict = currentLang === "en" ? notFoundPageEN : notFoundPageUA;

	return (
		<main className="not-found">
			<section className="not-found__block">
				<div className="not-found__content">
					<p className="not-found__eyebrow">{dict.eyebrow}</p>

					<h1 className="not-found__code">{dict.code}</h1>

					<h2 className="not-found__title">{dict.title}</h2>

					<p className="not-found__text">{dict.text}</p>

					<div className="not-found__actions">
						<Link
							to={homePath}
							className="not-found__button not-found__button--error-primary"
						>
							{dict.goHome}
						</Link>

						<Link
							to={shopPath}
							className="not-found__button not-found__button--error-secondary"
						>
							{dict.browseShop}
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
};

export default NotFoundPage;

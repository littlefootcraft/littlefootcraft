import { useEffect } from "react";
import { X, ShieldCheck } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import privacyPolicy from "../content/modals/privacy-policy.json";

export const PrivacyPolicyModal = ({ isOpen, onClose }) => {
	const { currentLang } = useLanguage();
	const t = (field) => field?.[currentLang] ?? field?.en ?? "";

	useEffect(() => {
		if (!isOpen) return;

		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		const handleEscape = (e) => {
			if (e.key === "Escape") onClose();
		};

		window.addEventListener("keydown", handleEscape);

		return () => {
			document.body.style.overflow = originalOverflow;
			window.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div
			className="privacy-modal"
			onClick={onClose}
		>
			<div
				className="privacy-modal__content"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					type="button"
					className="privacy-modal__close"
					onClick={onClose}
					aria-label="Close privacy policy"
				>
					<X />
				</button>

				<div className="privacy-modal__icon">
					<ShieldCheck />
				</div>

				<h2 className="privacy-modal__title">{t(privacyPolicy.title)}</h2>

				<p className="privacy-modal__intro">{t(privacyPolicy.intro)}</p>

				<div className="privacy-modal__sections">
					{privacyPolicy.sections.map((section, index) => (
						<section
							key={index}
							className="privacy-modal__section"
						>
							<h3 className="privacy-modal__section-title">
								{t(section.title)}
							</h3>
							<p className="privacy-modal__section-text">{t(section.text)}</p>
						</section>
					))}
				</div>

				<p className="privacy-modal__updated">{t(privacyPolicy.updated)}</p>
			</div>
		</div>
	);
};

import { Link } from "react-router-dom";
import { PrimaryBtn } from "./PrimaryBtn";
import { SecondaryBtn } from "./SecondaryBtn";

export const OrderSuccessModal = ({
	isOpen,
	currentLang,
	onClose,
	orderNumber,
}) => {
	if (!isOpen) return null;

	const shopPath = `/${currentLang}/shop`;
	const homePath = `/${currentLang}`;

	const dict =
		currentLang === "ua"
			? {
					eyebrow: "Запит на замовлення надіслано",
					title: "Ваше замовлення отримано ✨",
					text: "Дякуємо! Ваше замовлення ще не підтверджене. Ми перевіримо наявність товарів і доставку, а потім зв’яжемося з вами з деталями оплати.",
					shop: "До магазину",
					home: "На головну",
				}
			: {
					eyebrow: "Order request sent",
					title: "We received your order ✨",
					text: "Thank you! Your order is not confirmed yet. We will check item availability and shipping, then contact you with payment details.",
					shop: "Back to shop",
					home: "Home",
				};

	return (
		<div className="order-success-modal">
			<div className="order-success-modal__overlay" />

			<div className="order-success-modal__window">
				<div className="order-success-modal__image" />

				<div className="order-success-modal__content">
					<p className="order-success-modal__eyebrow">{dict.eyebrow}</p>
					<h2 className="order-success-modal__title">{dict.title}</h2>

					{orderNumber && (
						<div className="order-success-modal__number">
							<span>
								{currentLang === "ua" ? "Номер замовлення" : "Order number"}
							</span>

							<strong>{orderNumber}</strong>
						</div>
					)}
					<p className="order-success-modal__text">{dict.text}</p>

					<div className="order-success-modal__actions">
						<PrimaryBtn
							variant="shop"
							to={shopPath}
							className="order-success-modal__button"
						>
							{dict.shop}
						</PrimaryBtn>

						<SecondaryBtn
							to={homePath}
							variant="home"
							className="order-success-modal__button"
						>
							{dict.home}
						</SecondaryBtn>
					</div>
					{/* 
					<button
						type="button"
						className="order-success-modal__close"
						onClick={onClose}
					>
						×
					</button> */}
				</div>
			</div>
		</div>
	);
};

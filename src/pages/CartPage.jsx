//CartPage.jsx
import { Link, useOutletContext } from "react-router-dom";

// COMPONENTS
import { PrimaryBtn } from "../components/PrimaryBtn";
import { SecondaryBtn } from "../components/SecondaryBtn";

// UTILS
import { formatPrice } from "../utils/formatPrice";

// HOOKS
import { useCartDetails } from "../hooks/useCartDetails";

import { cartPageEN, cartPageUA } from "../translations/translation";

//Icons
import { ArrowLeft } from "lucide-react";

import { useLanguage } from "../context/LanguageContext";

import { PageTopTitle } from "../components/PageTopTitle";
import { useCart } from "../context/CartContext";
import { CartItem } from "../components/CartItem";

const CartPage = () => {
	const { currentLang } = useLanguage();
	const { cartProducts, totalAmount, totalDiscount, originalTotal } =
		useCartDetails();
	const t = (field) => field?.[currentLang] ?? field?.en ?? "";
	const dict = currentLang === "en" ? cartPageEN : cartPageUA;

	return (
		<div className="cart-page">
			{/* 1. title */}
			<PageTopTitle
				title={dict.title}
				subtitle={dict.subtitle}
			/>

			<div className="cart-page__content container">
				{cartProducts.length === 0 ? (
					<div className="cart-empty">
						<span className="cart-empty__icon">✦</span>
						<h2 className="cart-empty__title">{dict.emptyTitle}</h2>
						<p className="cart-empty__text">{dict.emptyText}</p>

						<div>
							<PrimaryBtn
								variant="to-shop"
								to={`/${currentLang}/shop`}
							>
								{dict.emptyBtn}
							</PrimaryBtn>
						</div>
					</div>
				) : (
					<div className="cart-page__layout">
						<div>
							<Link
								to={`/${currentLang}/shop`}
								className="cart-page__back-btn"
							>
								<ArrowLeft />
								{dict.backBtn}
							</Link>
							<div className="cart-page__cards shared-shadow">
								{cartProducts.map((item) => (
									<CartItem
										key={item.sku}
										sku={item.sku}
										qty={item.qty}
										image={item.image}
										name={t(item.name)}
										price={item.price}
										oldPrice={item.oldPrice}
										category={t(item.specifications.category)}
									/>
								))}
							</div>
						</div>
						<div className="cart__summary shared-shadow">
							<h2 className="cart__summary-title">{dict.orderTitle}</h2>
							<ul className="cart__summary-items">
								{cartProducts.map((item) => (
									<li
										className="cart__summary-item"
										key={item.sku}
									>
										<span>{`${t(item.name) ?? item.name?.en} x ${item.qty}`}</span>

										<div className="cart__summary-price">
											{item.lineOldTotal != null && (
												<div className="cart__summary-price--old">
													{formatPrice(item.lineOldTotal)}
												</div>
											)}

											<div
												className={`cart__summary-price--new ${
													item.oldPrice != null
														? "cart__summary-price--discount"
														: ""
												}`}
											>
												{formatPrice(item.lineTotal)}
											</div>
										</div>
									</li>
								))}
							</ul>

							<div className="cart__summary-delivery">
								<span>{dict.deliveryTitle}</span>
								<span>{dict.deliveryInfo}</span>
							</div>
							{/* {discount > 0 && (
								<div className="cart__summary-discount">
									<span>Ви зберігаєте</span>
									<span>₴</span>
								</div>
							)} */}
							<div className="cart__summary-total">
								<span className="cart__summary-total-title">
									{dict.totalTitle}
								</span>
								<span className="cart__summary-total-amount">
									{formatPrice(totalAmount)}
								</span>
							</div>
							<div className="cart__summary-btns">
								<PrimaryBtn
									variant="order"
									to={`/${currentLang}/order`}
								>
									{dict.checkout}
								</PrimaryBtn>
								<SecondaryBtn to={`/${currentLang}/shop`}>
									{dict.continueShopping}
								</SecondaryBtn>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default CartPage;

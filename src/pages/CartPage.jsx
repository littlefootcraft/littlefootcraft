//CartPage.jsx

// import { CartItemCard } from "../components/CartItemCard";
import { PrimaryBtn } from "../components/PrimaryBtn";
import { SecondaryBtn } from "../components/SecondaryBtn";

import { Link, useOutletContext } from "react-router-dom";
import { useCartDetails } from "../hooks/useCartDetails";
import { cartPageEN, cartPageUA } from "../translations/translation";

//Icons
import { ShoppingBag } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useEffect } from "react";
import { PageTopTitle } from "../components/PageTopTitle";
import { useCart } from "../context/CartContext";

const CartPage = () => {
	const { currentLang } = useLanguage();
	const { cartProducts, totalAmount, totalDiscount, originalTotal } =
		useCartDetails();

	const dict = currentLang === "en" ? cartPageEN : cartPageUA;

	return (
		<div className="cart">
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

						<PrimaryBtn
							variant="to-catalog"
							to="/shop"
						>
							{dict.emptyBtn}
						</PrimaryBtn>
					</div>
				) : (
					<div className="cart-page__layout">
						<div className="cart-page__cards shared-shadow">
							{/* {cartProducts.map((item) => (
								<CartItemCard
									key={item.sku}
									sku={item.sku}
									productSku={item.productSku}
									size={item.size}
									qty={item.qty}
									image={item.image}
									name={item.name}
									price={item.price}
									oldPrice={item.oldPrice}
								/>
							))} */}
						</div>
						<div className="cart-page__summary shared-shadow">
							<h2 className="cart-page__summary-title">Ваше замовлення</h2>
							<ul className="cart-page__summary-items">
								{cartProducts.map((item) => (
									<li
										className="cart-page__summary-item"
										key={item.sku}
									>
										<div>{`${item.name} (${item.size}) x ${item.qty}`}</div>

										<div className="cart-page__summary-price">
											{item.lineOldTotal != null && (
												<div className="cart-page__summary-price--old">
													{item.lineOldTotal}
													<span>₴</span>
												</div>
											)}

											<div
												className={`cart-page__summary-price--new ${
													item.oldPrice != null
														? "cart-page__summary-price--discount"
														: ""
												}`}
											>
												{item.lineTotal}
												<span>₴</span>
											</div>
										</div>
									</li>
								))}
							</ul>

							<div className="cart-page__summary-delivery">
								<span>Доставка</span>
								<span>За тарифами перевізника</span>
							</div>
							{/* {discount > 0 && (
								<div className="cart-page__summary-discount">
									<span>Ви зберігаєте</span>
									<span>₴</span>
								</div>
							)} */}
							<div className="cart-page__summary-total">
								<span className="cart-page__summary-total-text">До сплати</span>
								<span className="cart-page__summary-total-amount">
									{/* {totalAmount}₴ */}
								</span>
							</div>
							<div className="cart-page__summary-btns">
								<PrimaryBtn
									variant="order"
									to="/order"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
								>
									Оформити замовлення
								</PrimaryBtn>
								<SecondaryBtn
									to="/catalog"
									fullWidth
								>
									Продовжити покупки
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

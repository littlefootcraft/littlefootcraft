//OrderPage.jsx

import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Sparkles, ShieldCheck } from "lucide-react";

import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";
import { useLanguage } from "../context/LanguageContext";
import { formatPrice } from "../utils/formatPrice";
import Seo from "../components/Seo";
import { PrimaryBtn } from "../components/PrimaryBtn";
import { PageTopTitle } from "../components/PageTopTitle";

import { orderPageUA, orderPageEN } from "../translations/translation";

const GIFT_POSTCARD_PRICE = 2;

const OrderPage = () => {
	const { currentLang } = useLanguage();
	const products = useProducts();
	const { cartList } = useCart();

	const dict = currentLang === "en" ? orderPageEN : orderPageUA;

	const [form, setForm] = useState({
		name: "",
		email: "",
		phone: "",
		address: "",
		apartment: "",
		city: "",
		postalCode: "",
		country: "",
		giftPostcard: false,
		giftMessage: "",
		message: "",
	});

	const cartProducts = cartList
		.map((item) => {
			const product = products.find((p) => p.sku === item.sku);

			return product ? { ...product, quantity: item.quantity || 1 } : null;
		})
		.filter(Boolean);

	const total = cartProducts.reduce(
		(sum, product) => sum + product.price * product.quantity,
		0,
	);

	const t = (field) => field?.[currentLang] ?? field?.en ?? "";

	const handleChange = (event) => {
		const { name, value } = event.target;

		setForm((current) => ({
			...current,
			[name]: value,
		}));
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		console.log("Order request:", {
			customer: form,
			items: cartProducts,
			total,
		});

		// Later: send this data to Supabase
	};

	// Gift card
	const giftPostcardPrice = form.giftPostcard ? GIFT_POSTCARD_PRICE : 0;
	const totalWithExtras = total + giftPostcardPrice;

	return (
		<section className="order-page">
			<Seo
				title="Request Order | LittleFootCraft"
				description="Send an order request for handcrafted magical treasures."
				url={`/${currentLang}/order`}
				noIndex
			/>
			{/* 1. title */}
			<PageTopTitle
				title={dict.title}
				subtitle={dict.subtitle}
			/>

			<div className="order-page__content container">
				<div>
					{/* Breadcrumbs */}
					<nav
						className="order-page__breadcrumbs"
						aria-label="Breadcrumbs"
					>
						<Link
							className="order-page__breadcrumbs-link"
							to={`/${currentLang}`}
						>
							Home
						</Link>
						<span className="order-page__breadcrumbs-separator">/</span>
						<Link
							className="order-page__breadcrumbs-link"
							to={`/${currentLang}/shop`}
						>
							Shop
						</Link>
						<span className="order-page__breadcrumbs-separator">/</span>
						<Link
							className="order-page__breadcrumbs-link"
							to={`/${currentLang}/cart`}
						>
							Cart
						</Link>
						<span className="order-page__breadcrumbs-separator">/</span>
						<span className="order-page__breadcrumbs-current">Checkout</span>
					</nav>
					<form
						className="order-page__form"
						onSubmit={handleSubmit}
					>
						<div className="order-page__form-divider">
							<h2 className="order-page__section-title">Contact Details</h2>
							<div className="order-page__field">
								<label htmlFor="name">Full Name</label>
								<input
									id="name"
									name="name"
									value={form.name}
									onChange={handleChange}
									required
								/>
							</div>
							<div className="order-page__field">
								<label htmlFor="email">Email</label>
								<input
									id="email"
									name="email"
									type="email"
									value={form.email}
									onChange={handleChange}
									required
								/>
							</div>
							<div className="order-page__field">
								<label htmlFor="phone">Phone</label>
								<input
									id="phone"
									name="phone"
									value={form.phone}
									onChange={handleChange}
								/>
							</div>
						</div>

						<div className="order-page__form-divider">
							<h2 className="order-page__section-title">Shipping Address</h2>
							<div className="order-page__field">
								<label htmlFor="address">Address</label>
								<input
									id="address"
									name="address"
									value={form.address}
									onChange={handleChange}
									required
								/>
							</div>
							<div className="order-page__field">
								<label htmlFor="apartment">
									Apartment, suite, etc. optional
								</label>
								<input
									id="apartment"
									name="apartment"
									value={form.apartment}
									onChange={handleChange}
								/>
							</div>
							<div className="order-page__row">
								<div className="order-page__field">
									<label htmlFor="city">City</label>
									<input
										id="city"
										name="city"
										value={form.city}
										onChange={handleChange}
										required
									/>
								</div>
								<div className="order-page__field">
									<label htmlFor="postalCode">Postal Code</label>
									<input
										id="postalCode"
										name="postalCode"
										value={form.postalCode}
										onChange={handleChange}
										required
									/>
								</div>
							</div>
							<div className="order-page__field">
								<label htmlFor="country">Country</label>
								<input
									id="country"
									name="country"
									value={form.country}
									onChange={handleChange}
									required
								/>
							</div>
						</div>

						<div className="order-page__gift">
							<label className="order-page__gift-checkbox">
								<input
									type="checkbox"
									name="giftPostcard"
									checked={form.giftPostcard}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											giftPostcard: event.target.checked,
										}))
									}
								/>
								<span>Add a gift postcard</span>
								<strong>+ €2</strong>
							</label>

							{form.giftPostcard && (
								<div className="order-page__field">
									<label htmlFor="giftMessage">Gift Note optional</label>
									<textarea
										id="giftMessage"
										name="giftMessage"
										maxLength={200}
										value={form.giftMessage}
										onChange={handleChange}
										placeholder="Write a magical message for your recipient..."
									/>
									<span className="order-page__char-count">
										{form.giftMessage.length}/200 characters
									</span>
								</div>
							)}
						</div>

						<div className="order-page__notice">
							<ShieldCheck />
							<span>
								Payment is not taken now. The owner will confirm your order
								first.
							</span>
						</div>
						<PrimaryBtn
							variant="order"
							type="submit"
						>
							Send Order Request
						</PrimaryBtn>
					</form>
				</div>

				<aside className="order-page__summary">
					<h2 className="order-page__section-title">Order Summary</h2>

					<div className="order-page__items">
						{cartProducts.map((product) => (
							<div
								key={product.sku}
								className="order-page__item"
							>
								<img
									src={product.photo?.[0]?.src}
									alt={t(product.photo?.[0]?.alt)}
									className="order-page__item-image"
								/>

								<div className="order-page__item-info">
									<h3>{t(product.name)}</h3>
									<span>SKU: {product.sku}</span>
									<span>Qty: {product.quantity}</span>
								</div>

								<strong>{formatPrice(product.price * product.quantity)}</strong>
							</div>
						))}
					</div>
					{form.giftPostcard && (
						<div className="order-page__extra">
							<span>Gift postcard</span>
							<strong>{formatPrice(GIFT_POSTCARD_PRICE)}</strong>
						</div>
					)}
					<div className="order-page__total">
						<span>Total</span>
						<strong>{formatPrice(totalWithExtras)}</strong>
					</div>

					<p className="order-page__summary-note">
						Shipping price will be confirmed after we check the item location
						and destination country.
					</p>

					<Link
						className="order-page__back-link"
						to={`/${currentLang}/cart`}
					>
						Back to cart
					</Link>
				</aside>
			</div>
		</section>
	);
};

export default OrderPage;

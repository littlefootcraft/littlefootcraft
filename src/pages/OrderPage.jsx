//OrderPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import countries from "i18n-iso-countries";
import ukLocale from "i18n-iso-countries/langs/uk.json";
import enLocale from "i18n-iso-countries/langs/en.json";

// COMPONENTS
import { PrimaryBtn } from "../components/PrimaryBtn";
import { PageTopTitle } from "../components/PageTopTitle";

// ICONS
import { ShieldCheck, ChevronDown } from "lucide-react";

// CONTEXT
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";
import { useLanguage } from "../context/LanguageContext";

// UTILS
import { formatPrice } from "../utils/formatPrice";

// SEO
import Seo from "../components/Seo";

import { orderPageUA, orderPageEN } from "../translations/translation";

import { supabase } from "../lib/supabaseClient";

// CONFIRMATION EMAIL
import { createOrderConfirmationEmail } from "../emails/orderConfirmationEmail";

import { OrderSuccessModal } from "../components/OrderSuccessModal";

const GIFT_POSTCARD_PRICE = 2;

const OrderPage = () => {
	const { currentLang } = useLanguage();
	const products = useProducts();
	const { cartList, clearCart } = useCart();

	const [errors, setErrors] = useState({});
	const [status, setStatus] = useState("idle");
	// Order Confirmation message
	const [message, setMessage] = useState("");

	// Order numbre from Supabase
	const [orderNumber, setOrderNumber] = useState("");

	const dict = currentLang === "en" ? orderPageEN : orderPageUA;

	// List of countries to choose from
	countries.registerLocale(enLocale);
	countries.registerLocale(ukLocale);

	const countryNames = countries.getNames(currentLang === "ua" ? "uk" : "en", {
		select: "official",
	});

	const countryOptions = Object.entries(countryNames).sort((a, b) =>
		a[1].localeCompare(b[1]),
	);

	const [form, setForm] = useState({
		name: "",
		lastName: "",
		email: "",
		phone: "",
		street: "",
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

			return product ? { ...product, quantity: item.qty || 1 } : null;
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

	const handleSubmit = async (event) => {
		event.preventDefault();

		const newErrors = {};

		if (form.name.trim().length < 2) {
			newErrors.name = dict.nameError;
		}

		if (form.lastName.trim().length < 2) {
			newErrors.lastName = dict.lastNameError;
		}

		if (!form.email.trim()) {
			newErrors.email = dict.emailError;
		}

		if (!form.street.trim()) {
			newErrors.street = dict.streetError;
		}

		if (!form.city.trim()) {
			newErrors.city = dict.cityError;
		}

		if (!form.postalCode.trim()) {
			newErrors.postalCode = dict.postalCodeError;
		}

		if (!form.country.trim()) {
			newErrors.country = dict.countryError;
		}
		// if (!form.apartment.trim()) {
		// 	newErrors.apartment = dict.apartmentError;
		// }

		if (!form.phone?.trim()) {
			newErrors.phone = dict.phoneError;
		} else if (!isValidPhoneNumber(form.phone)) {
			newErrors.phone = dict.invalidPhoneError;
		}

		setErrors(newErrors);

		if (Object.keys(newErrors).length > 0) {
			return;
		}

		setStatus("loading");

		// Supabase
		const { data, error } = await supabase
			.from("orders")
			.insert({
				customer_name: `${form.name} ${form.lastName}`,
				email: form.email,
				phone: form.phone,
				country: form.country,
				city: form.city,
				street: form.street,
				apartment: form.apartment, // optional
				zip_code: form.postalCode,

				comment: form.message,

				items: cartProducts,
				subtotal: total,
				discount: 0,
				total: totalWithExtras,
			})
			.select("order_number")
			.single();

		if (error) {
			console.error("Order creation failed:", error);
			setStatus("error");
			return;
		}

		const { subject, html } = createOrderConfirmationEmail({
			cartProducts,
			currentLang,
			totalWithExtras,
			orderNumber: data.order_number,
			t,
		});

		const { error: emailError } = await supabase.functions.invoke(
			"resend-email",
			{
				body: {
					to: form.email,
					subject,
					html,
				},
			},
		);

		if (emailError) {
			console.log("Order confirmation email error:", emailError);
		}

		setStatus("success");
		setOrderNumber(data.order_number);
		clearCart();
		// setMessage(
		// 	currentLang === "ua"
		// 		? "Ваше замовлення надіслано. Ми зв’яжемося з вами найближчим часом."
		// 		: "Your order request was sent. We will contact you shortly.",
		// );
		console.log("Order created successfully!");
	};

	// Gift card
	const giftPostcardPrice = form.giftPostcard ? GIFT_POSTCARD_PRICE : 0;
	const totalWithExtras = total + giftPostcardPrice;

	// For name do not accept numbers
	const handleNameChange = (event) => {
		const { name, value } = event.target;

		if (/^[\p{L}\s'ʼ-]*$/u.test(value)) {
			setForm((current) => ({
				...current,
				[name]: value,
			}));

			setErrors((current) => ({
				...current,
				[name]: "",
			}));
		}
	};

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
							{dict.home}
						</Link>
						<span className="order-page__breadcrumbs-separator">/</span>
						<Link
							className="order-page__breadcrumbs-link"
							to={`/${currentLang}/shop`}
						>
							{dict.shop}
						</Link>
						<span className="order-page__breadcrumbs-separator">/</span>
						<Link
							className="order-page__breadcrumbs-link"
							to={`/${currentLang}/cart`}
						>
							{dict.cart}
						</Link>
						<span className="order-page__breadcrumbs-separator">/</span>
						<span className="order-page__breadcrumbs-current">Checkout</span>
					</nav>
					<form
						className="order-page__form"
						onSubmit={handleSubmit}
					>
						<div className="order-page__form-divider">
							<h2 className="order-page__section-title">{dict.contactTitle}</h2>
							<div className="order-page__field">
								<label htmlFor="name">{dict.name}</label>
								<input
									id="name"
									name="name"
									value={form.name}
									onChange={handleNameChange}
								/>
								{errors.name && (
									<p className="order-page__error">{errors.name}</p>
								)}
							</div>
							<div className="order-page__field">
								<label htmlFor="lastName">{dict.lastName}</label>
								<input
									id="lastName"
									name="lastName"
									value={form.lastName}
									onChange={handleNameChange}
								/>
								{errors.lastName && (
									<p className="order-page__error">{errors.lastName}</p>
								)}
							</div>
							<div className="order-page__field">
								<label htmlFor="email">{dict.email}</label>
								<input
									id="email"
									name="email"
									type="email"
									value={form.email}
									onChange={handleChange}
								/>
								{errors.email && (
									<p className="order-page__error">{errors.email}</p>
								)}
							</div>
							<div className="order-page__field">
								<label htmlFor="phone">{dict.phone}</label>
								<PhoneInput
									// className="workshop-booking-modal__input"
									type="tel"
									international
									defaultCountry="IE"
									name="phone"
									placeholder={dict.phone}
									countryCallingCodeEditable={false}
									value={form.phone}
									limitMaxLength
									onChange={(value) => {
										setForm((current) => ({
											...current,
											phone: value || "",
										}));

										setErrors((currentErrors) => ({
											...currentErrors,
											phone: "",
										}));
									}}
									disabled={status === "loading"}
								/>
								{errors.phone && (
									<p className="order-page__error">{errors.phone}</p>
								)}
							</div>
						</div>

						<div className="order-page__form-divider">
							<h2 className="order-page__section-title">
								{dict.shippingTitle}
							</h2>
							<div className="order-page__field">
								<label htmlFor="street">{dict.street}</label>
								<input
									id="street"
									name="street"
									value={form.street}
									onChange={handleChange}
								/>
								{errors.street && (
									<p className="order-page__error">{errors.street}</p>
								)}
							</div>
							<div className="order-page__field">
								<label htmlFor="apartment">{dict.apartment}</label>
								<input
									id="apartment"
									name="apartment"
									value={form.apartment}
									onChange={handleChange}
								/>
								{errors.apartment && (
									<p className="order-page__error">{errors.apartment}</p>
								)}
							</div>
							<div className="order-page__row">
								<div className="order-page__field">
									<label htmlFor="city">{dict.city}</label>
									<input
										id="city"
										name="city"
										value={form.city}
										onChange={handleChange}
									/>
									{errors.city && (
										<p className="order-page__error">{errors.city}</p>
									)}
								</div>
								<div className="order-page__field">
									<label htmlFor="postalCode">{dict.postalCode}</label>
									<input
										id="postalCode"
										name="postalCode"
										value={form.postalCode}
										onChange={handleChange}
									/>
									{errors.postalCode && (
										<p className="order-page__error">{errors.postalCode}</p>
									)}
								</div>
							</div>
							<div className="order-page__field">
								<label htmlFor="country">{dict.country}</label>
								<div className="order-page__select-wrapper">
									<select
										id="country"
										name="country"
										value={form.country}
										onChange={handleChange}
									>
										<option value="">
											{currentLang === "ua"
												? "Оберіть країну"
												: "Select a country"}
										</option>
										{countryOptions.map(([code, name]) => (
											<option
												key={code}
												value={name}
											>
												{name}
											</option>
										))}
									</select>
									<ChevronDown className="order-page__select-icon" />
								</div>

								{errors.country && (
									<p className="order-page__error">{errors.country}</p>
								)}
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
								<span>{dict.giftPostcard}</span>
								<strong>+ €2</strong>
							</label>

							{form.giftPostcard && (
								<div className="order-page__field">
									<label htmlFor="giftMessage">{dict.giftNote}</label>
									<textarea
										id="giftMessage"
										name="giftMessage"
										maxLength={200}
										value={form.giftMessage}
										onChange={handleChange}
										placeholder={dict.giftPlaceholder}
									/>
									<span className="order-page__char-count">
										{form.giftMessage.length}/200 characters
									</span>
								</div>
							)}
						</div>

						<div className="order-page__notice">
							<ShieldCheck />
							<span>{dict.paymentNotice}</span>
						</div>

						{/* Order confirmation message*/}
						{message && (
							<p
								className={`order-page__feedback order-page__feedback--${status}`}
							>
								{message}
							</p>
						)}
						<PrimaryBtn
							variant="order"
							type="submit"
							disabled={status === "loading"}
						>
							{status === "loading"
								? currentLang === "ua"
									? "Надсилаємо..."
									: "Sending..."
								: dict.submitBtn}
						</PrimaryBtn>
					</form>
				</div>

				<aside className="order-page__summary">
					<h2 className="order-page__section-title">{dict.summaryTitle}</h2>

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

					<p className="order-page__summary-note">{dict.shippingNote}</p>

					<Link
						className="order-page__back-link"
						to={`/${currentLang}/cart`}
					>
						{dict.backToCart}
					</Link>
				</aside>

				<OrderSuccessModal
					isOpen={status === "success"}
					currentLang={currentLang}
					orderNumber={orderNumber}
					onClose={() => setStatus("idle")}
				/>
			</div>
		</section>
	);
};

export default OrderPage;

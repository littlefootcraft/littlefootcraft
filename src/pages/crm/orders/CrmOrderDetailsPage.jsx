// src/pages/crm/orders/CrmOrderDetailsPage.jsx

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Gift, Mail, MapPin, Package, Phone } from "lucide-react";

import { supabase } from "../../../lib/supabaseClient";

import { CrmFlagBadge } from "../../../components/crm/CrmFlagBadge";

const formatStatus = (status) => {
	if (!status) return "—";

	return status
		.replaceAll("_", " ")
		.replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatDate = (date) => {
	if (!date) return "—";

	return new Intl.DateTimeFormat("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
	}).format(new Date(date));
};

const formatCurrency = (amount, currency = "EUR") => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	}).format(Number(amount || 0));
};

const getItemName = (item) => {
	if (!item) return "Product";

	if (typeof item.name === "string") {
		return item.name;
	}

	if (item.name?.en) {
		return item.name.en;
	}

	if (typeof item.title === "string") {
		return item.title;
	}

	if (item.title?.en) {
		return item.title.en;
	}

	return "Product";
};

// const getItemImage = (item) => {
// 	if (!item) return null;

// 	if (typeof item.image === "string") {
// 		return item.image;
// 	}

// 	if (Array.isArray(item.images) && item.images.length > 0) {
// 		return item.images[0];
// 	}

// 	return null;
// };

const getItemImage = (item) => {
	if (!item) return null;

	if (Array.isArray(item.photo) && item.photo.length > 0) {
		const firstPhoto = item.photo[0];

		if (typeof firstPhoto === "string") {
			return firstPhoto;
		}

		if (typeof firstPhoto?.src === "string") {
			return firstPhoto.src;
		}

		if (typeof firstPhoto?.url === "string") {
			return firstPhoto.url;
		}
	}

	return null;
};

const CrmOrderDetailsPage = () => {
	const { orderId } = useParams();

	const [order, setOrder] = useState(null);
	const [status, setStatus] = useState("loading");
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		const fetchOrder = async () => {
			setStatus("loading");
			setErrorMessage("");

			const { data, error } = await supabase
				.from("orders")
				.select("*")
				.eq("id", orderId)
				.single();

			if (error) {
				console.error("Error fetching order:", error);

				setStatus("error");
				setErrorMessage("Unable to load this order.");
				return;
			}

			setOrder(data);
			setStatus("success");
		};

		fetchOrder();
	}, [orderId]);

	if (status === "loading") {
		return (
			<section className="crm-order-details">
				<div className="crm-order-details__state">Loading order...</div>
			</section>
		);
	}

	if (status === "error") {
		return (
			<section className="crm-order-details">
				<Link
					to="/crm/orders"
					className="crm-order-details__back"
				>
					<ArrowLeft size={18} />
					<span>Back to orders</span>
				</Link>

				<div className="crm-order-details__state crm-order-details__state--error">
					{errorMessage}
				</div>
			</section>
		);
	}

	if (!order) {
		return null;
	}

	const items = Array.isArray(order.items) ? order.items : [];

	const paymentStatus = order.payment_status || "not_requested";

	return (
		<section className="crm-order-details">
			<Link
				to="/crm/orders"
				className="crm-order-details__back"
			>
				<ArrowLeft size={18} />
				<span>Back to orders</span>
			</Link>

			<div className="crm-order-details__header">
				<div>
					<p className="crm-order-details__eyebrow">Order</p>

					<h1 className="crm-order-details__title">{order.order_number}</h1>

					<p className="crm-order-details__date">
						Placed {formatDate(order.created_at)}
					</p>
				</div>

				<div className="crm-order-details__statuses">
					<div className="crm-order-details__status-group">
						<span className="crm-order-details__status-label">
							Order status
						</span>

						<CrmFlagBadge variant={order.status}>
							{formatStatus(order.status)}
						</CrmFlagBadge>
					</div>

					<div className="crm-order-details__status-group">
						<span className="crm-order-details__status-label">Payment</span>

						<span
							className={`crm-order-details__payment crm-order-details__payment--${paymentStatus}`}
						>
							{formatStatus(paymentStatus)}
						</span>
					</div>
				</div>
			</div>

			<div className="crm-order-details__layout">
				<div className="crm-order-details__main">
					{/* CUSTOMER */}
					<section className="crm-order-details__card">
						<div className="crm-order-details__card-header">
							<h2 className="crm-order-details__card-title">Customer</h2>
						</div>

						<div className="crm-order-details__customer">
							<p className="crm-order-details__customer-name">
								{order.customer_name || "—"}
							</p>

							{order.email && (
								<a
									href={`mailto:${order.email}`}
									className="crm-order-details__contact"
								>
									<Mail size={18} />
									<span>{order.email}</span>
								</a>
							)}

							{order.phone && (
								<a
									href={`tel:${order.phone}`}
									className="crm-order-details__contact"
								>
									<Phone size={18} />
									<span>{order.phone}</span>
								</a>
							)}
						</div>
					</section>

					{/* SHIPPING */}
					<section className="crm-order-details__card">
						<div className="crm-order-details__card-header">
							<MapPin size={20} />

							<h2 className="crm-order-details__card-title">
								Shipping address
							</h2>
						</div>

						<address className="crm-order-details__address">
							{order.street && <span>{order.street}</span>}

							{order.apartment && <span>{order.apartment}</span>}

							<span>
								{[order.city, order.zip_code].filter(Boolean).join(", ")}
							</span>

							{order.country && <span>{order.country}</span>}
						</address>
					</section>

					{/* ITEMS */}
					<section className="crm-order-details__card">
						<div className="crm-order-details__card-header">
							<Package size={20} />

							<h2 className="crm-order-details__card-title">Order items</h2>
						</div>

						<div className="crm-order-details__items">
							{items.length > 0 ? (
								items.map((item, index) => {
									console.log("ORDER ITEM:", item);
									const itemName = getItemName(item);

									const image = getItemImage(item);

									const quantity = Number(item.quantity || 1);

									const price = Number(item.price || 0);

									return (
										<div
											key={item.sku || item.id || index}
											className="crm-order-details__item"
										>
											<div className="crm-order-details__item-info">
												{image ? (
													<img
														src={image}
														alt={itemName}
														className="crm-order-details__item-image"
													/>
												) : (
													<div className="crm-order-details__item-placeholder">
														<Package size={24} />
													</div>
												)}

												<div className="crm-order-details__item-text">
													<p className="crm-order-details__item-name">
														{itemName}
													</p>

													{item.sku && (
														<p className="crm-order-details__item-sku">
															SKU: {item.sku}
														</p>
													)}

													<p className="crm-order-details__item-quantity">
														Quantity: {quantity}
													</p>
												</div>
											</div>

											<div className="crm-order-details__item-price">
												{formatCurrency(
													price * quantity,
													order.currency || "EUR",
												)}
											</div>
										</div>
									);
								})
							) : (
								<p className="crm-order-details__empty">
									No order items found.
								</p>
							)}
						</div>
					</section>

					{/* GIFT POSTCARD */}
					<section className="crm-order-details__card">
						<div className="crm-order-details__card-header">
							<Gift size={20} />

							<h2 className="crm-order-details__card-title">Gift postcard</h2>
						</div>

						<div className="crm-order-details__gift">
							<div className="crm-order-details__field">
								<span className="crm-order-details__field-label">
									Postcard requested
								</span>

								<CrmFlagBadge variant={order.gift_postcard ? "yes" : "no"}>
									{order.gift_postcard ? "Yes" : "No"}
								</CrmFlagBadge>
							</div>

							{order.gift_postcard && order.gift_note && (
								<div className="crm-order-details__gift-note">
									<span className="crm-order-details__field-label">
										Gift note
									</span>

									<p>{order.gift_note}</p>
								</div>
							)}
						</div>
					</section>

					{/* CUSTOMER COMMENT */}
					{order.comment && (
						<section className="crm-order-details__card">
							<div className="crm-order-details__card-header">
								<h2 className="crm-order-details__card-title">
									Customer comment
								</h2>
							</div>

							<p className="crm-order-details__comment">{order.comment}</p>
						</section>
					)}
				</div>

				{/* SUMMARY */}
				<aside className="crm-order-details__sidebar">
					<section className="crm-order-details__card crm-order-details__summary">
						<h2 className="crm-order-details__card-title">Order summary</h2>

						<div className="crm-order-details__summary-row">
							<span>Subtotal</span>

							<strong>
								{formatCurrency(order.subtotal, order.currency || "EUR")}
							</strong>
						</div>

						<div className="crm-order-details__summary-row">
							<span>Discount</span>

							<strong>
								{formatCurrency(order.discount, order.currency || "EUR")}
							</strong>
						</div>

						<div className="crm-order-details__summary-total">
							<span>Total</span>

							<strong>
								{formatCurrency(order.total, order.currency || "EUR")}
							</strong>
						</div>
					</section>
				</aside>
			</div>
		</section>
	);
};

export default CrmOrderDetailsPage;

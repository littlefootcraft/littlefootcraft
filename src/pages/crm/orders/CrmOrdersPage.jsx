import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

// ICONS
import { ChevronDown, Eye, Search, ShoppingBag } from "lucide-react";

// COMPONENT
import { CrmFlagBadge } from "../../../components/crm/CrmFlagBadge";

// SUPABASE
import { supabase } from "../../../lib/supabaseClient";

const ORDER_STATUS_OPTIONS = [
	{ value: "all", label: "All order statuses" },
	{ value: "new", label: "New" },
	{ value: "confirmed", label: "Confirmed" },
	{ value: "preparing", label: "Preparing" },
	{ value: "shipped", label: "Shipped" },
	{ value: "completed", label: "Completed" },
	{ value: "cancelled", label: "Cancelled" },
];

const PAYMENT_STATUS_OPTIONS = [
	{ value: "all", label: "All payment statuses" },
	{ value: "not_requested", label: "Not requested" },
	{ value: "pending", label: "Pending" },
	{ value: "paid", label: "Paid" },
];

const SORT_OPTIONS = [
	{ value: "newest", label: "Newest first" },
	{ value: "oldest", label: "Oldest first" },
	{ value: "total-high", label: "Total: high to low" },
	{ value: "total-low", label: "Total: low to high" },
];

const formatStatus = (status) => {
	if (!status) return "—";

	return status
		.replaceAll("_", " ")
		.replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatDate = (date) => {
	if (!date) return "—";

	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(new Date(date));
};

const formatCurrency = (amount, currency = "EUR") => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	}).format(Number(amount || 0));
};

const getItemsCount = (items) => {
	if (!Array.isArray(items)) return 0;

	return items.reduce((total, item) => {
		return total + Number(item.quantity || 1);
	}, 0);
};

const CrmOrdersPage = () => {
	const [orders, setOrders] = useState([]);

	const [search, setSearch] = useState("");
	const [orderStatus, setOrderStatus] = useState("all");
	const [paymentStatus, setPaymentStatus] = useState("all");
	const [sort, setSort] = useState("newest");

	const [status, setStatus] = useState("loading");
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		const fetchOrders = async () => {
			setStatus("loading");
			setErrorMessage("");

			const { data, error } = await supabase
				.from("orders")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) {
				console.error("Error fetching orders:", error);

				setStatus("error");
				setErrorMessage("Unable to load orders.");
				return;
			}

			setOrders(data || []);
			setStatus("success");
		};

		fetchOrders();
	}, []);

	const filteredOrders = useMemo(() => {
		const normalizedSearch = search.trim().toLowerCase();

		const result = orders.filter((order) => {
			const matchesSearch =
				!normalizedSearch ||
				order.order_number?.toLowerCase().includes(normalizedSearch) ||
				order.customer_name?.toLowerCase().includes(normalizedSearch) ||
				order.email?.toLowerCase().includes(normalizedSearch);

			const matchesOrderStatus =
				orderStatus === "all" || order.status === orderStatus;

			const matchesPaymentStatus =
				paymentStatus === "all" || order.payment_status === paymentStatus;

			return matchesSearch && matchesOrderStatus && matchesPaymentStatus;
		});

		return [...result].sort((a, b) => {
			switch (sort) {
				case "oldest":
					return new Date(a.created_at) - new Date(b.created_at);

				case "total-high":
					return Number(b.total || 0) - Number(a.total || 0);

				case "total-low":
					return Number(a.total || 0) - Number(b.total || 0);

				case "newest":
				default:
					return new Date(b.created_at) - new Date(a.created_at);
			}
		});
	}, [orders, search, orderStatus, paymentStatus, sort]);

	return (
		<section className="crm-orders">
			<div className="crm-orders__header">
				<div>
					<h1 className="crm-orders__title">Orders</h1>

					<p className="crm-orders__subtitle">
						Review customer orders, payment status, and fulfillment.
					</p>
				</div>

				<div className="crm-orders__count">
					<ShoppingBag size={18} />

					<span>
						{filteredOrders.length}{" "}
						{filteredOrders.length === 1 ? "order" : "orders"}
					</span>
				</div>
			</div>

			<div className="crm-orders__toolbar">
				<div className="crm-orders__search">
					<Search
						className="crm-orders__search-icon"
						size={18}
					/>

					<input
						type="search"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search order, customer or email"
						aria-label="Search orders"
					/>
				</div>

				<div className="crm-orders__filters">
					<div className="crm-orders__select">
						<select
							value={orderStatus}
							onChange={(e) => setOrderStatus(e.target.value)}
							aria-label="Filter by order status"
						>
							{ORDER_STATUS_OPTIONS.map((option) => (
								<option
									key={option.value}
									value={option.value}
								>
									{option.label}
								</option>
							))}
						</select>

						<ChevronDown
							className="crm-orders__select-icon"
							size={16}
						/>
					</div>

					<div className="crm-orders__select">
						<select
							value={paymentStatus}
							onChange={(e) => setPaymentStatus(e.target.value)}
							aria-label="Filter by payment status"
						>
							{PAYMENT_STATUS_OPTIONS.map((option) => (
								<option
									key={option.value}
									value={option.value}
								>
									{option.label}
								</option>
							))}
						</select>

						<ChevronDown
							className="crm-orders__select-icon"
							size={16}
						/>
					</div>

					<div className="crm-orders__select">
						<select
							value={sort}
							onChange={(e) => setSort(e.target.value)}
							aria-label="Sort orders"
						>
							{SORT_OPTIONS.map((option) => (
								<option
									key={option.value}
									value={option.value}
								>
									{option.label}
								</option>
							))}
						</select>

						<ChevronDown
							className="crm-orders__select-icon"
							size={16}
						/>
					</div>
				</div>
			</div>

			{status === "loading" && (
				<div className="crm-orders__state">Loading orders...</div>
			)}

			{status === "error" && (
				<div className="crm-orders__state crm-orders__state--error">
					{errorMessage}
				</div>
			)}

			{status === "success" && (
				<div className="crm-orders__table-wrapper">
					<table className="crm-orders__table">
						<thead>
							<tr>
								<th>Order</th>
								<th>Customer</th>
								<th>Items</th>
								<th>Order status</th>
								<th>Gift postcard</th>
								<th>Payment</th>
								<th>Total</th>
								<th>Date</th>
								<th>
									<span className="sr-only">Actions</span>
								</th>
							</tr>
						</thead>

						<tbody>
							{filteredOrders.length > 0 ? (
								filteredOrders.map((order) => {
									const itemCount = getItemsCount(order.items);

									return (
										<tr key={order.id}>
											<td>
												<Link
													to={`/crm/orders/${order.id}`}
													className="crm-orders__order-number"
												>
													{order.order_number}
												</Link>
											</td>

											<td>
												<div className="crm-orders__customer">
													<span className="crm-orders__customer-name">
														{order.customer_name || "—"}
													</span>

													<span className="crm-orders__customer-email">
														{order.email}
													</span>
												</div>
											</td>

											<td>
												<span className="crm-orders__items-count">
													{itemCount}
												</span>
											</td>

											<td>
												<CrmFlagBadge variant={order.status}>
													{formatStatus(order.status)}
												</CrmFlagBadge>
											</td>

											<td>
												<CrmFlagBadge
													variant={order.gift_postcard ? "yes" : "no"}
												>
													{order.gift_postcard ? "Yes" : "No"}
												</CrmFlagBadge>
											</td>

											<td>
												<span
													className={`crm-orders__payment crm-orders__payment--${
														order.payment_status || "not_requested"
													}`}
												>
													{formatStatus(
														order.payment_status || "not_requested",
													)}
												</span>
											</td>

											<td>
												<span className="crm-orders__total">
													{formatCurrency(order.total, order.currency || "EUR")}
												</span>
											</td>

											<td>
												<span className="crm-orders__date">
													{formatDate(order.created_at)}
												</span>
											</td>

											<td>
												<Link
													to={`/crm/orders/${order.id}`}
													className="crm-orders__view-btn"
													aria-label={`View order ${order.order_number}`}
												>
													<Eye size={17} />
													<span>View</span>
												</Link>
											</td>
										</tr>
									);
								})
							) : (
								<tr>
									<td
										colSpan="9"
										className="crm-orders__empty"
									>
										No orders found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			)}
		</section>
	);
};

export default CrmOrdersPage;

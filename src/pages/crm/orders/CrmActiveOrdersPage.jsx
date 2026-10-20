import { useEffect, useMemo, useState } from "react";

// ICONS
import { ChevronDown, Search, ShoppingBag } from "lucide-react";

// COMPONENT

import { CrmOrdersTable } from "../../../components/crm/CrmOrdersTable";

// SUPABASE
import { supabase } from "../../../lib/supabaseClient";

const ORDER_STATUS_OPTIONS = [
	{ value: "all", label: "All active statuses" },
	{ value: "new", label: "New" },
	{ value: "confirmed", label: "Confirmed" },
	{ value: "preparing", label: "Preparing" },
	{ value: "shipped", label: "Shipped" },
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

const CrmActiveOrdersPage = () => {
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
				.in("status", ["new", "confirmed", "preparing", "shipped"])
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

	const paymentCounts = useMemo(() => {
		return {
			notRequested: orders.filter(
				(order) =>
					(order.payment_status || "not_requested") === "not_requested",
			).length,

			pending: orders.filter((order) => order.payment_status === "pending")
				.length,

			paid: orders.filter((order) => order.payment_status === "paid").length,
		};
	}, [orders]);

	return (
		<section className="crm-orders">
			<div className="crm-orders__header">
				<div>
					<h1 className="crm-orders__title">Active Orders</h1>

					<p className="crm-orders__subtitle">
						Review orders that still need payment or fulfillment.
					</p>
				</div>

				<div className="crm-orders__stats">
					<div className="crm-orders__count">
						<ShoppingBag size={18} />

						<span>
							{orders.length} {orders.length === 1 ? "order" : "orders"}
						</span>
					</div>

					<div className="crm-orders__payment-stat crm-orders__payment-stat--not-requested">
						<span>Not requested</span>
						<strong>{paymentCounts.notRequested}</strong>
					</div>

					<div className="crm-orders__payment-stat crm-orders__payment-stat--pending">
						<span>Pending</span>
						<strong>{paymentCounts.pending}</strong>
					</div>

					<div className="crm-orders__payment-stat crm-orders__payment-stat--paid">
						<span>Paid</span>
						<strong>{paymentCounts.paid}</strong>
					</div>
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

			{status === "success" && <CrmOrdersTable orders={filteredOrders} />}
		</section>
	);
};

export default CrmActiveOrdersPage;

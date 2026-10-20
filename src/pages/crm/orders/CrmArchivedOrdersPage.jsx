import { useEffect, useMemo, useState } from "react";

// ICONS
import { Archive, ChevronDown, Search } from "lucide-react";

// COMPONENT
import { CrmOrdersTable } from "../../../components/crm/CrmOrdersTable";

// SUPABASE
import { supabase } from "../../../lib/supabaseClient";

const ORDER_STATUS_OPTIONS = [
	{ value: "all", label: "All archived statuses" },
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

const CrmArchivedOrdersPage = () => {
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
				.not("archived_at", "is", null)
				.order("archived_at", { ascending: false });

			if (error) {
				console.error("Error fetching archived orders:", error);

				setStatus("error");
				setErrorMessage("Unable to load archived orders.");
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
					<h1 className="crm-orders__title">Archived Orders</h1>

					<p className="crm-orders__subtitle">
						Review older completed or cancelled orders kept for records.
					</p>
				</div>

				<div className="crm-orders__stats">
					<div className="crm-orders__count">
						<Archive size={18} />

						<span>
							{orders.length} {orders.length === 1 ? "order" : "orders"}
						</span>
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
						aria-label="Search archived orders"
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
							aria-label="Sort archived orders"
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
				<div className="crm-orders__state">Loading archived orders...</div>
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

export default CrmArchivedOrdersPage;

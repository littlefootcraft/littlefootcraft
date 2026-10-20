import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

import { CrmFlagBadge } from "./CrmFlagBadge";

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

export const CrmOrdersTable = ({ orders }) => {
	return (
		<table className="crm-orders-table__table">
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
				{orders.length > 0 ? (
					orders.map((order) => {
						const itemCount = getItemsCount(order.items);

						return (
							<tr key={order.id}>
								<td>
									<Link
										to={`/crm/orders/${order.id}`}
										className="crm-orders-table__order-number"
									>
										{order.order_number}
									</Link>
								</td>

								<td>
									<div className="crm-orders-table__customer">
										<span className="crm-orders-table__customer-name">
											{order.customer_name || "—"}
										</span>

										<span className="crm-orders-table__customer-email">
											{order.email}
										</span>
									</div>
								</td>

								<td>
									<span className="crm-orders-table__items-count">
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
										className={`crm-orders-table__gift crm-orders-table__gift--${
											order.gift_postcard ? "yes" : "no"
										}`}
									>
										{order.gift_postcard ? "Yes" : "No"}
									</CrmFlagBadge>
								</td>

								<td>
									<span
										className={`crm-orders-table__payment crm-orders__payment--${
											order.payment_status || "not_requested"
										}`}
									>
										{formatStatus(order.payment_status || "not_requested")}
									</span>
								</td>

								<td>
									<span className="crm-orders-table__total">
										{formatCurrency(order.total, order.currency || "EUR")}
									</span>
								</td>

								<td>
									<span className="crm-orders-table__date">
										{formatDate(order.created_at)}
									</span>
								</td>

								<td>
									<Link
										to={`/crm/orders/${order.id}`}
										className="crm-orders-table__view-btn"
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
	);
};

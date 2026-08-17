import { Search } from "lucide-react";

const CrmSubscribersPage = () => {
	return (
		<section className="crm-page crm-subscribers">
			<div className="crm-page__header">
				<div>
					<p className="crm-page__eyebrow">Newsletter</p>

					<h1 className="crm-page__title">Subscribers</h1>

					<p className="crm-page__description">
						View newsletter subscribers and their interests.
					</p>
				</div>
			</div>

			<div className="crm-subscribers__toolbar">
				<div className="crm-subscribers__search">
					<Search size={18} />

					<input
						type="search"
						placeholder="Search by email..."
					/>
				</div>

				<select defaultValue="all">
					<option value="all">All languages</option>
					<option value="en">English</option>
					<option value="ua">Ukrainian</option>
				</select>

				<select defaultValue="all">
					<option value="all">All interests</option>
					<option value="workshops">Workshops</option>
					<option value="sales">Sales</option>
				</select>
			</div>

			<div className="crm-subscribers__table-wrapper">
				<table className="crm-subscribers__table">
					<thead>
						<tr>
							<th>Email</th>
							<th>Language</th>
							<th>Interests</th>
							<th>Joined</th>
						</tr>
					</thead>

					<tbody>
						<tr>
							<td colSpan="4">
								<div className="crm-subscribers__empty">
									Subscriber data will appear here.
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>
	);
};

export default CrmSubscribersPage;

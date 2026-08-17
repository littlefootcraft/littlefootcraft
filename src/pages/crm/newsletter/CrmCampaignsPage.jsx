import { Link } from "react-router-dom";
import { MailPlus } from "lucide-react";

const CrmCampaignsPage = () => {
	return (
		<section className="crm-page crm-campaigns">
			<div className="crm-page__header">
				<div>
					<p className="crm-page__eyebrow">Newsletter</p>

					<h1 className="crm-page__title">Campaigns</h1>

					<p className="crm-page__description">
						View newsletter drafts and previously sent campaigns.
					</p>
				</div>

				<Link
					to="/crm/newsletter/new"
					className="crm-campaigns__create-btn"
				>
					<MailPlus size={18} />

					<span>Create Newsletter</span>
				</Link>
			</div>

			<div className="crm-campaigns__table-wrapper">
				<table className="crm-campaigns__table">
					<thead>
						<tr>
							<th>Campaign</th>
							<th>Status</th>
							<th>Audience</th>
							<th>Created</th>
							<th>Sent</th>
						</tr>
					</thead>

					<tbody>
						<tr>
							<td colSpan="5">
								<div className="crm-campaigns__empty">No campaigns yet.</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>
	);
};

export default CrmCampaignsPage;

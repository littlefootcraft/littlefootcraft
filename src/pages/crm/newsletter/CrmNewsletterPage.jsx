import { Link } from "react-router-dom";
import { MailPlus, Users, Send } from "lucide-react";

const CrmNewsletterPage = () => {
	return (
		<section className="crm-page crm-newsletter">
			<div className="crm-page__header">
				<div>
					<p className="crm-page__eyebrow">Newsletter</p>

					<h1 className="crm-page__title">Newsletter</h1>

					<p className="crm-page__description">
						Manage subscribers, create newsletters and review previous
						campaigns.
					</p>
				</div>

				<Link
					to="/crm/newsletter/new"
					className="crm-newsletter__create-btn"
				>
					<MailPlus size={18} />

					<span>Create Newsletter</span>
				</Link>
			</div>

			<div className="crm-newsletter__overview">
				<div className="crm-newsletter__card">
					<div className="crm-newsletter__card-icon">
						<Users size={22} />
					</div>

					<div>
						<p className="crm-newsletter__card-label">Subscribers</p>

						<p className="crm-newsletter__card-value">—</p>

						<Link
							to="/crm/newsletter/subscribers"
							className="crm-newsletter__card-link"
						>
							View subscribers
						</Link>
					</div>
				</div>

				<div className="crm-newsletter__card">
					<div className="crm-newsletter__card-icon">
						<Send size={22} />
					</div>

					<div>
						<p className="crm-newsletter__card-label">Campaigns</p>

						<p className="crm-newsletter__card-value">—</p>

						<Link
							to="/crm/newsletter/campaigns"
							className="crm-newsletter__card-link"
						>
							View campaigns
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
};

export default CrmNewsletterPage;

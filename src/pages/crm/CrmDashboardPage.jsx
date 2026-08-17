// src/pages/crm/CrmDashboardPage.jsx

const CrmDashboardPage = () => {
	return (
		<section className="crm-page">
			<div className="crm-page__header">
				<div>
					<p className="crm-page__eyebrow">Overview</p>
					<h1 className="crm-page__title">Dashboard</h1>
					<p className="crm-page__description">
						Welcome to the LittleFootCraft CRM.
					</p>
				</div>
			</div>

			<div className="crm-dashboard">
				<div className="crm-dashboard__card">
					<p className="crm-dashboard__card-label">Newsletter</p>

					<h2 className="crm-dashboard__card-title">
						Manage subscribers and campaigns
					</h2>

					<p className="crm-dashboard__card-text">
						Create newsletters, select recipients and review previous campaigns.
					</p>
				</div>
			</div>
		</section>
	);
};

export default CrmDashboardPage;

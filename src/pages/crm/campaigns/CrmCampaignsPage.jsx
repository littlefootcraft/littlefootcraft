import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, MailPlus, Trash2 } from "lucide-react";

// SUPABASE
import { supabase } from "../../../lib/supabaseClient";
import { CrmDeleteModal } from "../../../components/crm/CrmDeleteModal";

const CrmCampaignsPage = () => {
	const [campaigns, setCampaigns] = useState([]);
	const [openCampaigns, setOpenCampaigns] = useState([]);
	const [status, setStatus] = useState("loading");
	const [errorMessage, setErrorMessage] = useState("");
	const [campaignToDelete, setCampaignToDelete] = useState(null);
	const [deleteStatus, setDeleteStatus] = useState("idle");

	useEffect(() => {
		const loadCampaigns = async () => {
			try {
				setStatus("loading");
				setErrorMessage("");

				const { data, error } = await supabase
					.from("newsletter_campaigns")
					.select(
						`
						id,
						campaign_name,
						created_at,
						newsletter_sends (
							id,
							type,
							status,
							audience,
							total_recipients,
							successful,
							failed,
							sent_at
						)
					`,
					)
					.order("created_at", {
						ascending: false,
					});

				if (error) {
					throw error;
				}

				const preparedCampaigns = (data ?? []).map((campaign) => {
					const sends = [...(campaign.newsletter_sends ?? [])].sort(
						(a, b) =>
							new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime(),
					);

					return {
						...campaign,
						sends,
						lastSentAt: sends[0]?.sent_at ?? null,
					};
				});

				setCampaigns(preparedCampaigns);
				setStatus("success");
			} catch (error) {
				console.error("Failed to load campaigns:", error);

				setStatus("error");
				setErrorMessage("Campaigns could not be loaded.");
			}
		};

		loadCampaigns();
	}, []);

	const toggleCampaign = (campaignId) => {
		setOpenCampaigns((current) =>
			current.includes(campaignId)
				? current.filter((id) => id !== campaignId)
				: [...current, campaignId],
		);
	};

	const handleDeleteCampaignClick = (campaign) => {
		setCampaignToDelete(campaign);
		setDeleteStatus("idle");
	};

	const handleConfirmDelete = async () => {
		if (!campaignToDelete) return;

		try {
			setDeleteStatus("loading");

			const { error } = await supabase
				.from("newsletter_campaigns")
				.delete()
				.eq("id", campaignToDelete.id)
				.select("id");

			if (error) {
				throw error;
			}

			setCampaigns((current) =>
				current.filter((campaign) => campaign.id !== campaignToDelete.id),
			);

			setOpenCampaigns((current) =>
				current.filter((id) => id !== campaignToDelete.id),
			);

			setCampaignToDelete(null);
			setDeleteStatus("idle");
		} catch (error) {
			console.error("Failed to delete campaign:", error);
			setDeleteStatus("error");
		}
	};

	const formatDate = (date) => {
		if (!date) return "—";

		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		}).format(new Date(date));
	};

	const audienceLabel = (audience) => {
		const labels = {
			all: "All subscribers",
			interest: "By interest",
			other: "Other recipients",
		};

		return labels[audience] ?? audience;
	};

	const typeLabel = (type) => {
		const labels = {
			"new-items": "New items",
			sale: "Sale",
			"new-workshop": "Workshop",
			"workshop-reminder": "Workshop reminder",
			other: "Other",
		};

		return labels[type] ?? type;
	};

	const handleDeleteCampaign = async (campaignId, campaignName) => {
		const confirmed = window.confirm(
			`Delete "${campaignName}"?\n\nThis will permanently delete the campaign and all of its newsletter send history.`,
		);

		if (!confirmed) return;

		const { error } = await supabase
			.from("newsletter_campaigns")
			.delete()
			.eq("id", campaignId);

		if (error) {
			console.error("Failed to delete campaign:", error);
			return;
		}

		setCampaigns((current) =>
			current.filter((campaign) => campaign.id !== campaignId),
		);
	};

	return (
		<section className="crm-page crm-campaigns">
			<div className="crm-page__header">
				<div>
					<p className="crm-page__eyebrow">Newsletter</p>

					<h1 className="crm-page__title">Campaigns</h1>

					<p className="crm-page__description">
						View newsletter campaigns and their send history.
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
							<th>Sends</th>
							<th>Created</th>
							<th>Last sent</th>
							<th>Delete</th>
						</tr>
					</thead>

					<tbody>
						{status === "loading" && (
							<tr>
								<td colSpan="5">
									<div className="crm-campaigns__empty">
										Loading campaigns...
									</div>
								</td>
							</tr>
						)}

						{status === "error" && (
							<tr>
								<td colSpan="5">
									<div className="crm-campaigns__error">{errorMessage}</div>
								</td>
							</tr>
						)}

						{status === "success" && campaigns.length === 0 && (
							<tr>
								<td colSpan="5">
									<div className="crm-campaigns__empty">No campaigns yet.</div>
								</td>
							</tr>
						)}

						{status === "success" &&
							campaigns.map((campaign) => {
								const isOpen = openCampaigns.includes(campaign.id);

								return (
									<Fragment key={campaign.id}>
										<tr className="crm-campaigns__campaign-row">
											<td>
												<button
													type="button"
													className="crm-campaigns__expand-btn"
													onClick={() => toggleCampaign(campaign.id)}
													aria-expanded={isOpen}
												>
													{isOpen ? (
														<ChevronDown size={16} />
													) : (
														<ChevronRight size={16} />
													)}

													<span>{campaign.campaign_name}</span>
												</button>
											</td>

											<td>{campaign.sends.length}</td>

											<td>{formatDate(campaign.created_at)}</td>

											<td>{formatDate(campaign.lastSentAt)}</td>
											<td className="crm-campaigns__delete-cell">
												<button
													type="button"
													className="crm-campaigns__delete-btn"
													onClick={() => handleDeleteCampaignClick(campaign)}
													aria-label={`Delete ${campaign.campaign_name}`}
													title="Delete campaign"
												>
													<Trash2 size={17} />
												</button>
											</td>
										</tr>

										{isOpen && (
											<tr className="crm-campaigns__send-container">
												<td colSpan="5">
													{campaign.sends.length === 0 ? (
														<div className="crm-campaigns__no-sends">
															No newsletter sends yet.
														</div>
													) : (
														<table className="crm-campaigns__send-table">
															<thead>
																<tr>
																	<th>Type</th>
																	<th>Status</th>
																	<th>Audience</th>
																	<th>Recipients</th>
																	<th>Sent</th>
																	<th>Details</th>
																</tr>
															</thead>

															<tbody>
																{campaign.sends.map((send) => (
																	<tr key={send.id}>
																		<td>{typeLabel(send.type)}</td>

																		<td>
																			<span
																				className={`crm-campaigns__status crm-campaigns__status--${send.status}`}
																			>
																				{send.status}
																			</span>
																		</td>

																		<td>{audienceLabel(send.audience)}</td>

																		<td>{send.total_recipients}</td>

																		<td>{formatDate(send.sent_at)}</td>

																		<td>
																			<Link
																				to={`/crm/newsletter/sends/${send.id}`}
																				className="crm-campaigns__details-link"
																			>
																				View details
																			</Link>
																		</td>
																	</tr>
																))}
															</tbody>
														</table>
													)}
												</td>
											</tr>
										)}
									</Fragment>
								);
							})}
					</tbody>
				</table>
			</div>
			{campaignToDelete && (
				<CrmDeleteModal
					title="Delete campaign?"
					itemName={campaignToDelete.campaign_name}
					message="This will permanently delete the campaign and all of its newsletter send history."
					errorMessage="The campaign could not be deleted. Please try again."
					confirmText="Delete campaign"
					deleteStatus={deleteStatus}
					onClose={() => {
						setCampaignToDelete(null);
						setDeleteStatus("idle");
					}}
					onConfirm={handleConfirmDelete}
				/>
			)}
		</section>
	);
};

export default CrmCampaignsPage;

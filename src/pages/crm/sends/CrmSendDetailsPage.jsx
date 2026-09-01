import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

// ICONS
import { ChevronRight, MailPlus } from "lucide-react";
import { useWorkshops } from "../../../context/WorkshopsContext";

// SUPABASE
import { supabase } from "../../../lib/supabaseClient";

// CONTEXTS
import { useProducts } from "../../../context/ProductsContext";

const CrmSendDetailsPage = () => {
	const { sendId } = useParams();
	const workshops = useWorkshops();
	const products = useProducts();

	const [send, setSend] = useState(null);
	const [status, setStatus] = useState("loading");
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		const loadSend = async () => {
			try {
				setStatus("loading");
				setErrorMessage("");

				const { data, error } = await supabase
					.from("newsletter_sends")
					.select(
						`
					*,
					newsletter_campaigns (
						id,
						campaign_name
					)
				`,
					)
					.eq("id", sendId)
					.single();

				if (error) {
					throw error;
				}

				setSend(data);
				setStatus("success");
			} catch (error) {
				console.error("Failed to load newsletter send:", error);

				setStatus("error");
				setErrorMessage("Newsletter send could not be loaded.");
			}
		};

		loadSend();
	}, [sendId]);

	if (status === "loading") {
		return (
			<section className="crm-page crm-send-details">
				<p>Loading newsletter...</p>
			</section>
		);
	}

	if (status === "error" || !send) {
		return (
			<section className="crm-page crm-send-details">
				<p className="crm-send-details__error">
					{errorMessage || "Newsletter send not found."}
				</p>

				<Link to="/crm/newsletter/campaigns">Back to campaigns</Link>
			</section>
		);
	}

	const campaignName = send.newsletter_campaigns?.campaign_name ?? "Campaign";

	const formattedSentAt = send.sent_at
		? new Intl.DateTimeFormat("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
				hour: "numeric",
				minute: "2-digit",
			}).format(new Date(send.sent_at))
		: "—";

	const typeLabel =
		{
			"new-items": "New items",
			sale: "Sale",
			"new-workshop": "Workshop",
			"workshop-reminder": "Workshop reminder",
			other: "Other",
		}[send.type] ?? send.type;

	const audienceLabel =
		{
			all: "All subscribers",
			interest: "By interest",
			other: "Other recipients",
		}[send.audience] ?? send.audience;

	// WORKSHOP
	const selectedWorkshop = send.item_id
		? workshops.find((workshop) => workshop.id === send.item_id)
		: null;

	// DELIVERY RESULTS BY LANGUAGE
	const englishResults =
		send.results?.filter((result) => result.language === "en") ?? [];

	const ukrainianResults =
		send.results?.filter((result) => result.language === "ua") ?? [];

	const englishSuccessful = englishResults.filter(
		(result) => result.success,
	).length;

	const englishFailed = englishResults.length - englishSuccessful;

	const ukrainianSuccessful = ukrainianResults.filter(
		(result) => result.success,
	).length;

	const ukrainianFailed = ukrainianResults.length - ukrainianSuccessful;

	const englishRecipients =
		send.results?.filter((result) => result.language === "en") ?? [];

	const ukrainianRecipients =
		send.results?.filter((result) => result.language === "ua") ?? [];

	return (
		<section className="crm-page crm-send-details">
			<nav
				className="crm-breadcrumbs"
				aria-label="Breadcrumb"
			>
				<Link
					to="/crm/newsletter"
					className="crm-breadcrumbs__link"
				>
					Newsletter
				</Link>

				<ChevronRight
					size={14}
					className="crm-breadcrumbs__separator"
				/>

				<Link
					to="/crm/newsletter/campaigns"
					className="crm-breadcrumbs__link"
				>
					Campaigns
				</Link>

				<ChevronRight
					size={14}
					className="crm-breadcrumbs__separator"
				/>

				<span className="crm-breadcrumbs__current">
					{campaignName} — {typeLabel}
				</span>
			</nav>

			<div className="crm-page__header">
				<div>
					<p className="crm-page__eyebrow">{campaignName}</p>

					<h1 className="crm-page__title">{typeLabel}</h1>

					<p className="crm-page__description">
						Newsletter send details and delivery status.
					</p>
				</div>

				<Link
					to="/crm/newsletter/new"
					className="crm-send-details__create-btn"
				>
					<MailPlus size={18} />
					<span>Create Newsletter</span>
				</Link>
			</div>

			<div className="crm-send-details__status-card">
				<div>
					<span>Status</span>

					<strong
						className={`crm-send-details__status crm-send-details__status--${send.status}`}
					>
						{send.status}
					</strong>
				</div>

				<div>
					<span>Type</span>
					<strong>{typeLabel}</strong>
				</div>

				<div>
					<span>Audience</span>
					<strong>{audienceLabel}</strong>
				</div>

				<div>
					<span>Sent</span>
					<strong>{formattedSentAt}</strong>
				</div>
			</div>

			<div className="crm-send-details__stats">
				<div className="crm-send-details__stat">
					<span>Total recipients</span>
					<strong>{send.total_recipients}</strong>
				</div>

				<div className="crm-send-details__stat">
					<span>Successful</span>
					<strong>{send.successful}</strong>
				</div>

				<div className="crm-send-details__stat">
					<span>Failed</span>
					<strong>{send.failed}</strong>
				</div>
			</div>

			{send.skus?.length > 0 && (
				<section className="crm-send-details__section">
					<h2>Products</h2>

					<div className="crm-send-details__products">
						{send.skus.map((sku) => {
							const product = products.find((product) => product.sku === sku);

							return (
								<div
									key={sku}
									className="crm-send-details__product"
								>
									{product ? (
										<>
											{product.photo?.[0]?.src && (
												<img
													src={product.photo[0].src}
													alt={
														product.photo[0].alt?.en ?? product.name?.en ?? sku
													}
													className="crm-send-details__product-image"
												/>
											)}

											<div className="crm-send-details__product-info">
												<strong>{product.name?.en ?? "Unnamed product"}</strong>

												<span>{sku}</span>
											</div>
										</>
									) : (
										<div className="crm-send-details__product-info">
											<strong>Product not found</strong>
											<span>{sku}</span>
										</div>
									)}
								</div>
							);
						})}
					</div>
				</section>
			)}

			{send.item_id && (
				<section className="crm-send-details__section">
					<h2>Workshop</h2>

					<p>{selectedWorkshop?.title?.en ?? send.item_id}</p>
				</section>
			)}

			<section className="crm-send-details__section">
				<h2>English</h2>

				{englishResults.length === 0 ? (
					<p className="crm-send-details__not-sent">
						Not sent — no English recipients.
					</p>
				) : (
					<>
						<div className="crm-send-details__language-stats">
							<span>
								{englishResults.length}{" "}
								{englishResults.length === 1 ? "recipient" : "recipients"}
							</span>

							<span className="crm-send-details__language-stat--success">
								{englishSuccessful} sent
							</span>

							<span className="crm-send-details__language-stat--failed">
								{englishFailed} failed
							</span>
						</div>

						<div className="crm-send-details__content-grid">
							<div>
								<span>Subject</span>
								<p>{send.subject_en}</p>
							</div>

							<div>
								<span>Title</span>
								<p>{send.title_en}</p>
							</div>

							<div>
								<span>Content</span>
								<p>{send.content_en}</p>
							</div>
						</div>
					</>
				)}

				{englishRecipients.length > 0 && (
					<div className="crm-send-details__recipients">
						<p className="crm-send-details__recipients-title">Recipients</p>

						{englishRecipients.map((result) => (
							<div
								key={result.email}
								className="crm-send-details__recipient"
							>
								<span>{result.email}</span>

								<span
									className={`crm-send-details__recipient-status crm-send-details__recipient-status--${
										result.success ? "sent" : "failed"
									}`}
								>
									{result.success ? "Sent" : "Failed"}
								</span>
							</div>
						))}
					</div>
				)}
			</section>

			<section className="crm-send-details__section">
				<h2>Ukrainian</h2>

				{ukrainianResults.length === 0 ? (
					<p className="crm-send-details__not-sent">
						Not sent — no Ukrainian recipients.
					</p>
				) : (
					<>
						<div className="crm-send-details__language-stats">
							<span>
								{ukrainianResults.length}{" "}
								{ukrainianResults.length === 1 ? "recipient" : "recipients"}
							</span>

							<span className="crm-send-details__language-stat--success">
								{ukrainianSuccessful} sent
							</span>

							<span className="crm-send-details__language-stat--failed">
								{ukrainianFailed} failed
							</span>
						</div>

						<div className="crm-send-details__content-grid">
							<div>
								<span>Subject</span>
								<p>{send.subject_ua}</p>
							</div>

							<div>
								<span>Title</span>
								<p>{send.title_ua}</p>
							</div>

							<div>
								<span>Content</span>
								<p>{send.content_ua}</p>
							</div>
						</div>
					</>
				)}

				{ukrainianRecipients.length > 0 && (
					<div className="crm-send-details__recipients">
						<p className="crm-send-details__recipients-title">Recipients</p>

						{ukrainianRecipients.map((result) => (
							<div
								key={result.email}
								className="crm-send-details__recipient"
							>
								<span>{result.email}</span>

								<span
									className={`crm-send-details__recipient-status crm-send-details__recipient-status--${
										result.success ? "sent" : "failed"
									}`}
								>
									{result.success ? "Sent" : "Failed"}
								</span>
							</div>
						))}
					</div>
				)}
			</section>
		</section>
	);
};

export default CrmSendDetailsPage;

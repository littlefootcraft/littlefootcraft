import { useState } from "react";
import { Link } from "react-router-dom";

// ICONS
import { ChevronRight, Send, MailCheck } from "lucide-react";

// CONTEXTS
import { useWorkshops } from "../../../context/WorkshopsContext";

// COMPONENTS
import { CrmSendModal } from "../../../components/crm/CrmSendModal";

// SUPABASE
import { supabase } from "../../../lib/supabaseClient";

const CrmNewNewsletterPage = () => {
	const workshops = useWorkshops();

	const [audience, setAudience] = useState("all");
	const [interests, setInterests] = useState([]);
	const [contentType, setContentType] = useState("other");
	const [skuInput, setSkuInput] = useState("");
	const [selectedWorkshops, setSelectedWorkshops] = useState([]);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	const [campaignName, setCampaignName] = useState("");

	const [subjectEN, setSubjectEN] = useState("");
	const [contentEN, setContentEN] = useState("");

	const [subjectUA, setSubjectUA] = useState("");
	const [contentUA, setContentUA] = useState("");

	const [otherRecipients, setOtherRecipients] = useState("");

	const toggleInterest = (interest) => {
		setInterests((current) =>
			current.includes(interest)
				? current.filter((item) => item !== interest)
				: [...current, interest],
		);
	};

	const toggleWorkshop = (workshopId) => {
		setSelectedWorkshops((current) =>
			current.includes(workshopId)
				? current.filter((id) => id !== workshopId)
				: [...current, workshopId],
		);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		setIsConfirmOpen(true);
	};

	// const handleConfirmSend = async () => {
	// 	try {
	// 		const payload = {
	// 			campaignName,

	// 			contentType,
	// 			skuInput,
	// 			selectedWorkshops,

	// 			subjectEN,
	// 			contentEN,

	// 			subjectUA,
	// 			contentUA,

	// 			audience,
	// 			interests,

	// 			otherRecipients,
	// 		};

	// 		console.log("Newsletter payload:", payload);

	// 		const { data, error } = await supabase.functions.invoke(
	// 			"send-newsletter",
	// 			{
	// 				body: payload,
	// 			},
	// 		);

	// 		if (error) {
	// 			console.error("Newsletter sending error:", error);
	// 			return;
	// 		}

	// 		console.log("Newsletter sent successfully:", data);

	// 		setIsConfirmOpen(false);
	// 	} catch (error) {
	// 		console.error("Unexpected newsletter error:", error);
	// 	}
	// };
	const handleConfirmSend = async () => {
		try {
			const skus = skuInput
				.split(",")
				.map((sku) => sku.trim())
				.filter(Boolean);

			const recipientEmails = otherRecipients
				.split(",")
				.map((email) => email.trim().toLowerCase())
				.filter(Boolean);

			const type =
				contentType === "master-classes" ? "new-master-class" : contentType;

			const payload = {
				type,
				skus,

				itemId: contentType === "master-classes" ? selectedWorkshops[0] : null,

				audience,
				interests,
				otherRecipients: recipientEmails,

				subjectEN,
				contentEN,
				subjectUA,
				contentUA,
			};

			console.log("Sending newsletter:", payload);

			const { data, error } = await supabase.functions.invoke(
				"send-newsletter",
				{
					body: payload,
				},
			);

			if (error) {
				console.error("Newsletter function error:", error);
				return;
			}

			console.log("Newsletter result:", data);

			setIsConfirmOpen(false);
		} catch (error) {
			console.error("Newsletter sending failed:", error);
		}
	};

	return (
		<section className="crm-page crm-new-newsletter">
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

				<span className="crm-breadcrumbs__current">Create Newsletter</span>
			</nav>
			<div className="crm-page__header">
				<div>
					<p className="crm-page__eyebrow">Newsletter</p>

					<h1 className="crm-page__title">Create Newsletter</h1>

					<p className="crm-page__description">
						Create a newsletter, choose recipients and send a test before
						sending the campaign.
					</p>
				</div>
			</div>

			<form
				className="crm-new-newsletter__form"
				onSubmit={handleSubmit}
			>
				<section className="crm-new-newsletter__section">
					<h2 className="crm-new-newsletter__section-title">Campaign</h2>

					<label className="crm-new-newsletter__field">
						<span>Campaign name</span>

						<input
							type="text"
							placeholder="August Workshop"
							value={campaignName}
							onChange={(e) => setCampaignName(e.target.value)}
						/>
					</label>
				</section>

				<section className="crm-new-newsletter__section">
					<h2 className="crm-new-newsletter__section-title">
						Newsletter content
					</h2>

					<p className="crm-new-newsletter__section-description">
						Choose what you want to feature in this newsletter.
					</p>

					{/* NEW ITEMS */}
					<label className="crm-new-newsletter__radio">
						<input
							type="radio"
							name="contentType"
							value="new-items"
							checked={contentType === "new-items"}
							onChange={(e) => setContentType(e.target.value)}
						/>

						<span>New items</span>
					</label>

					{contentType === "new-items" && (
						<div className="crm-new-newsletter__content-details">
							<label className="crm-new-newsletter__field">
								<span>Product SKU numbers</span>

								<textarea
									rows="3"
									value={skuInput}
									onChange={(e) => setSkuInput(e.target.value)}
									placeholder="BR-20260801-0001, BR-20260805-0002"
								/>
							</label>

							<p className="crm-new-newsletter__hint">
								Enter SKU numbers separated by commas.
							</p>
						</div>
					)}

					{/* MASTER CLASSES */}
					<label className="crm-new-newsletter__radio">
						<input
							type="radio"
							name="contentType"
							value="master-classes"
							checked={contentType === "master-classes"}
							onChange={(e) => setContentType(e.target.value)}
						/>

						<span>Master classes</span>
					</label>

					{contentType === "master-classes" && (
						<div className="crm-new-newsletter__content-details">
							<p className="crm-new-newsletter__field-label">
								Select master classes
							</p>

							<div className="crm-new-newsletter__workshops">
								{workshops.map((workshop) => (
									<label
										key={workshop.id}
										className="crm-new-newsletter__workshop"
									>
										<input
											type="checkbox"
											checked={selectedWorkshops.includes(workshop.id)}
											onChange={() => toggleWorkshop(workshop.id)}
										/>

										<span>{workshop.title.en}</span>
									</label>
								))}
							</div>
						</div>
					)}

					{/* OTHER */}
					<label className="crm-new-newsletter__radio">
						<input
							type="radio"
							name="contentType"
							value="other"
							checked={contentType === "other"}
							onChange={(e) => setContentType(e.target.value)}
						/>

						<span>Other</span>
					</label>
				</section>

				<section className="crm-new-newsletter__section">
					<h2 className="crm-new-newsletter__section-title">English</h2>

					<label className="crm-new-newsletter__field">
						<span>Subject</span>

						<input
							type="text"
							placeholder="Newsletter subject"
							value={subjectEN}
							onChange={(e) => setSubjectEN(e.target.value)}
						/>
					</label>

					<label className="crm-new-newsletter__field">
						<span>Content</span>

						<textarea
							rows="10"
							placeholder="Write the English newsletter..."
							value={contentEN}
							onChange={(e) => setContentEN(e.target.value)}
						/>
					</label>
				</section>

				<section className="crm-new-newsletter__section">
					<h2 className="crm-new-newsletter__section-title">Ukrainian</h2>

					<label className="crm-new-newsletter__field">
						<span>Subject</span>

						<input
							type="text"
							placeholder="Тема листа"
							value={subjectUA}
							onChange={(e) => setSubjectUA(e.target.value)}
						/>
					</label>

					<label className="crm-new-newsletter__field">
						<span>Content</span>

						<textarea
							rows="10"
							placeholder="Напишіть українську версію листа..."
							value={contentUA}
							onChange={(e) => setContentUA(e.target.value)}
						/>
					</label>
				</section>

				<section className="crm-new-newsletter__section">
					<h2 className="crm-new-newsletter__section-title">Audience</h2>

					{/* ALL SUBSCRIBERS */}
					<label className="crm-new-newsletter__radio">
						<input
							type="radio"
							name="audience"
							value="all"
							checked={audience === "all"}
							onChange={(e) => setAudience(e.target.value)}
						/>

						<span>All subscribers</span>
					</label>

					{/* BY INTEREST */}
					<label className="crm-new-newsletter__radio">
						<input
							type="radio"
							name="audience"
							value="interest"
							checked={audience === "interest"}
							onChange={(e) => setAudience(e.target.value)}
						/>

						<span>By interest</span>
					</label>

					{audience === "interest" && (
						<div className="crm-new-newsletter__interests">
							<label>
								<input
									type="checkbox"
									checked={interests.includes("workshops")}
									onChange={() => toggleInterest("workshops")}
								/>

								<span>Workshops</span>
							</label>

							<label>
								<input
									type="checkbox"
									checked={interests.includes("sales")}
									onChange={() => toggleInterest("sales")}
								/>

								<span>Sales</span>
							</label>
						</div>
					)}

					{/* OTHER RECIPIENTS */}
					<label className="crm-new-newsletter__radio">
						<input
							type="radio"
							name="audience"
							value="other"
							checked={audience === "other"}
							onChange={(e) => setAudience(e.target.value)}
						/>

						<span>Other recipients</span>
					</label>

					{audience === "other" && (
						<div className="crm-new-newsletter__other-recipients">
							<p className="crm-new-newsletter__hint">
								Enter email addresses that are not in the subscriber list. These
								recipients will receive this newsletter only and will not be
								added as subscribers.
							</p>

							<label className="crm-new-newsletter__field">
								<span>Email addresses</span>

								<textarea
									rows="4"
									placeholder="friend@example.com, another@example.com"
									value={otherRecipients}
									onChange={(e) => setOtherRecipients(e.target.value)}
								/>
							</label>
						</div>
					)}
				</section>

				<div className="crm-new-newsletter__actions">
					<button
						type="button"
						className="crm-new-newsletter__test-btn"
					>
						<MailCheck size={18} />
						Send Test
					</button>

					<button
						type="submit"
						className="crm-new-newsletter__send-btn"
					>
						<Send size={18} />
						Send Newsletter
					</button>
				</div>
			</form>
			{isConfirmOpen && (
				<CrmSendModal
					audience={audience}
					interests={interests}
					onClose={() => setIsConfirmOpen(false)}
					onConfirm={handleConfirmSend}
				/>
			)}
		</section>
	);
};

export default CrmNewNewsletterPage;

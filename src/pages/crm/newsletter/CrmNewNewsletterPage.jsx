import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// ICONS
import { ChevronRight, Send, MailCheck } from "lucide-react";

// CONTEXTS
import { useWorkshops } from "../../../context/WorkshopsContext";

// COMPONENTS
import { CrmSendModal } from "../../../components/crm/CrmSendModal";

// SUPABASE
import { supabase } from "../../../lib/supabaseClient";

const CrmNewNewsletterPage = () => {
	const navigate = useNavigate();
	const workshops = useWorkshops();

	const [audience, setAudience] = useState("all");
	const [interests, setInterests] = useState([]);
	const [contentType, setContentType] = useState("other");
	const [skuInput, setSkuInput] = useState("");
	const [selectedWorkshops, setSelectedWorkshops] = useState([]);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	const [campaignName, setCampaignName] = useState("");

	const [otherRecipients, setOtherRecipients] = useState("");

	const [isEnglishOpen, setIsEnglishOpen] = useState(false);
	const [isUkrainianOpen, setIsUkrainianOpen] = useState(false);

	const [testEmail, setTestEmail] = useState("littlefootcraft@gmail.com");
	const [testStatus, setTestStatus] = useState("idle");
	const [testMessage, setTestMessage] = useState("");
	const [testLanguage, setTestLanguage] = useState("en");

	const [campaignMode, setCampaignMode] = useState("new");
	const [existingCampaignId, setExistingCampaignId] = useState("");
	const [existingCampaigns, setExistingCampaigns] = useState([]);
	const [additionalRecipientsLanguage, setAdditionalRecipientsLanguage] =
		useState("en");

	// EFFECTS
	useEffect(() => {
		const loadExistingCampaigns = async () => {
			const { data, error } = await supabase
				.from("newsletter_campaigns")
				.select("id, campaign_name")
				.order("created_at", { ascending: false });

			if (error) {
				console.error("Failed to load campaigns:", error);
				return;
			}

			setExistingCampaigns(data ?? []);
		};

		loadExistingCampaigns();
	}, []);

	// VALIDATION STATES
	const [errors, setErrors] = useState({});

	// ENGLISH CUSTOM CONTENT
	const [subjectEN, setSubjectEN] = useState("");
	const [titleEN, setTitleEN] = useState("");
	const [contentEN, setContentEN] = useState("");

	// UKRAINIAN CUSTOM CONTENT
	const [subjectUA, setSubjectUA] = useState("");
	const [titleUA, setTitleUA] = useState("");
	const [contentUA, setContentUA] = useState("");

	// VALIDATION
	const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const validateForm = ({ validateAudience = true } = {}) => {
		const newErrors = {};

		if (campaignMode === "new" && !campaignName.trim()) {
			newErrors.campaignName = "Campaign name is required.";
		}

		if (campaignMode === "existing" && !existingCampaignId) {
			newErrors.campaignName = "Select an existing campaign.";
		}

		// NEWSLETTER CONTENT

		if (contentType === "new-items") {
			const skus = skuInput
				.split(",")
				.map((sku) => sku.trim())
				.filter(Boolean);

			if (skus.length === 0) {
				newErrors.skus = "Enter at least one product SKU.";
			}
		}

		if (
			(contentType === "workshop" || contentType === "workshop-reminder") &&
			!selectedWorkshops[0]
		) {
			newErrors.workshop = "Select a workshop.";
		}

		// OTHER
		if (contentType === "other") {
			const needsEN =
				audience !== "other" || additionalRecipientsLanguage === "en";

			const needsUA =
				audience !== "other" || additionalRecipientsLanguage === "ua";

			if (needsEN) {
				if (!subjectEN.trim()) {
					newErrors.subjectEN = "English subject is required.";
				}

				if (!titleEN.trim()) {
					newErrors.titleEN = "English title is required.";
				}

				if (!contentEN.trim()) {
					newErrors.contentEN = "English content is required.";
				}
			}

			if (needsUA) {
				if (!subjectUA.trim()) {
					newErrors.subjectUA = "Вкажіть тему листа.";
				}

				if (!titleUA.trim()) {
					newErrors.titleUA = "Вкажіть заголовок листа.";
				}

				if (!contentUA.trim()) {
					newErrors.contentUA = "Вкажіть текст листа.";
				}
			}
		}

		// OPTIONAL CUSTOM CONTENT
		if (contentType !== "other") {
			const hasAnyEnglishCustomText =
				subjectEN.trim() || titleEN.trim() || contentEN.trim();

			if (hasAnyEnglishCustomText) {
				if (!subjectEN.trim()) {
					newErrors.subjectEN = "Complete the English subject.";
				}

				if (!titleEN.trim()) {
					newErrors.titleEN = "Complete the English title.";
				}

				if (!contentEN.trim()) {
					newErrors.contentEN = "Complete the English content.";
				}
			}

			const hasAnyUkrainianCustomText =
				subjectUA.trim() || titleUA.trim() || contentUA.trim();

			if (hasAnyUkrainianCustomText) {
				if (!subjectUA.trim()) {
					newErrors.subjectUA = "Заповніть тему української версії.";
				}

				if (!titleUA.trim()) {
					newErrors.titleUA = "Заповніть заголовок української версії.";
				}

				if (!contentUA.trim()) {
					newErrors.contentUA = "Заповніть текст української версії.";
				}
			}
		}

		// REAL CAMPAIGN AUDIENCE ONLY
		if (validateAudience) {
			if (audience === "interest" && interests.length === 0) {
				newErrors.interests = "Select at least one interest.";
			}

			if (audience === "other") {
				const emails = otherRecipients
					.split(",")
					.map((email) => email.trim())
					.filter(Boolean);

				if (emails.length === 0) {
					newErrors.otherRecipients =
						"Enter at least one recipient email address.";
				} else {
					const invalidEmails = emails.filter(
						(email) => !EMAIL_REGEX.test(email),
					);

					if (invalidEmails.length > 0) {
						newErrors.otherRecipients = `Invalid email: ${invalidEmails[0]}`;
					}
				}
			}
		}

		setErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	};

	// CLEAR ERRORS WHEN INPUT CHANGES
	const clearError = (field) => {
		setErrors((current) => {
			if (!current[field]) return current;

			const updatedErrors = { ...current };
			delete updatedErrors[field];

			return updatedErrors;
		});
	};

	const toggleInterest = (interest) => {
		setInterests((current) =>
			current.includes(interest)
				? current.filter((item) => item !== interest)
				: [...current, interest],
		);

		clearError("interests");
	};

	const handleContentTypeChange = (value) => {
		setContentType(value);

		// When leaving "Other", custom language sections become optional,
		// so close them automatically.
		if (value !== "other") {
			setIsEnglishOpen(false);
			setIsUkrainianOpen(false);
		}

		setErrors((current) => {
			const updatedErrors = { ...current };

			delete updatedErrors.skus;
			delete updatedErrors.workshop;

			delete updatedErrors.subjectEN;
			delete updatedErrors.titleEN;
			delete updatedErrors.contentEN;

			delete updatedErrors.subjectUA;
			delete updatedErrors.titleUA;
			delete updatedErrors.contentUA;

			return updatedErrors;
		});
	};

	const handleAudienceChange = (value) => {
		setAudience(value);

		setErrors((current) => {
			const updatedErrors = { ...current };

			delete updatedErrors.interests;
			delete updatedErrors.otherRecipients;

			return updatedErrors;
		});
	};

	// SUBMIT HANDLER

	const handleSubmit = (e) => {
		e.preventDefault();

		const isValid = validateForm();

		if (!isValid) {
			const hasEnglishCustomText =
				subjectEN.trim() || titleEN.trim() || contentEN.trim();

			const hasUkrainianCustomText =
				subjectUA.trim() || titleUA.trim() || contentUA.trim();

			if (contentType === "other") {
				if (audience === "other") {
					setIsEnglishOpen(additionalRecipientsLanguage === "en");
					setIsUkrainianOpen(additionalRecipientsLanguage === "ua");
				} else {
					setIsEnglishOpen(true);
					setIsUkrainianOpen(true);
				}
			} else {
				if (hasEnglishCustomText) {
					setIsEnglishOpen(true);
				}

				if (hasUkrainianCustomText) {
					setIsUkrainianOpen(true);
				}
			}

			return;
		}

		setIsConfirmOpen(true);
	};

	// FOR SENDING TEST EMAIL
	const buildNewsletterPayload = () => {
		const skus = skuInput
			.split(",")
			.map((sku) => sku.trim())
			.filter(Boolean);

		const recipientEmails = otherRecipients
			.split(",")
			.map((email) => email.trim().toLowerCase())
			.filter(Boolean);

		const type = contentType === "workshop" ? "new-workshop" : contentType;

		const selectedExistingCampaign = existingCampaigns.find(
			(campaign) => campaign.id === existingCampaignId,
		);

		const finalCampaignName =
			campaignMode === "new"
				? campaignName.trim()
				: (selectedExistingCampaign?.campaign_name ?? "");

		return {
			campaignName: finalCampaignName,
			campaignId: campaignMode === "existing" ? existingCampaignId : null,

			type,
			skus,

			itemId:
				contentType === "workshop" || contentType === "workshop-reminder"
					? selectedWorkshops[0]
					: null,

			audience,
			interests,
			otherRecipients: recipientEmails,
			additionalRecipientsLanguage,

			subjectEN,
			titleEN,
			contentEN,

			subjectUA,
			titleUA,
			contentUA,
		};
	};

	const handleConfirmSend = async () => {
		try {
			const payload = buildNewsletterPayload();

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

			if (data?.sendId) {
				navigate(`/crm/newsletter/sends/${data.sendId}`);
			}
		} catch (error) {
			console.error("Newsletter sending failed:", error);
		}
	};

	const handleSendTest = async () => {
		const email = testEmail.trim().toLowerCase();

		if (!EMAIL_REGEX.test(email)) {
			setTestStatus("error");
			setTestMessage("Enter a valid test email address.");
			return;
		}

		const isValid = validateForm({
			validateAudience: false,
		});

		if (!isValid) {
			setTestStatus("error");
			setTestMessage("Fix the newsletter fields before sending a test.");
			return;
		}

		try {
			setTestStatus("loading");
			setTestMessage("");

			const payload = {
				...buildNewsletterPayload(),

				isTest: true,
				testEmail: email,
				testLanguage,
			};

			const { data, error } = await supabase.functions.invoke(
				"send-newsletter",
				{
					body: payload,
				},
			);

			if (error) {
				console.error("Test newsletter error:", error);

				setTestStatus("error");
				setTestMessage("Test email could not be sent.");
				return;
			}

			console.log("Test newsletter result:", data);

			setTestStatus("success");
			setTestMessage("Test email sent successfully.");
		} catch (error) {
			console.error("Test newsletter failed:", error);

			setTestStatus("error");
			setTestMessage("Test email could not be sent.");
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

					<div className="crm-new-newsletter__campaign-options">
						{/* CREATE NEW */}
						<div className="crm-new-newsletter__campaign-option">
							<label className="crm-new-newsletter__radio">
								<input
									type="radio"
									name="campaignMode"
									value="new"
									checked={campaignMode === "new"}
									onChange={() => {
										setCampaignMode("new");
										setExistingCampaignId("");
										clearError("campaignName");
									}}
								/>

								<span>Create new campaign</span>
							</label>

							{campaignMode === "new" && (
								<div className="crm-new-newsletter__campaign-field">
									<label className="crm-new-newsletter__field">
										<span>Campaign name</span>

										<input
											type="text"
											placeholder="August Workshop"
											value={campaignName}
											onChange={(e) => {
												setCampaignName(e.target.value);
												clearError("campaignName");
											}}
										/>

										{errors.campaignName && (
											<span className="crm-new-newsletter__error">
												{errors.campaignName}
											</span>
										)}
									</label>
								</div>
							)}
						</div>

						{/* USE EXISTING */}
						<div className="crm-new-newsletter__campaign-option">
							<label className="crm-new-newsletter__radio">
								<input
									type="radio"
									name="campaignMode"
									value="existing"
									checked={campaignMode === "existing"}
									onChange={() => {
										setCampaignMode("existing");
										setCampaignName("");
										clearError("campaignName");
									}}
								/>

								<span>Use existing campaign</span>
							</label>

							{campaignMode === "existing" && (
								<div className="crm-new-newsletter__campaign-field">
									<label className="crm-new-newsletter__field">
										<span>Select campaign</span>

										<select
											value={existingCampaignId}
											onChange={(e) => {
												setExistingCampaignId(e.target.value);
												clearError("campaignName");
											}}
										>
											<option value="">Select campaign</option>

											{existingCampaigns.map((campaign) => (
												<option
													key={campaign.id}
													value={campaign.id}
												>
													{campaign.campaign_name}
												</option>
											))}
										</select>

										{errors.campaignName && (
											<span className="crm-new-newsletter__error">
												{errors.campaignName}
											</span>
										)}
									</label>
								</div>
							)}
						</div>
					</div>
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
							onChange={(e) => handleContentTypeChange(e.target.value)}
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
									onChange={(e) => {
										setSkuInput(e.target.value);
										clearError("skus");
									}}
									placeholder="BR-20260801-0001, BR-20260805-0002"
								/>
								{errors.skus && (
									<span className="crm-new-newsletter__error">
										{errors.skus}
									</span>
								)}
							</label>

							<p className="crm-new-newsletter__hint">
								Enter SKU numbers separated by commas.
							</p>
						</div>
					)}

					{/* WORKSHOP */}
					<label className="crm-new-newsletter__radio">
						<input
							type="radio"
							name="contentType"
							value="workshop"
							checked={contentType === "workshop"}
							onChange={(e) => handleContentTypeChange(e.target.value)}
						/>

						<span>Workshop</span>
					</label>

					{contentType === "workshop" && (
						<div className="crm-new-newsletter__content-details">
							<p className="crm-new-newsletter__field-label">Select workshop</p>

							<div className="crm-new-newsletter__workshops">
								{workshops.map((workshop) => (
									<label
										key={workshop.id}
										className="crm-new-newsletter__workshop"
									>
										<input
											type="radio"
											name="selectedWorkshop"
											checked={selectedWorkshops[0] === workshop.id}
											onChange={() => {
												setSelectedWorkshops([workshop.id]);
												clearError("workshop");
											}}
										/>

										<span>{workshop.title.en}</span>
									</label>
								))}
								{errors.workshop && (
									<p className="crm-new-newsletter__error">{errors.workshop}</p>
								)}
							</div>
						</div>
					)}
					{/* WORKSHOP REMINDER*/}
					<label className="crm-new-newsletter__radio">
						<input
							type="radio"
							name="contentType"
							value="workshop-reminder"
							checked={contentType === "workshop-reminder"}
							onChange={(e) => handleContentTypeChange(e.target.value)}
						/>

						<span>Workshop reminder</span>
					</label>

					{contentType === "workshop-reminder" && (
						<div className="crm-new-newsletter__content-details">
							<p className="crm-new-newsletter__field-label">Select workshop</p>

							<div className="crm-new-newsletter__workshops">
								{workshops.map((workshop) => (
									<label
										key={workshop.id}
										className="crm-new-newsletter__workshop"
									>
										<input
											type="radio"
											name="selectedWorkshop"
											checked={selectedWorkshops[0] === workshop.id}
											onChange={() => {
												setSelectedWorkshops([workshop.id]);
												clearError("workshop");
											}}
										/>

										<span>{workshop.title.en}</span>
									</label>
								))}

								{errors.workshop && (
									<p className="crm-new-newsletter__error">{errors.workshop}</p>
								)}
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
							onChange={(e) => handleContentTypeChange(e.target.value)}
						/>

						<span>Other</span>
					</label>
				</section>

				<section className="crm-new-newsletter__section">
					<button
						type="button"
						className="crm-new-newsletter__optional-toggle"
						onClick={() => setIsEnglishOpen((current) => !current)}
						aria-expanded={isEnglishOpen}
					>
						<span>English</span>

						<span>
							{isEnglishOpen
								? "Hide"
								: contentType === "other"
									? audience === "other"
										? additionalRecipientsLanguage === "en"
											? "Required"
											: "Optional"
										: "Required"
									: "Optional"}
						</span>
					</button>

					{isEnglishOpen && (
						<div className="crm-new-newsletter__optional-content">
							<p className="crm-new-newsletter__hint">
								{contentType === "other"
									? audience === "other"
										? additionalRecipientsLanguage === "en"
											? "Required. Provide the English subject, title and content for this custom newsletter."
											: "Optional. This newsletter will be sent to these recipients in Ukrainian."
										: "Required. Provide the English subject, title and content for this custom newsletter."
									: "Optional. Provide custom text only if you want to replace the default English newsletter content."}
							</p>
							<label className="crm-new-newsletter__field">
								<span>Subject</span>

								<input
									type="text"
									placeholder="Newsletter subject"
									value={subjectEN}
									onChange={(e) => {
										setSubjectEN(e.target.value);
										clearError("subjectEN");
									}}
								/>
								{errors.subjectEN && (
									<span className="crm-new-newsletter__error">
										{errors.subjectEN}
									</span>
								)}
							</label>

							<label className="crm-new-newsletter__field">
								<span>Title</span>

								<input
									type="text"
									placeholder="Newsletter title"
									value={titleEN}
									onChange={(e) => {
										setTitleEN(e.target.value);
										clearError("titleEN");
									}}
								/>
								{errors.titleEN && (
									<span className="crm-new-newsletter__error">
										{errors.titleEN}
									</span>
								)}
							</label>

							<label className="crm-new-newsletter__field">
								<span>Content</span>

								<textarea
									rows="10"
									placeholder="Write the English newsletter..."
									value={contentEN}
									onChange={(e) => {
										setContentEN(e.target.value);
										clearError("contentEN");
									}}
								/>
								{errors.contentEN && (
									<span className="crm-new-newsletter__error">
										{errors.contentEN}
									</span>
								)}
							</label>
						</div>
					)}
				</section>

				<section className="crm-new-newsletter__section">
					<button
						type="button"
						className="crm-new-newsletter__optional-toggle"
						onClick={() => setIsUkrainianOpen((current) => !current)}
						aria-expanded={isUkrainianOpen}
					>
						<span>Ukrainian</span>

						<span>
							{isUkrainianOpen
								? "Сховати"
								: contentType === "other"
									? audience === "other"
										? additionalRecipientsLanguage === "ua"
											? "Обов’язково"
											: "Необов’язково"
										: "Обов’язково"
									: "Необов’язково"}
						</span>
					</button>

					{isUkrainianOpen && (
						<div className="crm-new-newsletter__optional-content">
							<p className="crm-new-newsletter__hint">
								{contentType === "other"
									? audience === "other"
										? additionalRecipientsLanguage === "ua"
											? "Обов’язково. Вкажіть тему, заголовок і текст українською мовою."
											: "Необов’язково. Цей лист буде надіслано цим отримувачам англійською мовою."
										: "Обов’язково. Вкажіть тему, заголовок і текст українською мовою."
									: "Необов’язково. Додайте власний текст лише якщо хочете замінити стандартний текст української версії листа."}
							</p>
							<label className="crm-new-newsletter__field">
								<span>Тема листа</span>

								<input
									type="text"
									placeholder="Тема листа"
									value={subjectUA}
									onChange={(e) => {
										setSubjectUA(e.target.value);
										clearError("subjectUA");
									}}
								/>
								{errors.subjectUA && (
									<span className="crm-new-newsletter__error">
										{errors.subjectUA}
									</span>
								)}
							</label>

							<label className="crm-new-newsletter__field">
								<span>Заголовок</span>

								<input
									type="text"
									placeholder="Заголовок листа"
									value={titleUA}
									onChange={(e) => {
										setTitleUA(e.target.value);
										clearError("titleUA");
									}}
								/>
								{errors.titleUA && (
									<span className="crm-new-newsletter__error">
										{errors.titleUA}
									</span>
								)}
							</label>

							<label className="crm-new-newsletter__field">
								<span>Зміст листа</span>

								<textarea
									rows="10"
									placeholder="Напишіть українську версію листа..."
									value={contentUA}
									onChange={(e) => {
										setContentUA(e.target.value);
										clearError("contentUA");
									}}
								/>
								{errors.contentUA && (
									<span className="crm-new-newsletter__error">
										{errors.contentUA}
									</span>
								)}
							</label>
						</div>
					)}
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
							onChange={(e) => handleAudienceChange(e.target.value)}
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
							onChange={(e) => handleAudienceChange(e.target.value)}
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
							{errors.interests && (
								<p className="crm-new-newsletter__error">{errors.interests}</p>
							)}
						</div>
					)}

					{/* OTHER RECIPIENTS */}
					<label className="crm-new-newsletter__radio">
						<input
							type="radio"
							name="audience"
							value="other"
							checked={audience === "other"}
							onChange={(e) => handleAudienceChange(e.target.value)}
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
									onChange={(e) => {
										setOtherRecipients(e.target.value);
										clearError("otherRecipients");
									}}
								/>
								{errors.otherRecipients && (
									<p className="crm-new-newsletter__error">
										{errors.otherRecipients}
									</p>
								)}
							</label>

							<div className="crm-new-newsletter__field">
								<label className="crm-new-newsletter__language-label">
									Language for other recipients
								</label>

								<div className="crm-new-newsletter__language-options">
									<label>
										<input
											type="radio"
											name="additionalRecipientsLanguage"
											value="en"
											checked={additionalRecipientsLanguage === "en"}
											onChange={() => {
												setAdditionalRecipientsLanguage("en");

												clearError("subjectUA");
												clearError("titleUA");
												clearError("contentUA");
											}}
										/>
										English
									</label>

									<label>
										<input
											type="radio"
											name="additionalRecipientsLanguage"
											value="ua"
											checked={additionalRecipientsLanguage === "ua"}
											onChange={() => {
												setAdditionalRecipientsLanguage("ua");

												clearError("subjectEN");
												clearError("titleEN");
												clearError("contentEN");
											}}
										/>
										Ukrainian
									</label>
								</div>
							</div>
						</div>
					)}
				</section>

				<div className="crm-new-newsletter__actions">
					<div className="crm-new-newsletter__test-email">
						<label className="crm-new-newsletter__field">
							<span>Test email</span>
							<input
								type="email"
								value={testEmail}
								onChange={(e) => {
									setTestEmail(e.target.value);
									setTestMessage("");
									setTestStatus("idle");
								}}
							/>
							<p className="crm-new-newsletter__test-hint">
								Change this email only if you want to send the test to a
								different address.
							</p>
							{testMessage && (
								<span
									className={
										testStatus === "error"
											? "crm-new-newsletter__error"
											: "crm-new-newsletter__success"
									}
								>
									{testMessage}
								</span>
							)}
						</label>
						<div className="crm-new-newsletter__test-language">
							<span className="crm-new-newsletter__language-label">
								Test language
							</span>
							<label>
								<input
									type="radio"
									name="testLanguage"
									value="en"
									checked={testLanguage === "en"}
									onChange={(e) => setTestLanguage(e.target.value)}
								/>
								<span>English</span>
							</label>
							<label>
								<input
									type="radio"
									name="testLanguage"
									value="ua"
									checked={testLanguage === "ua"}
									onChange={(e) => setTestLanguage(e.target.value)}
								/>
								<span>Ukrainian</span>
							</label>
						</div>
						<button
							type="button"
							className="crm-new-newsletter__test-btn"
							onClick={handleSendTest}
							disabled={testStatus === "loading"}
						>
							<MailCheck size={18} />
							{testStatus === "loading" ? "Sending test..." : "Send Test"}
						</button>
					</div>

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
					contentType={contentType}
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

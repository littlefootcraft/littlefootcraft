import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

import { newsletterTemplate } from "../_shared/email/newsletterTemplate.js";
import { masterClassNewsletterTemplate } from "../_shared/email/masterClassNewsletterTemplate.js";

// ---------------------------------------
// NEWSLETTER TYPE → DEFAULT INTEREST
// ---------------------------------------
const campaignInterestMap: Record<string, string> = {
	"new-items": "sales",
	sale: "sales",
	"new-workshop": "workshops",
	"workshop-reminder": "workshops",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------------------------------------
// BUILT-IN NEWSLETTER CONTENT
// ---------------------------------------
const campaignContent = {
	"new-items": {
		en: {
			subject: "New treasures have arrived at LittleFootCraft ✨",
			title: "New Items Arrived",
			message:
				"Discover the newest handmade creations that have just joined the LittleFootCraft collection.",
			buttonText: "Visit the shop",
		},

		ua: {
			subject: "Нові чарівні вироби вже в LittleFootCraft ✨",
			title: "Новинки вже тут",
			message:
				"Відкрийте для себе нові вироби ручної роботи, які щойно з’явилися в колекції LittleFootCraft.",
			buttonText: "Перейти до магазину",
		},
	},

	sale: {
		en: {
			subject: "Special pieces are now on sale ✨",
			title: "LittleFootCraft Sale",
			message: "Selected handmade pieces are now available at special prices.",
			buttonText: "View sale",
		},

		ua: {
			subject: "Особливі вироби тепер зі знижкою ✨",
			title: "Знижки LittleFootCraft",
			message:
				"Обрані вироби ручної роботи тепер доступні за спеціальними цінами.",
			buttonText: "Переглянути знижки",
		},
	},

	"new-workshop": {
		en: {
			subject: "A new LittleFootCraft workshop is here ✨",
			title: "New Workshop",
			message:
				"Join us for a creative LittleFootCraft workshop and discover something new.",
			buttonText: "View workshop",
		},

		ua: {
			subject: "Новий майстер-клас LittleFootCraft ✨",
			title: "Новий майстер-клас",
			message:
				"Приєднуйтеся до творчого майстер-класу LittleFootCraft та відкрийте для себе щось нове.",
			buttonText: "Переглянути майстер-клас",
		},
	},
};

export default {
	async fetch(req: Request) {
		// ---------------------------------------
		// CORS
		// ---------------------------------------
		if (req.method === "OPTIONS") {
			return new Response("ok", {
				headers: corsHeaders,
			});
		}

		try {
			// ---------------------------------------
			// REQUEST DATA
			// ---------------------------------------
			const {
				type,
				skus = [],
				itemId = null,

				audience = "all",
				interests = [],
				otherRecipients = [],
				additionalRecipientsLanguage = "en",

				subjectEN = "",
				titleEN = "",
				contentEN = "",

				subjectUA = "",
				titleUA = "",
				contentUA = "",

				// TEST EMAIL
				isTest = false,
				testEmail = "",
				testLanguage = "en",

				campaignName = "",
				campaignId = null,
			} = await req.json();

			// ---------------------------------------
			// BASIC VALIDATION
			// ---------------------------------------
			if (!type) {
				return new Response(
					JSON.stringify({
						error: "Newsletter type is required.",
					}),
					{
						status: 400,
						headers: {
							...corsHeaders,
							"Content-Type": "application/json",
						},
					},
				);
			}

			const supportedTypes = [
				"new-items",
				"sale",
				"new-workshop",
				"workshop-reminder",
				"other",
			];

			if (!supportedTypes.includes(type)) {
				return new Response(
					JSON.stringify({
						error: "Unsupported newsletter type.",
						type,
					}),
					{
						status: 400,
						headers: {
							...corsHeaders,
							"Content-Type": "application/json",
						},
					},
				);
			}

			if (!["all", "interest", "other"].includes(audience)) {
				return new Response(
					JSON.stringify({
						error: "Unsupported audience type.",
					}),
					{
						status: 400,
						headers: {
							...corsHeaders,
							"Content-Type": "application/json",
						},
					},
				);
			}

			if (
				audience === "other" &&
				!["en", "ua"].includes(additionalRecipientsLanguage)
			) {
				return new Response(
					JSON.stringify({
						error: "Unsupported recipient language.",
					}),
					{
						status: 400,
						headers: {
							...corsHeaders,
							"Content-Type": "application/json",
						},
					},
				);
			}

			// ---------------------------------------
			// CAMPAIGN NAME VALIDATION
			// ---------------------------------------
			if (!isTest && !campaignId && !String(campaignName).trim()) {
				return new Response(
					JSON.stringify({
						error: "Campaign name is required.",
					}),
					{
						status: 400,
						headers: {
							...corsHeaders,
							"Content-Type": "application/json",
						},
					},
				);
			}

			// ---------------------------------------
			// TEST EMAIL VALIDATION
			// ---------------------------------------
			if (isTest) {
				const normalizedTestEmail = String(testEmail).trim().toLowerCase();

				if (!normalizedTestEmail) {
					return new Response(
						JSON.stringify({
							error: "Test email is required.",
						}),
						{
							status: 400,
							headers: {
								...corsHeaders,
								"Content-Type": "application/json",
							},
						},
					);
				}

				if (!EMAIL_REGEX.test(normalizedTestEmail)) {
					return new Response(
						JSON.stringify({
							error: "Invalid test email address.",
						}),
						{
							status: 400,
							headers: {
								...corsHeaders,
								"Content-Type": "application/json",
							},
						},
					);
				}

				if (!["en", "ua"].includes(testLanguage)) {
					return new Response(
						JSON.stringify({
							error: "Unsupported test language.",
						}),
						{
							status: 400,
							headers: {
								...corsHeaders,
								"Content-Type": "application/json",
							},
						},
					);
				}
			}

			const requiredInterest = campaignInterestMap[type];

			// ---------------------------------------
			// PRODUCTS
			// ---------------------------------------
			let selectedProducts = [];

			if (type === "new-items" || type === "sale") {
				if (!Array.isArray(skus) || skus.length === 0) {
					return new Response(
						JSON.stringify({
							error: "At least one SKU is required.",
						}),
						{
							status: 400,
							headers: {
								...corsHeaders,
								"Content-Type": "application/json",
							},
						},
					);
				}

				const productsResponse = await fetch(
					"https://littlefootcraft.art/data/products.json",
				);

				if (!productsResponse.ok) {
					throw new Error("Failed to load product data.");
				}

				const products = await productsResponse.json();

				selectedProducts = products.filter((product) =>
					skus.includes(product.sku),
				);

				if (selectedProducts.length !== skus.length) {
					const foundSkus = selectedProducts.map((product) => product.sku);

					const missingSkus = skus.filter((sku) => !foundSkus.includes(sku));

					return new Response(
						JSON.stringify({
							error: "One or more SKUs were not found.",
							missingSkus,
						}),
						{
							status: 400,
							headers: {
								...corsHeaders,
								"Content-Type": "application/json",
							},
						},
					);
				}
			}

			// ---------------------------------------
			// WORKSHOP
			// ---------------------------------------
			let selectedWorkshop = null;
			let workshopForEmail = null;
			let reminderDate = null;

			if (type === "new-workshop" || type === "workshop-reminder") {
				if (!itemId) {
					return new Response(
						JSON.stringify({
							error: "Workshop ID is required.",
						}),
						{
							status: 400,
							headers: {
								...corsHeaders,
								"Content-Type": "application/json",
							},
						},
					);
				}

				const workshopsResponse = await fetch(
					"https://littlefootcraft.art/data/workshops.json",
				);

				if (!workshopsResponse.ok) {
					throw new Error("Failed to load workshop data.");
				}

				const workshops = await workshopsResponse.json();

				selectedWorkshop = workshops.find((workshop) => workshop.id === itemId);

				if (!selectedWorkshop) {
					return new Response(
						JSON.stringify({
							error: "Workshop was not found.",
							itemId,
						}),
						{
							status: 404,
							headers: {
								...corsHeaders,
								"Content-Type": "application/json",
							},
						},
					);
				}

				// ---------------------------------------
				// REMOVE PAST WORKSHOP DATES
				// ---------------------------------------
				const today = new Date();
				today.setHours(0, 0, 0, 0);

				const futureWorkshopDates =
					selectedWorkshop.upcomingDates?.dates
						?.filter((date) => {
							const eventDate = new Date(`${date}T00:00:00`);

							return eventDate >= today;
						})
						.sort(
							(a, b) =>
								new Date(`${a}T00:00:00`).getTime() -
								new Date(`${b}T00:00:00`).getTime(),
						) ?? [];

				if (futureWorkshopDates.length === 0) {
					return new Response(
						JSON.stringify({
							error: "This workshop has no upcoming dates.",
						}),
						{
							status: 400,
							headers: {
								...corsHeaders,
								"Content-Type": "application/json",
							},
						},
					);
				}

				// Clean workshop object used by the email template.
				// Past dates remain in the original JSON but are not sent.
				workshopForEmail = {
					...selectedWorkshop,

					upcomingDates: {
						...selectedWorkshop.upcomingDates,
						dates: futureWorkshopDates,
					},
				};

				// Reminder always uses the nearest upcoming date.
				if (type === "workshop-reminder") {
					reminderDate = futureWorkshopDates[0];
				}
			}

			// ---------------------------------------
			// SUPABASE
			// ---------------------------------------
			const supabaseUrl = Deno.env.get("SUPABASE_URL");

			const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

			if (!supabaseUrl || !serviceRoleKey) {
				throw new Error("Supabase environment variables are missing.");
			}

			const supabase = createClient(supabaseUrl, serviceRoleKey);

			let subscribers = [];

			// ---------------------------------------
			// TEST RECIPIENT
			// ---------------------------------------
			if (isTest) {
				subscribers = [
					{
						id: null,
						email: String(testEmail).trim().toLowerCase(),
						language: testLanguage,
						interests: [],
						isTestRecipient: true,
					},
				];
			}

			// ---------------------------------------
			// ALL SUBSCRIBERS
			// ---------------------------------------
			if (!isTest && audience === "all") {
				const { data, error } = await supabase
					.from("subscribers")
					.select("id, email, language, interests");

				if (error) {
					throw error;
				}

				subscribers = data ?? [];
			}

			// ---------------------------------------
			// SUBSCRIBERS BY INTEREST
			// ---------------------------------------
			if (!isTest && audience === "interest") {
				if (!Array.isArray(interests) || interests.length === 0) {
					return new Response(
						JSON.stringify({
							error: "At least one interest must be selected.",
						}),
						{
							status: 400,
							headers: {
								...corsHeaders,
								"Content-Type": "application/json",
							},
						},
					);
				}

				const { data, error } = await supabase
					.from("subscribers")
					.select("id, email, language, interests")
					.overlaps("interests", interests);

				if (error) {
					throw error;
				}

				subscribers = data ?? [];
			}

			// ---------------------------------------
			// OTHER RECIPIENTS
			// ---------------------------------------
			if (!isTest && audience === "other") {
				if (!Array.isArray(otherRecipients) || otherRecipients.length === 0) {
					return new Response(
						JSON.stringify({
							error: "At least one recipient email is required.",
						}),
						{
							status: 400,
							headers: {
								...corsHeaders,
								"Content-Type": "application/json",
							},
						},
					);
				}

				const uniqueEmails = [
					...new Set(
						otherRecipients
							.map((email) => String(email).trim().toLowerCase())
							.filter(Boolean),
					),
				];

				subscribers = uniqueEmails.map((email) => ({
					id: null,
					email,
					language: additionalRecipientsLanguage,
					interests: [],
					isManualRecipient: true,
				}));
			}

			// ---------------------------------------
			// EXCLUDE PEOPLE WHO ALREADY BOOKED
			// ---------------------------------------
			if (!isTest && type === "workshop-reminder") {
				const { data: bookings, error: bookingsError } = await supabase
					.from("workshop_bookings")
					.select("email")
					.eq("workshop_id", itemId)
					.eq("workshop_date", reminderDate);

				if (bookingsError) {
					throw bookingsError;
				}

				const bookedEmails = new Set(
					(bookings ?? []).map((booking) => booking.email.toLowerCase()),
				);

				subscribers = subscribers.filter(
					(subscriber) => !bookedEmails.has(subscriber.email.toLowerCase()),
				);
			}

			// ---------------------------------------
			// NO RECIPIENTS
			// ---------------------------------------
			if (subscribers.length === 0) {
				return new Response(
					JSON.stringify({
						success: true,
						message: "No matching recipients found.",
						count: 0,
						reminderDate,
					}),
					{
						status: 200,
						headers: {
							...corsHeaders,
							"Content-Type": "application/json",
						},
					},
				);
			}

			// ---------------------------------------
			// VALIDATE CUSTOM "OTHER" NEWSLETTER
			// ---------------------------------------
			if (type === "other") {
				const hasEnglishRecipients = subscribers.some(
					(subscriber) => subscriber.language !== "ua",
				);

				const hasUkrainianRecipients = subscribers.some(
					(subscriber) => subscriber.language === "ua",
				);

				const hasEnglishContent =
					String(subjectEN).trim() !== "" &&
					String(titleEN).trim() !== "" &&
					String(contentEN).trim() !== "";

				const hasUkrainianContent =
					String(subjectUA).trim() !== "" &&
					String(titleUA).trim() !== "" &&
					String(contentUA).trim() !== "";

				if (hasEnglishRecipients && !hasEnglishContent) {
					return new Response(
						JSON.stringify({
							error:
								"English subject, title and content are required for English recipients.",
						}),
						{
							status: 400,
							headers: {
								...corsHeaders,
								"Content-Type": "application/json",
							},
						},
					);
				}

				if (hasUkrainianRecipients && !hasUkrainianContent) {
					return new Response(
						JSON.stringify({
							error:
								"Ukrainian subject, title and content are required for Ukrainian recipients.",
						}),
						{
							status: 400,
							headers: {
								...corsHeaders,
								"Content-Type": "application/json",
							},
						},
					);
				}
			}

			// ---------------------------------------
			// RESEND
			// ---------------------------------------
			const resendApiKey = Deno.env.get("RESEND_API_KEY");

			if (!resendApiKey) {
				throw new Error("RESEND_API_KEY is missing.");
			}

			const results = [];

			const finalContentByLanguage = {
				en: {
					subject: "",
					title: "",
					content: "",
				},
				ua: {
					subject: "",
					title: "",
					content: "",
				},
			};

			// ---------------------------------------
			// SEND ONE EMAIL PER RECIPIENT
			// ---------------------------------------
			for (const subscriber of subscribers) {
				const language = subscriber.language === "ua" ? "ua" : "en";

				let html = "";
				let subject = "";
				let finalTitle = "";
				let finalContent = "";

				const customSubject =
					language === "ua"
						? String(subjectUA).trim()
						: String(subjectEN).trim();

				const customTitle =
					language === "ua" ? String(titleUA).trim() : String(titleEN).trim();

				const customContent =
					language === "ua"
						? String(contentUA).trim()
						: String(contentEN).trim();

				// ---------------------------------------
				// PRODUCT NEWSLETTER
				// ---------------------------------------
				if (type === "new-items" || type === "sale") {
					const text = campaignContent[type]?.[language];

					if (!text) {
						throw new Error(
							`Newsletter content is not configured for type: ${type}`,
						);
					}

					subject = customSubject || text.subject;
					finalTitle = customTitle || text.title;
					finalContent = customContent || text.message;

					html = newsletterTemplate({
						title: finalTitle,
						message: finalContent,
						buttonText: text.buttonText,

						buttonUrl:
							type === "sale"
								? `https://littlefootcraft.art/${language}/sale`
								: `https://littlefootcraft.art/${language}/shop`,

						language,
						subscriberId: subscriber.id,
						products: selectedProducts,
					});
				}

				// ---------------------------------------
				// WORKSHOP NEWSLETTER
				// ---------------------------------------
				if (type === "new-workshop" || type === "workshop-reminder") {
					const defaultText =
						type === "new-workshop"
							? campaignContent["new-workshop"]?.[language]
							: null;

					const defaultReminderContent =
						language === "ua"
							? "Майстер-клас уже зовсім скоро ✨ Ще є час приєднатися."
							: "This workshop is coming up soon ✨ There is still time to join us.";

					const defaultReminderTitle =
						language === "ua"
							? `${selectedWorkshop.title.ua} — уже скоро`
							: `${selectedWorkshop.title.en} — Coming Soon`;

					const defaultWorkshopTitle =
						language === "ua"
							? "Запрошення на майстер-клас ✨"
							: "Workshop Invitation ✨";

					finalTitle =
						customTitle ||
						(type === "new-workshop"
							? defaultWorkshopTitle
							: defaultReminderTitle);

					finalContent =
						customContent ||
						(type === "new-workshop"
							? defaultText?.message || ""
							: defaultReminderContent);

					html = masterClassNewsletterTemplate({
						type,
						workshop: workshopForEmail,
						language,
						reminderDate,

						subscriberId: subscriber.id,

						customTitle: finalTitle,
						customMessage: finalContent,
					});

					if (customSubject) {
						subject = customSubject;
					} else if (type === "new-workshop") {
						subject =
							defaultText?.subject ||
							(language === "ua"
								? `Новий майстер-клас: ${selectedWorkshop.title.ua}`
								: `New Workshop: ${selectedWorkshop.title.en}`);
					} else {
						subject =
							language === "ua"
								? `${selectedWorkshop.title.ua} — уже скоро`
								: `${selectedWorkshop.title.en} — coming soon`;
					}
				}

				// ---------------------------------------
				// OTHER / CUSTOM NEWSLETTER
				// ---------------------------------------
				if (type === "other") {
					subject = customSubject;
					finalTitle = customTitle;
					finalContent = customContent;

					html = newsletterTemplate({
						title: finalTitle,
						message: finalContent,

						buttonText:
							language === "ua"
								? "Відвідати LittleFootCraft"
								: "Visit LittleFootCraft",

						buttonUrl: `https://littlefootcraft.art/${language}`,

						language,
						subscriberId: subscriber.id,
						products: [],
					});
				}

				if (!subject || !html) {
					throw new Error("Newsletter subject or HTML could not be generated.");
				}
				finalContentByLanguage[language] = {
					subject,
					title: finalTitle,
					content: finalContent,
				};

				const resendResponse = await fetch("https://api.resend.com/emails", {
					method: "POST",

					headers: {
						Authorization: `Bearer ${resendApiKey}`,

						"Content-Type": "application/json",
					},

					body: JSON.stringify({
						from: "LittleFootCraft <info@littlefootcraft.art>",

						to: [subscriber.email],

						subject,
						html,

						reply_to: "littlefootcraft@gmail.com",
					}),
				});

				const resendData = await resendResponse.json();

				results.push({
					email: subscriber.email,
					language,
					success: resendResponse.ok,
					status: resendResponse.status,
					result: resendData,
				});
			}

			// ---------------------------------------
			// RESULT
			// ---------------------------------------
			const successful = results.filter((result) => result.success).length;

			const failed = results.length - successful;

			let savedCampaignId = campaignId;
			let sendId = null;

			// ---------------------------------------
			// SAVE REAL CAMPAIGN + SEND
			// ---------------------------------------
			if (!isTest) {
				const sendStatus =
					failed === 0 ? "sent" : successful > 0 ? "partial" : "failed";

				// ---------------------------------------
				// CREATE CAMPAIGN IF NEW
				// ---------------------------------------
				if (!savedCampaignId) {
					const { data: newCampaign, error: campaignError } = await supabase
						.from("newsletter_campaigns")
						.insert({
							campaign_name: String(campaignName).trim(),
						})
						.select("id")
						.single();

					if (campaignError) {
						throw campaignError;
					}

					savedCampaignId = newCampaign.id;
				}

				// ---------------------------------------
				// SAVE INDIVIDUAL NEWSLETTER SEND
				// ---------------------------------------
				const { data: newsletterSend, error: sendError } = await supabase
					.from("newsletter_sends")
					.insert({
						campaign_id: savedCampaignId,

						type,
						audience,
						interests,

						skus,
						item_id: itemId,

						subject_en: finalContentByLanguage.en.subject || null,
						title_en: finalContentByLanguage.en.title || null,
						content_en: finalContentByLanguage.en.content || null,

						subject_ua: finalContentByLanguage.ua.subject || null,
						title_ua: finalContentByLanguage.ua.title || null,
						content_ua: finalContentByLanguage.ua.content || null,

						status: sendStatus,

						total_recipients: subscribers.length,
						successful,
						failed,

						results,
					})
					.select("id")
					.single();

				if (sendError) {
					throw sendError;
				}

				sendId = newsletterSend.id;
			}

			return new Response(
				JSON.stringify({
					success: failed === 0,

					isTest,

					campaignId: savedCampaignId,
					sendId,

					type,
					audience,
					requiredInterest,

					skus,
					itemId,
					reminderDate,

					totalRecipients: subscribers.length,

					successful,
					failed,

					results,
				}),
				{
					status: failed === 0 ? 200 : 207,

					headers: {
						...corsHeaders,
						"Content-Type": "application/json",
					},
				},
			);
		} catch (error) {
			console.error("send-newsletter error:", error);

			return new Response(
				JSON.stringify({
					error: error instanceof Error ? error.message : "Unknown error",
				}),
				{
					status: 500,

					headers: {
						...corsHeaders,
						"Content-Type": "application/json",
					},
				},
			);
		}
	},
};

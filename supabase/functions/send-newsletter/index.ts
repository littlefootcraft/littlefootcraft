import { createClient } from "npm:@supabase/supabase-js@2";

import { newsletterTemplate } from "../_shared/email/newsletterTemplate.js";
import { masterClassNewsletterTemplate } from "../_shared/email/masterClassNewsletterTemplate.js";

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers":
		"authorization, x-client-info, apikey, content-type",
};

// ---------------------------------------
// NEWSLETTER TYPE → DEFAULT INTEREST
// ---------------------------------------
const campaignInterestMap: Record<string, string> = {
	"new-items": "sales",
	sale: "sales",
	"new-master-class": "workshops",
	"master-class-reminder": "workshops",
};

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

	"new-master-class": {
		en: {
			subject: "A new LittleFootCraft master class is here ✨",
			title: "New Master Class",
			message:
				"Join us for a creative LittleFootCraft master class and discover something new.",
			buttonText: "View master class",
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

				subjectEN = "",
				contentEN = "",

				subjectUA = "",
				contentUA = "",
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
				"new-master-class",
				"master-class-reminder",
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
			// MASTER CLASS
			// ---------------------------------------
			let selectedWorkshop = null;
			let reminderDate = null;

			if (type === "new-master-class" || type === "master-class-reminder") {
				if (!itemId) {
					return new Response(
						JSON.stringify({
							error: "Master class ID is required.",
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
							error: "Master class was not found.",
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
			}

			// ---------------------------------------
			// MASTER CLASS REMINDER DATE
			// ---------------------------------------
			if (type === "master-class-reminder") {
				const today = new Date();

				today.setHours(0, 0, 0, 0);

				const futureDates =
					selectedWorkshop.upcomingDates?.dates
						?.map((date) => ({
							raw: date,
							value: new Date(`${date}T00:00:00`),
						}))
						.filter((date) => date.value >= today)
						.sort((a, b) => a.value.getTime() - b.value.getTime()) ?? [];

				if (futureDates.length === 0) {
					return new Response(
						JSON.stringify({
							error: "This master class has no upcoming dates.",
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

				reminderDate = futureDates[0].raw;
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
			// ALL SUBSCRIBERS
			// ---------------------------------------
			if (audience === "all") {
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
			if (audience === "interest") {
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
			if (audience === "other") {
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
					language: "en",
					interests: [],
					isManualRecipient: true,
				}));
			}

			// ---------------------------------------
			// EXCLUDE PEOPLE WHO ALREADY BOOKED
			// ---------------------------------------
			if (type === "master-class-reminder") {
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
			// RESEND
			// ---------------------------------------
			const resendApiKey = Deno.env.get("RESEND_API_KEY");

			if (!resendApiKey) {
				throw new Error("RESEND_API_KEY is missing.");
			}

			const results = [];

			// ---------------------------------------
			// SEND ONE EMAIL PER RECIPIENT
			// ---------------------------------------
			for (const subscriber of subscribers) {
				const language = subscriber.language === "ua" ? "ua" : "en";

				let html = "";
				let subject = "";

				const customSubject =
					language === "ua"
						? String(subjectUA).trim()
						: String(subjectEN).trim();

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

					html = newsletterTemplate({
						type,
						title: text.title,

						message: customContent || text.message,

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
				// MASTER CLASS NEWSLETTER
				// ---------------------------------------
				if (type === "new-master-class" || type === "master-class-reminder") {
					const defaultText =
						type === "new-master-class"
							? campaignContent["new-master-class"]?.[language]
							: null;

					html = masterClassNewsletterTemplate({
						type,
						workshop: selectedWorkshop,
						language,
						reminderDate,

						subscriberId: subscriber.id,

						customMessage: customContent || defaultText?.message || "",
					});

					if (customSubject) {
						subject = customSubject;
					} else if (type === "new-master-class") {
						subject =
							defaultText?.subject ||
							(language === "ua"
								? `Новий майстер-клас: ${selectedWorkshop.title.ua}`
								: `New Master Class: ${selectedWorkshop.title.en}`);
					} else {
						subject =
							language === "ua"
								? `${selectedWorkshop.title.ua} — уже скоро`
								: `${selectedWorkshop.title.en} — coming soon`;
					}
				}

				if (!subject || !html) {
					throw new Error("Newsletter subject or HTML could not be generated.");
				}

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

			return new Response(
				JSON.stringify({
					success: failed === 0,

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

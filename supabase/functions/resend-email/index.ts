import { subscriptionTemplate } from "../_shared/email/subscriptionTemplate.js";

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers":
		"authorization, x-client-info, apikey, content-type",
};

export default {
	async fetch(req: Request) {
		if (req.method === "OPTIONS") {
			return new Response("ok", {
				headers: corsHeaders,
			});
		}

		try {
			const { type, email, language, interests, subscriberId } =
				await req.json();

			if (type !== "subscription") {
				return new Response(
					JSON.stringify({
						error: "Unsupported email type.",
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

			if (!email) {
				return new Response(
					JSON.stringify({
						error: "Email is required.",
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

			const { subject, html } = subscriptionTemplate({
				language,
				interests,
				subscriberId,
			});

			const resendApiKey = Deno.env.get("RESEND_API_KEY");

			if (!resendApiKey) {
				throw new Error("RESEND_API_KEY is missing.");
			}

			const resendResponse = await fetch("https://api.resend.com/emails", {
				method: "POST",

				headers: {
					Authorization: `Bearer ${resendApiKey}`,
					"Content-Type": "application/json",
				},

				body: JSON.stringify({
					from: "LittleFootCraft <info@littlefootcraft.art>",
					to: [email],
					subject,
					html,
					reply_to: "littlefootcraft@gmail.com",
				}),
			});

			const resendData = await resendResponse.json();

			if (!resendResponse.ok) {
				console.error("Subscription confirmation email error:", resendData);

				return new Response(
					JSON.stringify({
						error: "Failed to send confirmation email.",
						details: resendData,
					}),
					{
						status: resendResponse.status,
						headers: {
							...corsHeaders,
							"Content-Type": "application/json",
						},
					},
				);
			}

			return new Response(
				JSON.stringify({
					success: true,
					data: resendData,
				}),
				{
					status: 200,
					headers: {
						...corsHeaders,
						"Content-Type": "application/json",
					},
				},
			);
		} catch (error) {
			console.error("resend-email error:", error);

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

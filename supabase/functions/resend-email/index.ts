import { subscriptionTemplate } from "../_shared/email/subscriptionTemplate.js";

export default {
	async fetch(req: Request) {
		try {
			const { type, email, language, interests, subscriberId } =
				await req.json();

			if (!email) {
				return new Response(
					JSON.stringify({
						error: "Email is required.",
					}),
					{
						status: 400,
						headers: {
							"Content-Type": "application/json",
						},
					},
				);
			}

			let subject;
			let html;

			if (type === "subscription") {
				const template = subscriptionTemplate({
					language,
					interests,
					subscriberId,
				});

				subject = template.subject;
				html = template.html;
			} else {
				return new Response(
					JSON.stringify({
						error: "Unsupported email type.",
					}),
					{
						status: 400,
						headers: {
							"Content-Type": "application/json",
						},
					},
				);
			}

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
				console.error("Resend error:", resendData);

				return new Response(
					JSON.stringify({
						error: "Failed to send email.",
						details: resendData,
					}),
					{
						status: resendResponse.status,
						headers: {
							"Content-Type": "application/json",
						},
					},
				);
			}

			return Response.json({
				success: true,
				data: resendData,
			});
		} catch (error) {
			console.error("resend-email error:", error);

			return Response.json(
				{
					error: error instanceof Error ? error.message : "Unknown error",
				},
				{
					status: 500,
				},
			);
		}
	},
};

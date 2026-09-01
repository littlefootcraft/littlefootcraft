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
			const { to, subject, html } = await req.json();

			if (!to) {
				return new Response(
					JSON.stringify({
						error: "Recipient email is required.",
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

			if (!subject || !html) {
				return new Response(
					JSON.stringify({
						error: "Subject and HTML are required.",
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
					to: [to],
					subject,
					html,
					reply_to: "littlefootcraft@gmail.com",
				}),
			});

			const resendData = await resendResponse.json();

			if (!resendResponse.ok) {
				console.error("Resend order email error:", resendData);

				return new Response(
					JSON.stringify({
						error: "Failed to send order email.",
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
			console.error("send-order-email error:", error);

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

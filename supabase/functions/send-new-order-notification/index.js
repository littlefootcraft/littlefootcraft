import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { Resend } from "npm:resend";

import { createNewOrderNotificationEmail } from "../_shared/email/newOrderNotificationEmail.js";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers":
		"authorization, x-client-info, apikey, content-type",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
	if (req.method === "OPTIONS") {
		return new Response("ok", {
			headers: corsHeaders,
		});
	}

	try {
		const payload = await req.json();

		if (!payload.orderId || !payload.orderNumber) {
			return new Response(
				JSON.stringify({
					error: "Order ID and order number are required.",
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

		const { subject, html } = createNewOrderNotificationEmail({
			...payload,
			shippingCost: Number(payload.shippingTotal ?? 0),
			giftPostcardPrice: Number(payload.giftPostcardPrice ?? 0),
		});

		const { data, error } = await resend.emails.send({
			from: "LittleFootCraft <info@littlefootcraft.art>",

			to: ["happytravels38@gmail.com"], // TEMPORARY TEST CHANGE EMAIL

			replyTo: payload.email || "littlefootcraft@gmail.com",

			subject,
			html,
		});

		if (error) {
			console.error("Owner notification email error:", error);

			return new Response(
				JSON.stringify({
					error: error.message,
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

		return new Response(
			JSON.stringify({
				success: true,
				data,
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
		console.error("Owner notification function failed:", error);

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
});

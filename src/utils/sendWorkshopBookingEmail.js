//sendWorkshopBookingEmail.js

import { supabase } from "../lib/supabaseClient";
import { formatPrice } from "./formatPrice";

import {
	workshopConfirmationEmailEN,
	workshopConfirmationEmailUA,
} from "../translations/translation";

export const sendWorkshopBookingEmail = async ({
	to,
	workshopTitle,
	workshopLocation,
	workshopTime,
	selectedDate,
	workshopPrice,
	workshopTimezone,
	participantsCount,
	currentLang,
	cancelUrl,
}) => {
	const emailDict =
		currentLang === "ua"
			? workshopConfirmationEmailUA
			: workshopConfirmationEmailEN;

	const html = `
		<div style="font-family: Verdana, sans-serif; background:#fdfbf7; padding:32px;">
			<div style="max-width:600px; margin:0 auto; background:#ffffff; border:1px solid rgba(212,175,55,.35); border-radius:18px; padding:32px;">
				<div style="text-align:center; margin-bottom:18px;">
					<img
						src="https://littlefootcraft.art/uploads/images/logo.png"
						alt="LittleFootCraft"
						style="width:180px; height:auto;"
					/>
				</div>

				<h1 style="color:#1a2b4c; margin:0 0 18px; font-size:28px; text-align:center;">
					${emailDict.title}
				</h1>

				<p style="color:#4a5568; font-size:16px; line-height:1.6;">
					${emailDict.greeting}
				</p>

				<p style="color:#4a5568; font-size:16px; line-height:1.6;">
					${emailDict.intro}
				</p>

				<p style="color:#4a5568; font-size:16px; line-height:1.6;">
					${emailDict.notConfirmed}
				</p>

				<div style="background:#f4f1ea; border-radius:14px; padding:18px; margin:22px 0;">
					<p style="margin:0 0 8px; color:#1a2b4c;">
						<strong>${emailDict.workshop}:</strong> ${workshopTitle}
					</p>

          <p style="margin:0 0 8px; color:#1a2b4c;">
	          <strong>${emailDict.location}:</strong> ${workshopLocation}
          </p>
					<p style="margin:0 0 8px; color:#1a2b4c;">
						<strong>${emailDict.time}:</strong> ${workshopTime}${
							workshopTimezone ? ` (${workshopTimezone})` : ""
						}
					</p>
          <p style="margin:0 0 8px; color:#1a2b4c;">
            <strong>${emailDict.price}:</strong>
            ${
							Number(workshopPrice) === 0
								? currentLang === "ua"
									? "Безкоштовно"
									: "Free"
								: formatPrice(workshopPrice)
						}
          </p>

					<p style="margin:0 0 8px; color:#1a2b4c;">
						<strong>${emailDict.dateRequested}:</strong> ${selectedDate}
					</p>

					<p style="margin:0; color:#1a2b4c;">
						<strong>${emailDict.participants}:</strong> ${participantsCount}
					</p>
          
				</div>

        ${
					Number(workshopPrice) !== 0
						? `<div style="background:#fdfbf7; border:1px solid rgba(212,175,55,.25); border-radius:14px; padding:18px; margin:22px 0;">
              <h2 style="color:#1a2b4c; font-size:18px; margin:0 0 12px;">
                ${emailDict.cancellationPolicyTitle}
              </h2>

              <ul style="color:#4a5568; font-size:15px; line-height:1.6; padding-left:20px; margin:0;">
                ${emailDict.cancellationPolicy
									.map((item) => `<li style="margin-bottom:6px;">${item}</li>`)
									.join("")}
              </ul>

              ${
								cancelUrl
									? `<p style="text-align:center; margin:14px 0 0;">
                    <a
                      href="${cancelUrl}"
                      style="color:#4a5568; text-decoration:underline; font-size:14px;"
                    >
                      ${emailDict.cancelBooking}
                    </a>
                  </p>`
									: ""
							}
            </div>`
						: ""
				}

				<p style="color:#4a5568; font-size:16px; line-height:1.6;">
					${emailDict.questions}
				</p>

				<p style="color:#4a5568; font-size:16px; line-height:1.6;">
					${emailDict.thankYou}
				</p>

				<p style="color:#1a2b4c; font-size:16px; line-height:1.6; margin-top:24px;">
					${emailDict.signature}<br />
					<strong>${emailDict.team}</strong>
				</p>
			</div>
		</div>
	`;

	return supabase.functions.invoke("resend-email", {
		body: {
			to,
			subject: emailDict.subject,
			html,
		},
	});
};

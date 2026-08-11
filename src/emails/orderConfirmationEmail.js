import { formatPrice } from "../utils/formatPrice";

export const createOrderConfirmationEmail = ({
	cartProducts,
	currentLang,
	totalWithExtras,
	orderNumber,
	t,
}) => {
	const subject =
		currentLang === "ua"
			? "Ми отримали ваше замовлення ✨"
			: "We received your order request ✨";

	const orderItemsHtml = cartProducts
		.map((product) => {
			const imageUrl = product.photo?.[0]?.src?.startsWith("http")
				? product.photo[0].src
				: `https://littlefootcraft.art${product.photo?.[0]?.src}`;

			return `
			<li style="list-style:none; margin-bottom:18px; padding-bottom:16px;">
				<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
					<tr>
						<td width="90" style="vertical-align:top;">
							<img
								src="${imageUrl}"
								alt="${t(product.name)}"
								style="width:74px; height:74px; object-fit:cover; border-radius:12px; display:block;"
							/>
						</td>

						<td style="vertical-align:top; color:#4a5568; font-size:14px; line-height:1.5;">
							<strong style="color:#1a2b4c; font-size:15px;">
								${t(product.name)}
							</strong>
							<br />
							<span style="color:#9ca3af;">
								SKU: ${product.sku} | Qty: ${product.quantity}
							</span>
							<br />
							<strong style="color:#1a2b4c;">
								${formatPrice(product.price * product.quantity)}
							</strong>
						</td>
					</tr>
				</table>
			</li>
		`;
		})
		.join("");

	const html = `
		<div style="font-family: Verdana, sans-serif; background:#fdfbf7; padding:32px;">
			<div style="max-width:600px; margin:0 auto; background:#ffffff; border:1px solid rgba(212,175,55,.35); border-radius:18px; padding:32px;">
				<div style="text-align:center; margin-bottom:12px;">
					<img src="https://littlefootcraft.art/uploads/images/logo.png" alt="LittleFootCraft" style="width:180px; height:auto;" />
				</div>

				<h1 style="color:#1a2b4c; margin:0 0 16px; font-size:28px; text-align:center;">
					${subject}
				</h1>
				${
					orderNumber
						? `
							<div style="margin:22px 0; padding:14px 18px; background:rgba(212,175,55,.08); border:1px solid rgba(212,175,55,.25); border-radius:14px;">
								<p style="margin:0; color:#9ca3af; font-size:12px; letter-spacing:.12em; text-transform:uppercase;">
									${currentLang === "ua" ? "Номер замовлення" : "Order number"}
								</p>
								<p style="margin:6px 0 0; color:#1a2b4c; font-size:20px; font-weight:bold;">
									${orderNumber}
								</p>
							</div>
						`
						: ""
				}

				<p style="color:#4a5568; font-size:16px; line-height:1.6;">
					${
						currentLang === "ua"
							? "Дякуємо за ваше замовлення. Ваш запит отримано, але він ще не підтверджений."
							: "Thank you for your order. Your request has been received, but it is not confirmed yet."
					}
				</p>

				<p style="color:#4a5568; font-size:16px; line-height:1.6;">
					${
						currentLang === "ua"
							? "Ми перевіримо наявність товарів, вартість доставки та зв’яжемося з вами з деталями оплати."
							: "We will check availability, shipping cost, and contact you with payment details."
					}
				</p>

				<p style="color:#1a2b4c; font-weight:bold; font-size:16px;">
					${currentLang === "ua" ? "Ваше замовлення:" : "Your order:"}
				</p>

				<ul style="margin-top:8px; padding-left:0; color:#4a5568;">
					${orderItemsHtml}
				</ul>

				<div style="border-top:1px solid rgba(212,175,55,.25); margin-top:20px; padding-top:16px;">
					<p style="color:#1a2b4c; font-size:18px; font-weight:bold; margin:0;">
						${currentLang === "ua" ? "Разом:" : "Total:"} ${formatPrice(totalWithExtras)}
					</p>
				</div>

				<p style="color:#9ca3af; font-size:12px; margin-top:28px; text-align:center;">
					${
						currentLang === "ua"
							? `Якщо у вас є питання, просто дайте відповідь на цей лист або напишіть нам на
						<a href="mailto:littlefootcraft@gmail.com" style="color:#9ca3af;">
							littlefootcraft@gmail.com
						</a>.`
							: `If you have any questions, simply reply to this email or contact us at
						<a href="mailto:littlefootcraft@gmail.com" style="color:#9ca3af;">
							littlefootcraft@gmail.com
						</a>.`
					}
				</p>
			</div>
		</div>
	`;

	return { subject, html };
};

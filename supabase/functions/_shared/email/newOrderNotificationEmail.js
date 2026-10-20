import { emailLayout } from "./layout.js";

const SITE_URL = "https://littlefootcraft.art";

const getImageUrl = (src) => {
	if (!src) return null;

	try {
		const url = new URL(src, SITE_URL);

		return ["http:", "https:"].includes(url.protocol) ? url.href : null;
	} catch {
		return null;
	}
};

const formatMoney = (amount, currency = "EUR") => {
	return new Intl.NumberFormat("en-IE", {
		style: "currency",
		currency,
	}).format(Number(amount || 0));
};

const getItemName = (item) => {
	if (!item) return "Product";

	if (typeof item.name === "string") {
		return item.name;
	}

	if (item.name?.en) {
		return item.name.en;
	}

	if (typeof item.title === "string") {
		return item.title;
	}

	if (item.title?.en) {
		return item.title.en;
	}

	return "Product";
};

export const createNewOrderNotificationEmail = ({
	orderId,
	orderNumber,
	customerName,
	email,
	phone,
	country,
	city,
	street,
	apartment,
	zipCode,
	comment,
	items = [],
	total,
	shippingCost = 0,
	giftPostcard = false,
	giftPostcardPrice = 0,
	giftNote = "",
	currency = "EUR",
}) => {
	const crmUrl = `${SITE_URL}/crm/orders/${orderId}`;

	const itemsHtml = items
		.map((item) => {
			const quantity = Number(item.quantity || 1);
			const price = Number(item.price || 0);

			const imageSrc = item.photo?.[0]?.src;

			const imageUrl = getImageUrl(imageSrc);

			const imageAlt = item.photo?.[0]?.alt?.en || getItemName(item);

			return `
      <tr>
        <td
          style="
            padding: 14px 0;
            border-bottom: 1px solid rgba(26, 43, 76, 0.1);
          "
        >
          <table
            role="presentation"
            cellpadding="0"
            cellspacing="0"
            style="
              width: 100%;
              border-collapse: collapse;
            "
          >
            <tbody>
              <tr>
                ${
									imageUrl
										? `
                      <td
                        width="90"
                        valign="top"
                        style="
                          width: 90px;
                          padding-right: 14px;
                        "
                      >
                        <img
                          src="${imageUrl}"
                          alt="${imageAlt}"
                          width="76"
                          height="76"
                          style="
                            display: block;
                            width: 76px;
                            height: 76px;
                            object-fit: cover;
                            border-radius: 6px;
                            border: 1px solid #e8e2d8;
                          "
                        >
                      </td>
                    `
										: ""
								}

                <td
                  valign="top"
                  style="
                    vertical-align: top;
                  "
                >
                  <div
                    style="
                      font-weight: 600;
                      color: #1a2b4c;
                      line-height: 1.5;
                    "
                  >
                    ${getItemName(item)}
                  </div>

                  ${
										item.sku
											? `
                        <div
                          style="
                            margin-top: 4px;
                            font-size: 13px;
                            color: #4a5568;
                          "
                        >
                          SKU: ${item.sku}
                        </div>
                      `
											: ""
									}

                  <table
                    role="presentation"
                    style="
                      width: 100%;
                      margin-top: 10px;
                      border-collapse: collapse;
                    "
                  >
                    <tbody>
                      <tr>
                        <td
                          style="
                            color: #4a5568;
                            font-size: 14px;
                          "
                        >
                          Qty: ${quantity}
                        </td>

                        <td
                          style="
                            text-align: right;
                            font-weight: 600;
                            color: #1a2b4c;
                            white-space: nowrap;
                          "
                        >
                          ${formatMoney(price * quantity, currency)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    `;
		})
		.join("");

	const content = `
		<p
			style="
				margin: 0 0 24px;
				color: #4a5568;
				line-height: 1.6;
			"
		>
			A new order request has been received and is ready for review.
		</p>

		<div
			style="
				margin-bottom: 24px;
				padding: 16px;
				text-align: center;
				background: #f4f1ea;
				border-radius: 8px;
			"
		>
			<div
				style="
					margin-bottom: 4px;
					font-size: 13px;
					color: #4a5568;
				"
			>
				Order number
			</div>

			<strong
				style="
					font-size: 18px;
					color: #1a2b4c;
				"
			>
				${orderNumber}
			</strong>
		</div>

		<h2
			style="
				margin: 24px 0 12px;
				font-size: 18px;
				color: #1a2b4c;
			"
		>
			Customer
		</h2>

		<p
			style="
				margin: 0;
				line-height: 1.7;
				color: #4a5568;
			"
		>
			<strong style="color: #1a2b4c;">
				${customerName || "—"}
			</strong>

			<br>

			${email || "—"}

			<br>

			${phone || "—"}
		</p>

		<h2
			style="
				margin: 24px 0 12px;
				font-size: 18px;
				color: #1a2b4c;
			"
		>
			Shipping address
		</h2>

		<p
			style="
				margin: 0;
				line-height: 1.7;
				color: #4a5568;
			"
		>
			${street || "—"}

			${apartment ? `<br>${apartment}` : ""}

			<br>

			${[city, zipCode].filter(Boolean).join(", ")}

			<br>

			${country || "—"}
		</p>

		<h2
			style="
				margin: 24px 0 12px;
				font-size: 18px;
				color: #1a2b4c;
			"
		>
			Items
		</h2>

		<table
			style="
				width: 100%;
				border-collapse: collapse;
			"
		>
			<tbody>
				${itemsHtml}
			</tbody>
		</table>

		<div
			style="
				margin-top: 24px;
				padding-top: 16px;
			"
		>
			<div
				style="
					display: flex;
					justify-content: space-between;
					margin-bottom: 8px;
				"
			>
				<span>Shipping&nbsp;</span>

				<strong>
					${formatMoney(shippingCost, currency)}
				</strong>
			</div>

			${
				giftPostcard
					? `
						<div
							style="
								display: flex;
								justify-content: space-between;
								margin-bottom: 8px;
							"
						>
							<span>Gift postcard&nbsp;</span>

							<strong>
								${formatMoney(giftPostcardPrice, currency)}
							</strong>
						</div>
					`
					: ""
			}

			<div
				style="
					display: flex;
					justify-content: space-between;
					font-size: 18px;
				"
			>
				<span>
					<strong>Total&nbsp;</strong>
				</span>

				<strong>
					${formatMoney(total, currency)}
				</strong>
			</div>
		</div>

		${
			giftPostcard
				? `
					<div
						style="
							margin-top: 24px;
							padding: 16px;
							background: #faf9f6;
							border-radius: 8px;
						"
					>
						<strong>
							Gift postcard requested
						</strong>

						${
							giftNote
								? `
									<p
										style="
											margin: 8px 0 0;
											line-height: 1.6;
											color: #4a5568;
										"
									>
										${giftNote}
									</p>
								`
								: ""
						}
					</div>
				`
				: ""
		}

		${
			comment
				? `
					<div
						style="
							margin-top: 24px;
							padding: 16px;
							background: #faf9f6;
							border-radius: 8px;
						"
					>
						<strong>
							Customer comment
						</strong>

						<p
							style="
								margin: 8px 0 0;
								line-height: 1.6;
								color: #4a5568;
							"
						>
							${comment}
						</p>
					</div>
				`
				: ""
		}
	`;

	return {
		subject: `New order ${orderNumber}`,

		html: emailLayout({
			title: "New order received",
			content,
			buttonText: "View order in CRM",
			buttonUrl: crmUrl,
		}),
	};
};

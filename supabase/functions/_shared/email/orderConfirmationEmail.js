import { emailLayout } from "../_shared/email/layout.js";

const formatMoney = (value) => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "EUR",
	}).format(Number(value || 0));
};

const getText = (field, language) => {
	if (!field) return "";

	if (typeof field === "string") {
		return field;
	}

	return field?.[language] ?? field?.en ?? "";
};

const getImage = (item) => {
	if (!Array.isArray(item?.photo) || item.photo.length === 0) {
		return "";
	}

	return item.photo[0]?.src || "";
};

export const createOrderConfirmationEmail = ({
	cartProducts,
	currentLang,
	totalWithExtras,
	orderNumber,
	giftPostcard = false,
	giftMessage = "",
}) => {
	const isUA = currentLang === "ua";

	const subject = isUA
		? `Ми отримали ваше замовлення ${orderNumber}`
		: `We received your order ${orderNumber}`;

	const text = isUA
		? {
				title: "Ми отримали ваше замовлення",
				intro:
					"Дякуємо, що обрали LittleFootCraft. Ваш запит на замовлення отримано, а вибрані товари вже зарезервовані для вас.",
				orderNumber: "Номер замовлення",
				reserved: "Ваші товари зарезервовані.",
				notPaid:
					"Замовлення ще не підтверджено, і оплата ще не проводилась. Ми перевіримо деталі доставки та зв’яжемося з вами з підтвердженням і інформацією про оплату.",
				yourOrder: "Ваше замовлення",
				qty: "Кількість",
				subtotal: "Товари",
				giftPostcard: "Подарункова листівка",
				giftTitle: "Подарункова листівка додана",
				giftMessage: "Текст листівки",
				total: "Разом",
				nextTitle: "Що буде далі?",
				next1: "Ми перевіримо ваше замовлення та адресу доставки.",
				next2: "Ви отримаєте підтвердження та інформацію для оплати.",
				next3:
					"Після оплати ми підготуємо ваші вироби ручної роботи до відправлення.",
				thankYou:
					"Дякуємо, що підтримуєте ручну роботу та маленький творчий бізнес.",
				signature: "З любов’ю,",
				team: "LittleFootCraft",
			}
		: {
				title: "We received your order request",
				intro:
					"Thank you for choosing LittleFootCraft. Your order request has been received and your selected items are now reserved for you.",
				orderNumber: "Order number",
				reserved: "Your items are reserved for you.",
				notPaid:
					"Your order is not confirmed yet and no payment has been taken. We will review the shipping details and contact you with confirmation and payment information.",
				yourOrder: "Your order",
				qty: "Qty",
				subtotal: "Items",
				giftPostcard: "Gift postcard",
				giftTitle: "Gift postcard included",
				giftMessage: "Postcard message",
				total: "Total",
				nextTitle: "What happens next?",
				next1: "We review your order and shipping destination.",
				next2: "You receive confirmation and payment details.",
				next3:
					"After payment, we prepare your handmade treasures for their journey to you.",
				thankYou:
					"Thank you for supporting handmade art and a small creative business.",
				signature: "With love,",
				team: "LittleFootCraft",
			};

	const itemsHtml = cartProducts
		.map((item) => {
			const name = getText(item.name, currentLang);
			const image = getImage(item);
			const quantity = Number(item.quantity || 1);
			const itemTotal = Number(item.price || 0) * quantity;

			return `
				<tr>
					<td
						style="
							padding: 14px 0;
							border-bottom: 1px solid rgba(26, 43, 76, 0.08);
						"
					>
						<table
							width="100%"
							cellpadding="0"
							cellspacing="0"
							role="presentation"
						>
							<tr>
								${
									image
										? `
											<td
												width="72"
												style="
													width: 72px;
													vertical-align: top;
													padding-right: 14px;
												"
											>
												<img
													src="${image}"
													alt="${name}"
													width="72"
													style="
														display: block;
														width: 72px;
														height: 72px;
														object-fit: cover;
														border-radius: 10px;
													"
												/>
											</td>
										`
										: ""
								}

								<td
									style="
										vertical-align: top;
										color: #1a2b4c;
									"
								>
									<div
										style="
											font-size: 16px;
											font-weight: 700;
											line-height: 1.4;
											margin-bottom: 5px;
										"
									>
										${name}
									</div>

									<div
										style="
											font-size: 13px;
											color: #4a5568;
											line-height: 1.6;
										"
									>
										SKU: ${item.sku}<br />
										${text.qty}: ${quantity}
									</div>
								</td>

								<td
									style="
										width: 90px;
										text-align: right;
										vertical-align: top;
										font-size: 16px;
										font-weight: 700;
										color: #1a2b4c;
									"
								>
									${formatMoney(itemTotal)}
								</td>
							</tr>
						</table>
					</td>
				</tr>
			`;
		})
		.join("");

	const itemsSubtotal = cartProducts.reduce(
		(sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
		0,
	);

	const giftPostcardPrice = giftPostcard ? 2 : 0;

	const content = `
		<p
			style="
				margin: 0 auto 24px;
				max-width: 500px;
				text-align: center;
				color: #4a5568;
				font-size: 16px;
				line-height: 1.7;
			"
		>
			${text.intro}
		</p>

		<div
			style="
				margin: 0 0 24px;
				padding: 18px 20px;
				background: #faf9f6;
				border: 1px solid rgba(212, 175, 55, 0.25);
				border-radius: 12px;
			"
		>
			<div
				style="
					margin-bottom: 6px;
					color: #4a5568;
					font-size: 12px;
					font-weight: 700;
					letter-spacing: 0.12em;
					text-transform: uppercase;
				"
			>
				${text.orderNumber}
			</div>

			<div
				style="
					color: #1a2b4c;
					font-size: 22px;
					font-weight: 700;
				"
			>
				${orderNumber}
			</div>
		</div>

		<div
			style="
				margin-bottom: 28px;
				padding: 18px 20px;
				background: #f4f1ea;
				border-radius: 12px;
			"
		>
			<p
				style="
					margin: 0 0 8px;
					color: #4f7a5d;
					font-size: 16px;
					font-weight: 700;
				"
			>
				✓ ${text.reserved}
			</p>

			<p
				style="
					margin: 0;
					color: #4a5568;
					font-size: 14px;
					line-height: 1.7;
				"
			>
				${text.notPaid}
			</p>
		</div>

		<h2
			style="
				margin: 0 0 8px;
				color: #1a2b4c;
				font-size: 18px;
			"
		>
			${text.yourOrder}
		</h2>

		<table
			width="100%"
			cellpadding="0"
			cellspacing="0"
			role="presentation"
			style="margin-bottom: 20px;"
		>
			${itemsHtml}
		</table>

<table
	width="100%"
	cellpadding="0"
	cellspacing="0"
	role="presentation"
	style="
		margin-top: 24px;
		font-size: 15px;
		color: #4a5568;
	"
>
	<tr>
		<td style="padding: 6px 0;">
			${currentLang === "ua" ? "Товари" : "Items"}
		</td>

		<td
			style="
				padding: 6px 0;
				text-align: right;
			"
		>
			€${itemsSubtotal.toFixed(2)}
		</td>
	</tr>

${
	giftPostcard
		? `
			<div
				style="
					margin-top: 22px;
					padding: 16px 18px;
					background: rgba(79, 122, 93, 0.08);
					border: 1px solid rgba(79, 122, 93, 0.18);
					border-radius: 10px;
				"
			>
				<strong style="color: #4f7a5d;">
					${
						currentLang === "ua"
							? "Подарункова листівка додана"
							: "Gift postcard included"
					}
				</strong>

				${
					giftMessage
						? `
							<p
								style="
									margin: 8px 0 0;
									color: #4a5568;
									line-height: 1.6;
								"
							>
								${currentLang === "ua" ? "Ваш текст:" : "Your message:"}
								“${giftMessage}”
							</p>
						`
						: ""
				}
			</div>
		`
		: ""
}

	<tr>
		<td
			style="
				padding: 14px 0 0;
				border-top: 1px solid rgba(212, 175, 55, 0.3);
				color: #1a2b4c;
				font-size: 18px;
				font-weight: 700;
			"
		>
			${currentLang === "ua" ? "Разом" : "Total"}
		</td>

		<td
			style="
				padding: 14px 0 0;
				border-top: 1px solid rgba(212, 175, 55, 0.3);
				text-align: right;
				color: #1a2b4c;
				font-size: 18px;
				font-weight: 700;
			"
		>
			€${Number(totalWithExtras).toFixed(2)}
		</td>
	</tr>
</table>

		${
			giftPostcard
				? `
					<div
						style="
							margin-bottom: 28px;
							padding: 18px 20px;
							background: rgba(79, 122, 93, 0.08);
							border: 1px solid rgba(79, 122, 93, 0.18);
							border-radius: 12px;
						"
					>
						<div
							style="
								margin-bottom: 8px;
								color: #4f7a5d;
								font-size: 16px;
								font-weight: 700;
							"
						>
							🎁 ${text.giftTitle}
						</div>

						${
							giftMessage
								? `
									<div
										style="
											color: #4a5568;
											font-size: 14px;
											line-height: 1.7;
										"
									>
										<strong>${text.giftMessage}:</strong><br />
										“${giftMessage}”
									</div>
								`
								: ""
						}
					</div>
				`
				: ""
		}

		<div
			style="
				margin-bottom: 28px;
				padding: 20px;
				background: #faf9f6;
				border-radius: 12px;
			"
		>
			<h2
				style="
					margin: 0 0 12px;
					color: #1a2b4c;
					font-size: 18px;
				"
			>
				${text.nextTitle}
			</h2>

			<p
				style="
					margin: 0 0 8px;
					color: #4a5568;
					font-size: 14px;
					line-height: 1.6;
				"
			>
				1. ${text.next1}
			</p>

			<p
				style="
					margin: 0 0 8px;
					color: #4a5568;
					font-size: 14px;
					line-height: 1.6;
				"
			>
				2. ${text.next2}
			</p>

			<p
				style="
					margin: 0;
					color: #4a5568;
					font-size: 14px;
					line-height: 1.6;
				"
			>
				3. ${text.next3}
			</p>
		</div>

		<p
			style="
				margin: 0;
				text-align: center;
				color: #4a5568;
				font-size: 14px;
				line-height: 1.7;
			"
		>
			${text.thankYou}<br /><br />
			${text.signature}<br />
			<strong style="color: #1a2b4c;">
				${text.team}
			</strong>
		</p>
	`;

	const html = emailLayout({
		title: text.title,
		content,
	});

	return {
		subject,
		html,
	};
};

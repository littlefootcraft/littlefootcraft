import { emailLayout } from "./layout.js";

export const newsletterTemplate = ({
	title,
	message,
	buttonText,
	buttonUrl,
	language,
	subscriberId,
	products = [],
}) => {
	const footerText =
		language === "ua"
			? "Ви отримали цей лист, тому що підписалися на новини LittleFootCraft."
			: "You received this email because you subscribed to LittleFootCraft updates.";

	const manageSubscriptionText =
		language === "ua" ? "Керувати підпискою" : "Manage subscription";

	const productsHtml = products.length
		? `
	<table
		role="presentation"
		width="100%"
		cellpadding="0"
		cellspacing="0"
		border="0"
		style="
			width: 100%;
			margin-top: 28px;
		"
	>
		<tbody>
			${Array.from({ length: Math.ceil(products.length / 3) }, (_, rowIndex) => {
				const rowProducts = products.slice(rowIndex * 3, rowIndex * 3 + 3);

				return `
						<tr>
							<td align="center">
								<table
									role="presentation"
									cellpadding="0"
									cellspacing="0"
									border="0"
									style="
										margin: 0 auto;
									"
								>
									<tbody>
										<tr>
											${rowProducts
												.map((product) => {
													const productName = product.name?.[language] ?? "";

													const imageSrc = product.photo?.[0]?.src ?? "";

													const imageAlt =
														product.photo?.[0]?.alt?.[language] ??
														product.seo?.imageAlt?.[language] ??
														productName;

													const productUrl = `https://littlefootcraft.art/${language}/shop/${product.sku}`;

													return `
														<td
															width="176"
															valign="top"
															align="center"
															style="
																width: 176px;
																padding: 8px;
																vertical-align: top;
																text-align: center;
															"
														>
															<a
																href="${productUrl}"
																style="
																	display: block;
																	text-decoration: none;
																	color: #1a2b4c;
																"
															>
																${
																	imageSrc
																		? `
																			<img
																				src="https://littlefootcraft.art${imageSrc}"
																				alt="${imageAlt}"
																				width="160"
																				height="200"
																				style="
																					display: block;
																					width: 160px;
																					height: 200px;
																					margin: 0 auto;
																					object-fit: contain;
																					background: #000000;
																					border-radius: 10px;
																				"
																			/>
																		`
																		: ""
																}

																<p
																	style="
																		color: #1a2b4c;
																		font-size: 14px;
																		font-weight: 600;
																		line-height: 1.35;
																		margin: 10px 0 0;
																		text-align: center;
																	"
																>
																	${productName}
																</p>
															</a>
														</td>
													`;
												})
												.join("")}
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
					`;
			}).join("")}
		</tbody>
	</table>
	`
		: "";

	const content = `
		<p
			style="
				color: #4a5568;
				font-size: 16px;
				line-height: 1.6;
				text-align: center;
				margin: 0 auto 28px;
				max-width: 520px;
			"
		>
			${message}
		</p>

		${productsHtml}
	`;

	const footer = subscriberId
		? `
			<p
				style="
					color: #9ca3af;
					font-size: 12px;
					margin-top: 28px;
					text-align: center;
				"
			>
				${footerText}
				<br />

				<a
					href="https://littlefootcraft.art/${language}/unsubscribe?id=${subscriberId}"
					style="
						color: #9ca3af;
						text-decoration: underline;
					"
				>
					${manageSubscriptionText}
				</a>
			</p>
		`
		: "";

	return emailLayout({
		title,
		content,
		buttonText,
		buttonUrl,
		footer,
	});
};

export const emailLayout = ({
	title,
	content,
	buttonText,
	buttonUrl,
	footer = "",
}) => {
	return `
		<div
			style="
				font-family: Verdana, sans-serif;
				background: #fdfbf7;
				padding: 32px;
			"
		>
			<div
				style="
					max-width: 600px;
					margin: 0 auto;
					background: #ffffff;
					border: 1px solid rgba(212, 175, 55, 0.35);
					border-radius: 18px;
					padding: 32px;
				"
			>
				<div style="text-align: center; margin-bottom: 12px;">
					<img
						src="https://littlefootcraft.art/uploads/images/logo.png"
						alt="LittleFootCraft"
						style="width: 180px; height: auto;"
					/>
				</div>

				<h1
					style="
						color: #1a2b4c;
						margin: 0 0 16px;
						font-size: 28px;
						text-align: center;
					"
				>
					${title}
				</h1>

				${content}

				${
					buttonText && buttonUrl
						? `
							<div style="text-align: center; margin-top: 24px;">
								<a
									href="${buttonUrl}"
									style="
										display: inline-block;
										padding: 12px 22px;
										background: #1a2b4c;
										color: #ffffff;
										text-decoration: none;
										border-radius: 999px;
										font-size: 15px;
									"
								>
									${buttonText}
								</a>
							</div>
						`
						: ""
				}

				${footer}
			</div>
		</div>
	`;
};

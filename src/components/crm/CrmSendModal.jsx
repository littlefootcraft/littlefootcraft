import { Send } from "lucide-react";

export const CrmSendModal = ({
	contentType,
	audience,
	interests,
	onClose,
	onConfirm,
}) => {
	return (
		<div
			className="crm-send-modal"
			role="presentation"
			onMouseDown={onClose}
		>
			<div
				className="crm-send-modal__content"
				role="dialog"
				aria-modal="true"
				aria-labelledby="send-newsletter-title"
				onMouseDown={(e) => e.stopPropagation()}
			>
				<div className="crm-send-modal__icon">
					<Send size={24} />
				</div>

				<h2
					id="send-newsletter-title"
					className="crm-send-modal__title"
				>
					Send newsletter?
				</h2>

				<p className="crm-send-modal__text">
					Please check the newsletter carefully before sending. Once sent, it
					cannot be recalled.
				</p>

				<div className="crm-send-modal__details">
					<p>
						<span>Newsletter type</span>

						<strong>
							{contentType === "new-items" && "New items"}
							{contentType === "workshop" && "Workshop"}
							{contentType === "workshop-reminder" && "Workshop reminder"}
							{contentType === "other" && "Other"}
						</strong>
					</p>
					<p>
						<span>Audience</span>

						<strong>
							{audience === "all" && "All subscribers"}
							{audience === "interest" && "By interest"}
							{audience === "other" && "Other recipients"}
						</strong>
					</p>

					{audience === "interest" && (
						<p>
							<span>
								{interests.length === 1
									? "Selected interest"
									: "Selected interests"}
							</span>

							<strong>
								{interests
									.map((interest) => {
										if (interest === "workshops") return "Workshops";
										if (interest === "sales") return "Sales";

										return interest;
									})
									.join(", ")}
							</strong>
						</p>
					)}
				</div>

				<div className="crm-send-modal__actions">
					<button
						type="button"
						className="crm-send-modal__cancel"
						onClick={onClose}
					>
						Cancel
					</button>

					<button
						type="button"
						className="crm-send-modal__confirm"
						onClick={onConfirm}
					>
						<Send size={18} />
						Confirm Send
					</button>
				</div>
			</div>
		</div>
	);
};

// import { Trash2 } from "lucide-react";

// export const CrmDeleteModal = ({
// 	campaign,
// 	deleteStatus,
// 	onClose,
// 	onConfirm,
// }) => {
// 	return (
// 		<div
// 			className="crm-delete-modal"
// 			role="presentation"
// 			onMouseDown={() => {
// 				if (deleteStatus !== "loading") {
// 					onClose();
// 				}
// 			}}
// 		>
// 			<div
// 				className="crm-delete-modal__content"
// 				role="dialog"
// 				aria-modal="true"
// 				aria-labelledby="delete-campaign-title"
// 				onMouseDown={(e) => e.stopPropagation()}
// 			>
// 				<div className="crm-delete-modal__icon">
// 					<Trash2 size={24} />
// 				</div>

// 				<h2
// 					id="delete-campaign-title"
// 					className="crm-delete-modal__title"
// 				>
// 					Delete campaign?
// 				</h2>

// 				<p className="crm-delete-modal__text">
// 					Are you sure you want to delete{" "}
// 					<strong>{campaign.campaign_name}</strong>?
// 				</p>

// 				<p className="crm-delete-modal__warning">
// 					This will permanently delete the campaign and all of its newsletter
// 					send history.
// 				</p>

// 				{deleteStatus === "error" && (
// 					<p className="crm-delete-modal__error">
// 						The campaign could not be deleted. Please try again.
// 					</p>
// 				)}

// 				<div className="crm-delete-modal__actions">
// 					<button
// 						type="button"
// 						className="crm-delete-modal__cancel-btn"
// 						onClick={onClose}
// 						disabled={deleteStatus === "loading"}
// 					>
// 						Cancel
// 					</button>

// 					<button
// 						type="button"
// 						className="crm-delete-modal__delete-btn"
// 						onClick={onConfirm}
// 						disabled={deleteStatus === "loading"}
// 					>
// 						{deleteStatus === "loading" ? "Deleting..." : "Delete campaign"}
// 					</button>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

import { Trash2 } from "lucide-react";

export const CrmDeleteModal = ({
	title,
	itemName,
	message,
	errorMessage = "The item could not be deleted. Please try again.",
	deleteStatus,
	onClose,
	onConfirm,
	confirmText = "Delete",
}) => {
	return (
		<div
			className="crm-delete-modal"
			role="presentation"
			onMouseDown={() => {
				if (deleteStatus !== "loading") {
					onClose();
				}
			}}
		>
			<div
				className="crm-delete-modal__content"
				role="dialog"
				aria-modal="true"
				aria-labelledby="delete-modal-title"
				onMouseDown={(e) => e.stopPropagation()}
			>
				<div className="crm-delete-modal__icon">
					<Trash2 size={24} />
				</div>

				<h2
					id="delete-modal-title"
					className="crm-delete-modal__title"
				>
					{title}
				</h2>

				<p className="crm-delete-modal__text">
					Are you sure you want to delete <strong>{itemName}</strong>?
				</p>

				<p className="crm-delete-modal__warning">{message}</p>

				{deleteStatus === "error" && (
					<p className="crm-delete-modal__error">{errorMessage}</p>
				)}

				<div className="crm-delete-modal__actions">
					<button
						type="button"
						className="crm-delete-modal__cancel-btn"
						onClick={onClose}
						disabled={deleteStatus === "loading"}
					>
						Cancel
					</button>

					<button
						type="button"
						className="crm-delete-modal__delete-btn"
						onClick={onConfirm}
						disabled={deleteStatus === "loading"}
					>
						{deleteStatus === "loading" ? "Deleting..." : confirmText}
					</button>
				</div>
			</div>
		</div>
	);
};

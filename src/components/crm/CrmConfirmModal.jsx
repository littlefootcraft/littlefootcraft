export const CrmConfirmModal = ({
	icon: Icon,
	title,
	text,
	details = [],
	cancelText = "Cancel",
	confirmText = "Confirm",
	loadingText = "Processing...",
	isLoading = false,
	onClose,
	onConfirm,
}) => {
	const handleClose = () => {
		if (isLoading) return;

		onClose();
	};

	return (
		<div
			className="crm-confirm-modal"
			role="presentation"
			onMouseDown={handleClose}
		>
			<div
				className="crm-confirm-modal__content"
				role="dialog"
				aria-modal="true"
				aria-labelledby="crm-confirm-modal-title"
				onMouseDown={(e) => e.stopPropagation()}
			>
				{Icon && (
					<div className="crm-confirm-modal__icon">
						<Icon size={24} />
					</div>
				)}

				<h2
					id="crm-confirm-modal-title"
					className="crm-confirm-modal__title"
				>
					{title}
				</h2>

				{text && <p className="crm-confirm-modal__text">{text}</p>}

				{details.length > 0 && (
					<div className="crm-confirm-modal__details">
						{details.map((detail, index) => (
							<p key={`${detail.label}-${index}`}>
								<span>{detail.label}</span>

								<strong>{detail.value}</strong>
							</p>
						))}
					</div>
				)}

				<div className="crm-confirm-modal__actions">
					<button
						type="button"
						className="crm-confirm-modal__cancel"
						onClick={handleClose}
						disabled={isLoading}
					>
						{cancelText}
					</button>

					<button
						type="button"
						className="crm-confirm-modal__confirm"
						onClick={onConfirm}
						disabled={isLoading}
					>
						{Icon && <Icon size={18} />}

						{isLoading ? loadingText : confirmText}
					</button>
				</div>
			</div>
		</div>
	);
};

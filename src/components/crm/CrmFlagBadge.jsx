// src/components/crm/CrmFlagBadge.jsx

export const CrmFlagBadge = ({
	children,
	variant = "default",
	className = "",
}) => {
	return (
		<span
			className={`crm-flag-badge crm-flag-badge--${variant} ${className}`.trim()}
		>
			{children}
		</span>
	);
};

// SecondaryBtn.jsx

import { Link } from "react-router-dom";
import { Filter, ShoppingBag } from "lucide-react";

const BUTTON_CONFIG = {
	"to-cart": {
		icon: <ShoppingBag />,
		iconPosition: "left",
	},

	"to-other-page": {
		// icon: <FaWandMagicSparkles />,
		// iconPosition: "left",
	},
	filter: { icon: <Filter size={20} />, iconPosition: "left" },
	unsibscribe: {},
};

export const SecondaryBtn = ({
	children,
	variant = "to-cart",
	type = "button",
	onClick,
	disabled = false,
	className = "",
	to,
}) => {
	const config = BUTTON_CONFIG[variant];
	const icon = config?.icon;
	const iconPosition = config?.iconPosition ?? "left";

	const classes = `secondary-button secondary-button--${variant} shared-shadow ${className}`;

	const content = (
		<>
			{icon && iconPosition === "left" && (
				<span className="secondary-button__icon">{icon}</span>
			)}

			<span className="secondary-button__label">{children}</span>

			{icon && iconPosition === "right" && (
				<span className="secondary-button__icon">{icon}</span>
			)}
		</>
	);

	if (to) {
		return (
			<Link
				to={to}
				className={classes}
			>
				{content}
			</Link>
		);
	}
	return (
		<button
			type={type}
			className={classes}
			onClick={onClick}
			disabled={disabled}
		>
			{content}
		</button>
	);
};

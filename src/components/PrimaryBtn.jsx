//PrimaryBtn.jsx

import { Link } from "react-router-dom";

import { ArrowRight, LogIn, WandSparkles } from "lucide-react";

const BUTTON_CONFIG = {
	order: {
		icon: <ArrowRight size={20} />,
		iconPosition: "right",
	},

	"add-to-cart": {
		// icon: <IoArrowForwardOutline size={20} />,
		iconPosition: "right",
	},
	login: {
		icon: <LogIn size={20} />,
		iconPosition: "left",
	},
	register: {
		icon: <LogIn size={20} />,
		iconPosition: "left",
	},
};

export const PrimaryBtn = ({
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

	const classes = `primary-button primary-button--${variant} shared-shadow ${className}`;

	const content = (
		<>
			{icon && iconPosition === "left" && (
				<span className="primary-button__icon">{icon}</span>
			)}

			<span className="primary-button__label">{children}</span>

			{icon && iconPosition === "right" && (
				<span className="primary-button__icon">{icon}</span>
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

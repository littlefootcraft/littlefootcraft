//PrimaryBtn.jsx

import { LuShoppingBag } from "react-icons/lu";
import { IoArrowForwardOutline } from "react-icons/io5";
import { HiOutlineLogin } from "react-icons/hi";
import { FiLogIn } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { FaWandSparkles } from "react-icons/fa6";

const BUTTON_CONFIG = {
	// "to-cart": {
	// 	icon: <LuShoppingBag size={20} />,
	// 	iconPosition: "left",
	// },
	// order: {
	// 	icon: <IoArrowForwardOutline size={20} />,
	// 	iconPosition: "right",
	// },
	// login: {
	// 	icon: <HiOutlineLogin size={20} />,
	// 	iconPosition: "left",
	// },
	// register: {
	// 	icon: <FiLogIn size={20} />,
	// 	iconPosition: "left",
	// },
	// confirm: {
	// 	iconPosition: "left",
	// },
	subscription: { icon: <FaWandSparkles />, iconPosition: "right" },
	footer: { icon: <FaWandSparkles />, iconPosition: "right" },

	"to-catalog": {
		icon: <FaWandMagicSparkles />,
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

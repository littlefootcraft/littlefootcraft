//Badge.jsx

export const Badge = ({ children, variant, shape, className }) => {
	return (
		<span className={`badge badge--${variant} badge--${shape} ${className}`}>
			{children}
		</span>
	);
};

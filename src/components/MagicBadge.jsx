//MagicBadge.jsx

const MagicBadge = ({ children, className = "" }) => {
	return <div class={`magic-badge ${className}`}>{children}</div>;
};

export default MagicBadge;

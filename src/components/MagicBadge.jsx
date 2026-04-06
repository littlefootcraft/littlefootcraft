//MagicBadge.jsx

const MagicBadge = ({ children, className = "" }) => {
	return <div className={`magic-badge ${className}`}>{children}</div>;
};

export default MagicBadge;

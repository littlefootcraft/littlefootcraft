//SaleBadge.jsx

const SaleBadge = ({ children, className = "" }) => {
	return <div className={`sale-badge ${className}`}>{children}</div>;
};

export default SaleBadge;

//PageTopTitle.jsx

export const PageTopTitle = ({ title, subtitle }) => {
	return (
		<div className="page-top-title">
			<div className="container">
				<h1 className="page-top-title__title">{title}</h1>
				<span className="page-top-title__text text">{subtitle}</span>
			</div>
		</div>
	);
};

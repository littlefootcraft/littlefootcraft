//ProsessSection.jsx

export const ProcessSection = ({
	title,
	text,
	titleOne,
	textOne,
	titleTwo,
	textTwo,
	titleThree,
	textThree,
}) => {
	return (
		<section className="process-section">
			<div className="container">
				<div className="process-section__header">
					<h2 className="process-section__title main-title">{title}</h2>
					{text && <p className="process-section__text">{text}</p>}
				</div>
				<ul className="process-section__steps">
					<li className="process-section__step">
						<span className="process-section__number">1</span>
						<h3 className="process-section__step-title">{titleOne}</h3>
						<p className="process-section__step-text">{textOne}</p>
					</li>
					<li className="process-section__step">
						<span className="process-section__number">2</span>
						<h3 className="process-section__step-title">{titleTwo}</h3>
						<p className="process-section__step-text">{textTwo}</p>
					</li>
					<li className="process-section__step">
						<span className="process-section__number">3</span>
						<h3 className="process-section__step-title">{titleThree}</h3>
						<p className="process-section__step-text">{textThree}</p>
					</li>
				</ul>
			</div>
		</section>
	);
};

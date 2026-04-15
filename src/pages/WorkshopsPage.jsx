//WorkshopsPage.jsx
import { useMemo } from "react";
import WorkshopsPageContent from "../content/pages/workshops-page.json";
import WorkshopsEmptyState from "../components/WorkshopsEmptyState";

import { WorkshopCard } from "../components/WorkshopCard";
import { useWorkshops } from "../context/WorkshopsContext";
import { useLanguage } from "../context/LanguageContext";
import { getVisibleWorkshops } from "../hooks/useVisibleWorkshops";

const WorkshopsPage = () => {
	const workshops = useWorkshops();

	// For language switching
	const { currentLang } = useLanguage();
	const t = (field) => field?.[currentLang] ?? field?.en ?? "";

	// To show only active workshops

	const visibleWorkshops = useMemo(() => {
		return getVisibleWorkshops(workshops);
	}, [workshops]);

	return (
		<div className="workshops-page">
			<div className="workshops-page__top ">
				<div className="container">
					<h1 className="workshops-page__top-title">
						{t(WorkshopsPageContent.top.title)}
					</h1>
					<span className="workshops-page__top-text text">
						{t(WorkshopsPageContent.top.text)}
					</span>
				</div>
			</div>

			{visibleWorkshops.length === 0 ? (
				<div className="workshops-page__empty container">
					<WorkshopsEmptyState />
				</div>
			) : (
				<div className="workshops-page__cards container">
					{visibleWorkshops.map((workshop) => (
						<WorkshopCard
							key={workshop.id}
							workshop={workshop}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default WorkshopsPage;

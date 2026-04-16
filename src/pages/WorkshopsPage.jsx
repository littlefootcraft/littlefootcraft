//WorkshopsPage.jsx
import { useMemo } from "react";
import WorkshopsPageContent from "../content/pages/workshops-page.json";
import WorkshopsEmptyState from "../components/WorkshopsEmptyState";

import { WorkshopCard } from "../components/WorkshopCard";
import { useWorkshops } from "../context/WorkshopsContext";
import { useLanguage } from "../context/LanguageContext";
import { getVisibleWorkshops } from "../hooks/useVisibleWorkshops";
import { PageTopTitle } from "../components/PageTopTitle";

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
			<PageTopTitle
				title={t(WorkshopsPageContent.top.title)}
				subtitle={t(WorkshopsPageContent.top.text)}
			/>

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

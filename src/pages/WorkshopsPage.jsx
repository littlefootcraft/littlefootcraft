//WorkshopsPage.jsx
import { useMemo } from "react";
import { WorkshopCard } from "../components/WorkshopCard";
import WorkshopsEmptyState from "../components/WorkshopsEmptyState";
import { useWorkshops } from "../context/WorkshopsContext";
// import { useLanguage } from "../utils/LanguageContext";

const WorkshopsPage = () => {
	const workshops = useWorkshops();

	// To show only active workshops
	const visibleWorkshops = useMemo(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		return workshops
			.map((workshop) => {
				const futureDates = (workshop.upcomingDates ?? []).filter((date) => {
					const workshopDate = new Date(date);
					return workshopDate >= today;
				});

				return {
					...workshop,
					upcomingDates: futureDates,
				};
			})
			.filter((workshop) => {
				return workshop.isActive !== false && workshop.upcomingDates.length > 0;
			});
	}, [workshops]);

	return (
		<div className="workshops-page">
			<div className="workshops-page__top ">
				<div className="container">
					<h1 className="workshops-page__top-title">Enchanted Treasures</h1>
					<span className="workshops-page__top-text text">
						Each piece is handcrafted with care and imbued with magic. Find your
						perfect treasure.
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

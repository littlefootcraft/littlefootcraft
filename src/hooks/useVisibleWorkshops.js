// src/utils/getVisibleWorkshops.js
export const getVisibleWorkshops = (workshops) => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	return workshops
		.map((workshop) => {
			const futureDates = (workshop.upcomingDates?.dates ?? []).filter(
				(date) => {
					const workshopDate = new Date(date);
					return workshopDate >= today;
				},
			);

			return {
				...workshop,
				upcomingDates: {
					...workshop.upcomingDates,
					dates: futureDates,
				},
			};
		})
		.filter((workshop) => {
			return (
				workshop.isActive !== false && workshop.upcomingDates?.dates?.length > 0
			);
		})
		.sort((a, b) => {
			const firstDateA = new Date(a.upcomingDates.dates[0]);
			const firstDateB = new Date(b.upcomingDates.dates[0]);

			return firstDateA - firstDateB;
		});
};

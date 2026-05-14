export const validateWorkshops = (workshops) => {
	const ids = new Set();

	workshops.forEach((workshop) => {
		if (!workshop.id) {
			console.warn("Workshop is missing id:", workshop);
			return;
		}

		if (ids.has(workshop.id)) {
			console.warn(`Duplicate workshop id found: "${workshop.id}"`);
			return;
		}

		ids.add(workshop.id);
	});
};

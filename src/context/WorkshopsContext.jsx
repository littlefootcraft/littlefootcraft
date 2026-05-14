// src/context/WorkshopsContext.jsx

import { createContext, useContext, useMemo } from "react";
import { validateWorkshops } from "../utils/validateWorkshops";

export const WorkshopsContext = createContext([]);

export const WorkshopsProvider = ({ children }) => {
	const modules = import.meta.glob("../content/workshops/*.json", {
		eager: true,
	});

	const workshops = useMemo(() => {
		const loadedWorkshops = Object.values(modules).map((m) => m.default ?? m);

		if (import.meta.env.DEV) {
			validateWorkshops(loadedWorkshops);
		}

		return loadedWorkshops;
	}, []);

	return (
		<WorkshopsContext.Provider value={workshops}>
			{children}
		</WorkshopsContext.Provider>
	);
};

export const useWorkshops = () => {
	return useContext(WorkshopsContext);
};

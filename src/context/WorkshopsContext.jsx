//src/context/ProductsContext.js
import { createContext, useContext, useMemo } from "react";

export const WorkshopsContext = createContext([]);

export const WorkshopsProvider = ({ children }) => {
	// **/* -is for collecting all together from all folders of content folder
	// creates an object.
	const modules = import.meta.glob("../content/pages/workshops/*.json", {
		eager: true,
	});
	console.log("modules", modules);

	const workshops = useMemo(() => {
		return Object.values(modules).map((m) => m.default ?? m);
	}, [modules]);

	return (
		<WorkshopsContext.Provider value={workshops}>
			{children}
		</WorkshopsContext.Provider>
	);
};

export const useWorkshops = () => {
	return useContext(WorkshopsContext);
};

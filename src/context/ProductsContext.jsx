//src/context/ProductsContext.js
import { createContext, useContext, useMemo } from "react";

export const ProductsContext = createContext([]);

export const ProductsProvider = ({ children }) => {
	// **/* -is for collecting all together from all folders of content folder
	// creates an object.
	const modules = import.meta.glob("../content/**/*.json", { eager: true });

	const products = useMemo(() => {
		return Object.values(modules).map((m) => m.default ?? m);
	}, [modules]);
	// console.log("modules", modules);
	return (
		<ProductsContext.Provider value={products}>
			{children}
		</ProductsContext.Provider>
	);
};

export const useProducts = () => {
	return useContext(ProductsContext);
};

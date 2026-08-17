//src/context/ProductsContext.js
import { createContext, useContext, useMemo } from "react";

export const ProductsContext = createContext([]);

export const ProductsProvider = ({ children }) => {
	// **/* -is for collecting all together from all folders of content folder
	// creates an object.
	const modules = import.meta.glob("../content/shop/**/*.json", {
		eager: true,
	});

	const products = useMemo(() => {
		return Object.values(modules).map((m) => m.default ?? m);
	}, [modules]);

	return (
		<ProductsContext.Provider value={products}>
			{children}
		</ProductsContext.Provider>
	);
};

export const useProducts = () => {
	return useContext(ProductsContext);
};

// import { createContext, useContext, useEffect, useState } from "react";

// export const ProductsContext = createContext([]);

// export const ProductsProvider = ({ children }) => {
// 	const [products, setProducts] = useState([]);

// 	useEffect(() => {
// 		const loadProducts = async () => {
// 			try {
// 				const indexResponse = await fetch("/data/shop/products.json");

// 				const productPaths = await indexResponse.json();

// 				const productResponses = await Promise.all(
// 					productPaths.map((path) => fetch(path)),
// 				);

// 				const productData = await Promise.all(
// 					productResponses.map((response) => response.json()),
// 				);

// 				setProducts(productData);
// 			} catch (error) {
// 				console.error("Failed to load products:", error);
// 			}
// 		};

// 		loadProducts();
// 	}, []);

// 	return (
// 		<ProductsContext.Provider value={products}>
// 			{children}
// 		</ProductsContext.Provider>
// 	);
// };

// export const useProducts = () => {
// 	return useContext(ProductsContext);
// };

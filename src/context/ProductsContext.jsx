//src/context/ProductsContext.js
import { createContext, useContext, useEffect, useState } from "react";

export const ProductsContext = createContext([]);

const ProductsStatusContext = createContext({
	loading: true,
	error: null,
});

export const ProductsProvider = ({ children }) => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const controller = new AbortController();

		const loadProducts = async () => {
			try {
				const response = await fetch("/data/products.json", {
					signal: controller.signal,
				});

				if (!response.ok) {
					throw new Error(`Failed to load catalog: ${response.status}`);
				}

				const data = await response.json();

				if (
					!Array.isArray(data) ||
					!data.every((product) => product && typeof product.sku === "string")
				) {
					throw new Error("Invalid product catalog.");
				}

				if (!controller.signal.aborted) {
					setProducts(data);
				}
			} catch (err) {
				if (!controller.signal.aborted) {
					console.error("Catalog loading failed:", err);
					setError(err);
				}
			} finally {
				if (!controller.signal.aborted) {
					setLoading(false);
				}
			}
		};

		loadProducts();

		return () => controller.abort();
	}, []);

	return (
		<ProductsContext.Provider value={products}>
			<ProductsStatusContext.Provider value={{ loading, error }}>
				{children}
			</ProductsStatusContext.Provider>
		</ProductsContext.Provider>
	);
};

export const useProducts = () => useContext(ProductsContext);

export const useProductsStatus = () => useContext(ProductsStatusContext);

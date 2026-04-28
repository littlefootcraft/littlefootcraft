// src/context/WishlistContext.js
import { createContext, useContext, useState, useCallback } from "react";

// 1. Create the context — same as ProductsContext
//    But we store an object with both data AND functions
const WishlistContext = createContext({
	wishlist: [],
	toggleWishlist: () => {},
	isInWishlist: () => false,
});

// 2. Provider — same shape as ProductsProvider
export const WishlistProvider = ({ children }) => {
	// Load from localStorage on first render
	// If nothing saved yet, start with empty array
	const [wishlist, setWishlist] = useState(() => {
		try {
			const saved = localStorage.getItem("wishlist");
			return saved ? JSON.parse(saved) : [];
		} catch {
			return []; // if localStorage fails, just start empty
		}
	});

	// Toggle: if SKU is in wishlist → remove it. If not → add it.
	// Same logic as toggleFilter in useFilters — includes check, then add or remove
	const toggleWishlist = useCallback((sku) => {
		setWishlist((current) => {
			const updated = current.includes(sku)
				? current.filter((s) => s !== sku) // remove
				: [...current, sku]; // add

			// Save to localStorage every time it changes
			// So it survives page refresh
			localStorage.setItem("wishlist", JSON.stringify(updated));

			return updated;
		});
	}, []);

	// Helper — lets any component ask "is this SKU in the wishlist?"
	const isInWishlist = useCallback((sku) => wishlist.includes(sku), [wishlist]);

	return (
		<WishlistContext.Provider
			value={{ wishlist, toggleWishlist, isInWishlist }}
		>
			{children}
		</WishlistContext.Provider>
	);
};

// 3. Custom hook — same as useProducts()
export const useWishlist = () => {
	return useContext(WishlistContext);
};

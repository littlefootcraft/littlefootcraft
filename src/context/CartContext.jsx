// src/context/CartContext.jsx
import { createContext, useState, useContext, useCallback } from "react";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
	const [cartList, setCartList] = useState(() => {
		try {
			const saved = localStorage.getItem("cart");
			return saved ? JSON.parse(saved) : [];
		} catch {
			return [];
		}
	});

	const saveCart = (updatedCart) => {
		localStorage.setItem("cart", JSON.stringify(updatedCart));
		return updatedCart;
	};

	function addToCart({ sku, qty = 1 }) {
		setCartList((prev) => {
			const existingIndex = prev.findIndex((item) => item.sku === sku);

			const updated =
				existingIndex !== -1
					? prev.map((item, idx) =>
							idx === existingIndex ? { ...item, qty: item.qty + qty } : item,
						)
					: [...prev, { sku, qty }];

			return saveCart(updated);
		});
	}

	function removeFromCart({ sku }) {
		setCartList((prev) => {
			const idx = prev.findIndex((item) => item.sku === sku);
			if (idx === -1) return prev;
			const current = prev[idx];
			const updated =
				current.qty <= 1
					? prev.filter((_, i) => i !== idx)
					: prev.map((item, i) =>
							i === idx ? { ...item, qty: item.qty - 1 } : item,
						);
			return saveCart(updated);
		});
	}

	function deleteFromCart({ sku }) {
		setCartList((prev) => saveCart(prev.filter((item) => item.sku !== sku)));
	}

	const cartCount = cartList.reduce((sum, item) => sum + item.qty, 0);

	return (
		<CartContext.Provider
			value={{ cartList, addToCart, removeFromCart, deleteFromCart, cartCount }}
		>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => {
	return useContext(CartContext);
};

// src/hooks/useCartDetails.js
import { useMemo } from "react";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";
import { formatPrice } from "../utils/formatPrice";

export const useCartDetails = () => {
	const products = useProducts();
	const { cartList } = useCart();

	const cartProducts = useMemo(() => {
		return cartList
			.map((item) => {
				// Find the full product data by SKU
				const product = products.find((p) => p.sku === item.sku);
				if (!product) return null;

				const lineTotal = product.price * item.qty;
				const lineOldTotal = product.oldPrice
					? product.oldPrice * item.qty
					: null;
				const discountAmount = product.oldPrice
					? (product.oldPrice - product.price) * item.qty
					: 0;

				return {
					...item, // sku, qty
					name: product.name, // { en, ua }
					price: product.price,
					oldPrice: product.oldPrice ?? null,
					image: product.photo?.[0]?.src ?? null,
					specifications: product.specifications,
					lineTotal,
					lineOldTotal,
					discountAmount,
				};
			})
			.filter(Boolean); // remove any items whose product wasn't found
	}, [cartList, products]);

	// Total you actually pay
	const totalAmount = cartProducts.reduce(
		(sum, item) => sum + item.lineTotal,
		0,
	);

	// Total saved across all discounted items
	const totalDiscount = cartProducts.reduce(
		(sum, item) => sum + item.discountAmount,
		0,
	);

	// Original total before discounts
	const originalTotal = cartProducts.reduce(
		(sum, item) => sum + (item.lineOldTotal ?? item.lineTotal),
		0,
	);
	return { cartProducts, totalAmount, totalDiscount, originalTotal };
};

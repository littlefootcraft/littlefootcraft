//src/components/CartItem.jsx
import { useCart } from "../context/CartContext";
import { X } from "lucide-react";
import { QuantityControl } from "./QuantityControl";
import { formatPrice } from "../utils/formatPrice";

export const CartItem = ({
	sku,
	name,
	qty,
	image,
	price,
	oldPrice,
	category,
}) => {
	const { addToCart, removeFromCart, deleteFromCart } = useCart();
	return (
		<div>
			<div className="cart-item">
				<div className="cart-item__img-wrap">
					<img
						className="cart-item__img-style"
						src={image}
						alt={name}
					/>
				</div>
				<div className="cart-item__info">
					<div className="cart-item__info-header">
						<div className="cart-item__info-title-wrap">
							<span>{category}</span>
							<h3 className="cart-item__info-title">{name}</h3>
						</div>
						<button
							className="cart-item__close-btn"
							onClick={() => deleteFromCart({ sku })}
						>
							<X size={28} />
						</button>
					</div>
					<div className="cart-item__info-footer">
						<QuantityControl
							qty={qty}
							onIncrease={() => addToCart({ sku, qty: 1 })}
							onDecrease={() => removeFromCart({ sku })}
						/>
						<div className="cart-item__info-price">
							{oldPrice != null && (
								<div className="cart-item__info-price--old">
									{formatPrice(oldPrice)}
								</div>
							)}
							<div
								className={`cart-item__info-price--new ${
									oldPrice != null ? "cart-item__info-price--discount" : ""
								}`}
							>
								{formatPrice(price)}
							</div>
						</div>
					</div>
				</div>
				<button
					className="cart-item__remove-btn"
					onClick={() => deleteFromCart({ sku })}
				>
					<X size={28} />
				</button>
			</div>
		</div>
	);
};

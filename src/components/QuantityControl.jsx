//QuantityControl.jsx

import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";

export const QuantityControl = ({ qty, onIncrease, onDecrease }) => {
	return (
		<div className="quantity-control">
			<button
				className="quantity-control__decrease"
				onClick={onDecrease}
			>
				<FaMinus size={14} />
			</button>
			<span className="quantity-control__amount">{qty}</span>
			<button
				className="quantity-control__increase"
				onClick={onIncrease}
			>
				<FaPlus size={14} />
			</button>
		</div>
	);
};

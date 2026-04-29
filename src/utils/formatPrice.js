// src/utils/formatPrice.js
import config from "../content/store-config.json";

export function formatPrice(amount) {
	const { active, options } = config.currency;
	const { symbol, position } = options[active];

	return position === "before" ? `${symbol}${amount}` : `${amount} ${symbol}`; // UAH has space before symbol by convention
}

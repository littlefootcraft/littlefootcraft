import { calculateAnPostShipping } from "./calculateAnPostShipping";

export const calculateShipping = ({
	originCode,
	countryCode,
	region = "",
	weightG,
	format,
}) => {
	if (!originCode) {
		throw new Error("Shipping origin is required.");
	}

	switch (originCode) {
		case "IE-GALWAY":
			return calculateAnPostShipping({
				countryCode,
				region,
				weightG,
				format,
			});

		default:
			throw new Error(
				`Shipping is not configured yet for origin ${originCode}.`,
			);
	}
};

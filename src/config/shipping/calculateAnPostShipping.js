import AN_POST_REGISTERED_RATES from "../../data/shipping/anPostRegisteredRates.json";
import AN_POST_EXPRESS_RATES from "../../data/shipping/anPostExpressRates.json";
import { getAnPostZone } from "./anPostZones";

export { AN_POST_ZONES } from "./anPostZones";

export const calculateAnPostShipping = ({
	countryCode,
	region = "",
	weightG,
	format,
}) => {
	if (!countryCode) {
		throw new Error("Destination country is required.");
	}

	if (!Number.isFinite(weightG) || weightG <= 0) {
		throw new Error("Shipping weight must be greater than 0.");
	}

	if (!format) {
		throw new Error("Shipping format is required.");
	}

	const normalizedCountry = countryCode.trim().toUpperCase();

	// IRELAND → REGISTERED POST
	if (normalizedCountry === "IE") {
		const formatRates = AN_POST_REGISTERED_RATES[format];

		if (!formatRates) {
			throw new Error(`No An Post Registered Post rates found for ${format}.`);
		}

		const matchingRate = formatRates.find((rate) => weightG <= rate.maxWeight);

		if (!matchingRate) {
			throw new Error(`No An Post Registered Post rate found for ${weightG}g.`);
		}

		return {
			carrier: "An Post",
			service: "Registered Post",
			zone: 1,
			format,
			weightG,
			amount: matchingRate.price,
			currency: "EUR",
			tracked: true,
		};
	}

	// INTERNATIONAL → EXPRESS POST
	const zone = getAnPostZone({
		countryCode: normalizedCountry,
		region,
	});

	if (!zone || zone === 1) {
		throw new Error(
			`An Post Express Post shipping is not available for ${countryCode}.`,
		);
	}

	const zoneRates = AN_POST_EXPRESS_RATES[zone];

	if (!zoneRates) {
		throw new Error(`No An Post Express Post rates found for Zone ${zone}.`);
	}

	const formatRates = zoneRates[format];

	if (!formatRates) {
		throw new Error(
			`No An Post Express Post ${format} rates found for Zone ${zone}.`,
		);
	}

	const matchingRate = formatRates.find((rate) => weightG <= rate.maxWeight);

	if (!matchingRate) {
		throw new Error(
			`No An Post Express Post ${format} rate found for ${weightG}g in Zone ${zone}.`,
		);
	}

	return {
		carrier: "An Post",
		service: "Express Post",
		zone,
		format,
		weightG,
		amount: matchingRate.price,
		currency: "EUR",
		tracked: true,
	};
};

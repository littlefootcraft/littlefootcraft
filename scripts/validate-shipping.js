const isObject = (value) =>
	value !== null && typeof value === "object" && !Array.isArray(value);

const validateRateTable = (rates, label, errors, allowEmpty = false) => {
	if (!Array.isArray(rates)) {
		errors.push(`${label}: expected an array.`);
		return;
	}

	if (rates.length === 0 && !allowEmpty) {
		errors.push(`${label}: at least one rate is required.`);
		return;
	}

	let previousWeight = 0;

	rates.forEach((rate, index) => {
		const location = `${label}[${index}]`;

		if (!isObject(rate)) {
			errors.push(`${location}: expected an object.`);
			return;
		}

		if (
			!Number.isSafeInteger(rate.maxWeight) ||
			rate.maxWeight <= previousWeight
		) {
			errors.push(
				`${location}: maxWeight must be a positive integer greater than the previous bracket.`,
			);
		} else {
			previousWeight = rate.maxWeight;
		}

		if (
			typeof rate.price !== "number" ||
			!Number.isFinite(rate.price) ||
			rate.price < 0 ||
			Math.round(rate.price * 100) !== rate.price * 100
		) {
			errors.push(
				`${location}: price must be a non-negative number with at most two decimal places.`,
			);
		}
	});
};

export const validateShipping = ({ zones, registeredRates, expressRates }) => {
	const errors = [];

	// Country and zone configuration
	if (!isObject(zones) || !Array.isArray(zones.countries)) {
		errors.push("anPostZones.json: countries must be an array.");
	} else {
		const seenCountries = new Set();

		zones.countries.forEach((country, index) => {
			const location = `countries[${index}]`;

			if (!isObject(country)) {
				errors.push(`${location}: expected an object.`);
				return;
			}

			if (
				typeof country.countryCode !== "string" ||
				!/^[A-Z]{2}$/.test(country.countryCode)
			) {
				errors.push(`${location}: invalid countryCode.`);
			} else if (seenCountries.has(country.countryCode)) {
				errors.push(
					`${location}: duplicate countryCode ${country.countryCode}.`,
				);
			} else {
				seenCountries.add(country.countryCode);
			}

			if (typeof country.name !== "string" || !country.name.trim()) {
				errors.push(`${location}: country name is required.`);
			}

			if (
				!Number.isInteger(country.zone) ||
				country.zone < 1 ||
				country.zone > 5
			) {
				errors.push(`${location}: zone must be between 1 and 5.`);
			}
		});

		const ireland = zones.countries.find(
			(country) => country?.countryCode === "IE",
		);

		if (ireland?.zone !== 1) {
			errors.push("Ireland (IE) must belong to zone 1.");
		}
	}

	// Domestic registered rates
	if (!isObject(registeredRates)) {
		errors.push("anPostRegisteredRates.json: expected an object.");
	} else {
		validateRateTable(registeredRates.packet, "registered.packet", errors);

		validateRateTable(registeredRates.parcel, "registered.parcel", errors);
	}

	// International express rates
	if (!isObject(expressRates)) {
		errors.push("anPostExpressRates.json: expected an object.");
	} else {
		for (const zone of [2, 3, 4, 5]) {
			const config = expressRates[String(zone)];

			if (!isObject(config)) {
				errors.push(`express zone ${zone}: configuration missing.`);
				continue;
			}

			validateRateTable(config.packet, `express.${zone}.packet`, errors);

			// Empty international parcel rates are intentional.
			validateRateTable(config.parcel, `express.${zone}.parcel`, errors, true);
		}

		for (const zone of Object.keys(expressRates)) {
			if (!["2", "3", "4", "5"].includes(zone)) {
				errors.push(`Unexpected express zone: ${zone}.`);
			}
		}
	}

	if (errors.length > 0) {
		throw new Error(
			`Shipping validation failed:\n${errors
				.map((error) => `- ${error}`)
				.join("\n")}`,
		);
	}

	console.log("Shipping configuration validated successfully.");
};

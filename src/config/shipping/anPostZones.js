import shippingZones from "../../data/shipping/anPostZones.json";

export const AN_POST_ZONES = Object.fromEntries(
	shippingZones.countries.map(({ countryCode, zone }) => [countryCode, zone]),
);

const NORTHERN_IRELAND_REGIONS = [
	"northern ireland",
	"antrim",
	"armagh",
	"down",
	"fermanagh",
	"londonderry",
	"derry",
	"tyrone",
];

export const getAnPostZone = ({ countryCode, region = "" }) => {
	const normalizedCountry = countryCode?.trim().toUpperCase();

	const normalizedRegion = region?.trim().toLowerCase();

	if (
		normalizedCountry === "GB" &&
		NORTHERN_IRELAND_REGIONS.includes(normalizedRegion)
	) {
		return 1;
	}

	return AN_POST_ZONES[normalizedCountry] ?? null;
};

import fs from "fs";
import path from "path";

import { validateShipping } from "./validate-shipping.js";

import anPostZones from "../src/data/shipping/anPostZones.json" with { type: "json" };
import registeredRates from "../src/data/shipping/anPostRegisteredRates.json" with { type: "json" };
import expressRates from "../src/data/shipping/anPostExpressRates.json" with { type: "json" };

const SKU_PATTERN = /^[A-Z]{2}-[0-9]{8}-[0-9]{3}$/;

const VALID_SHIPPING_FORMATS = new Set(["packet", "parcel"]);

const VALID_INVENTORY_LOCATIONS = new Set(["IE-GALWAY"]);

const getJsonFiles = (dir) => {
	const entries = fs.readdirSync(dir, {
		withFileTypes: true,
	});

	return entries
		.flatMap((entry) => {
			const fullPath = path.join(dir, entry.name);

			if (entry.isDirectory()) {
				return getJsonFiles(fullPath);
			}

			if (entry.isFile() && entry.name.endsWith(".json")) {
				return [fullPath];
			}

			return [];
		})
		.sort();
};

const readJsonFiles = (dir) => {
	return getJsonFiles(dir).map((filePath) => {
		const raw = fs.readFileSync(filePath, "utf8");

		try {
			return {
				filePath,
				data: JSON.parse(raw),
			};
		} catch {
			throw new Error(`Invalid JSON: ${filePath}`);
		}
	});
};

const writeJson = (outputFile, data) => {
	fs.mkdirSync(path.dirname(outputFile), {
		recursive: true,
	});

	const temporaryFile = `${outputFile}.tmp`;

	try {
		fs.writeFileSync(temporaryFile, JSON.stringify(data, null, 2));

		fs.renameSync(temporaryFile, outputFile);
	} catch (error) {
		if (fs.existsSync(temporaryFile)) {
			fs.unlinkSync(temporaryFile);
		}

		throw error;
	}
};

const validateProducts = (entries) => {
	const errors = [];
	const seenSkus = new Set();

	for (const { filePath, data: product } of entries) {
		const file = path.relative(process.cwd(), filePath);

		if (!product || typeof product !== "object" || Array.isArray(product)) {
			errors.push(`${file}: Product must be an object.`);
			continue;
		}

		const sku = product.sku;

		if (typeof sku !== "string" || !SKU_PATTERN.test(sku)) {
			errors.push(`${file}: Invalid SKU.`);
		} else {
			if (seenSkus.has(sku)) {
				errors.push(`${file}: Duplicate SKU ${sku}.`);
			}

			seenSkus.add(sku);

			if (path.basename(filePath, ".json") !== sku) {
				errors.push(`${file}: Filename must match SKU ${sku}.`);
			}
		}

		if (
			typeof product.name?.en !== "string" ||
			!product.name.en.trim() ||
			typeof product.name?.ua !== "string" ||
			!product.name.ua.trim()
		) {
			errors.push(`${file}: EN and UA names are required.`);
		}

		if (
			typeof product.price !== "number" ||
			!Number.isFinite(product.price) ||
			product.price <= 0
		) {
			errors.push(`${file}: Price must be positive.`);
		}

		if (
			product.oldPrice != null &&
			(typeof product.oldPrice !== "number" ||
				!Number.isFinite(product.oldPrice) ||
				product.oldPrice <= product.price)
		) {
			errors.push(`${file}: Old price must exceed current price.`);
		}

		if (!VALID_INVENTORY_LOCATIONS.has(product.inventoryLocation)) {
			errors.push(`${file}: Unknown inventory location.`);
		}

		if (
			!Number.isSafeInteger(product.shipping?.weight) ||
			product.shipping.weight <= 0
		) {
			errors.push(
				`${file}: Shipping weight must be a positive integer in grams.`,
			);
		}

		if (!VALID_SHIPPING_FORMATS.has(product.shipping?.format)) {
			errors.push(`${file}: Invalid shipping format.`);
		}
	}

	if (errors.length > 0) {
		throw new Error(`Product validation failed:\n\n${errors.join("\n")}`);
	}
};

// PRODUCTS
const productsDir = path.resolve("src/content/shop");

const productEntries = readJsonFiles(productsDir);

if (productEntries.length === 0) {
	throw new Error("Product catalog is empty.");
}

validateProducts(productEntries);

validateShipping({
	zones: anPostZones,
	registeredRates,
	expressRates,
});

const products = productEntries.map(({ data }) => data);

// WORKSHOPS
const workshopsDir = path.resolve("src/content/workshops");

const workshops = readJsonFiles(workshopsDir).map(({ data }) => data);

// Write only after product and shipping validation succeed.
writeJson(path.resolve("public/data/products.json"), products);

writeJson(path.resolve("public/data/workshops.json"), workshops);

console.log(
	`Generated ${products.length} products and ${workshops.length} workshops.`,
);

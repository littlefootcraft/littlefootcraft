import fs from "fs";
import path from "path";

const getJsonFiles = (dir) => {
	const entries = fs.readdirSync(dir, {
		withFileTypes: true,
	});

	return entries.flatMap((entry) => {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			return getJsonFiles(fullPath);
		}

		if (entry.isFile() && entry.name.endsWith(".json")) {
			return [fullPath];
		}

		return [];
	});
};

const readJsonFiles = (dir) => {
	return getJsonFiles(dir).map((filePath) => {
		const raw = fs.readFileSync(filePath, "utf8");

		return JSON.parse(raw);
	});
};

const writeJson = (outputFile, data) => {
	fs.mkdirSync(path.dirname(outputFile), {
		recursive: true,
	});

	fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
};

// PRODUCTS
const productsDir = path.resolve("src/content/shop");

const products = readJsonFiles(productsDir);

writeJson(path.resolve("public/data/products.json"), products);

// WORKSHOPS
const workshopsDir = path.resolve("src/content/workshops");

const workshops = readJsonFiles(workshopsDir);

writeJson(path.resolve("public/data/workshops.json"), workshops);

console.log(
	`Generated ${products.length} products and ${workshops.length} workshops.`,
);

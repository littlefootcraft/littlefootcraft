//Translation.jsx

//Menu
export const menuUA = {
	home: "ГОЛОВНА",
	shop: "Магазин",
	workshops: "Майстер-класи",
	about: "Про нас",
	faq: "Питання",
	sale: "Poзпродаж",
};

export const menuEN = {
	home: "Home",
	shop: "Shop",
	workshops: "Workshops",
	about: "About",
	faq: "Faq",
	sale: "Sale",
};

//Buttons
export const toolbarEN = {
	filters: "Filters",
	items: "items",
	itemsFound: (count) => `${count} item${count === 1 ? "" : "s"} found`,
};
export const toolbarUA = {
	filters: "Фільтри",
	items: "товарів",
	itemsFound: (count) =>
		`Знайдено ${count} товар${
			count === 1 ? "" : count >= 2 && count <= 4 ? "и" : "ів"
		}`,
};

//Sort options
export const sortOptionsUA = [
	{ id: "newest", label: "Новинки" },
	{ id: "price-asc", label: "Ціна: від низької до високої" },
	{ id: "price-desc", label: "Ціна: від високої до низької" },
];

export const sortOptionsEN = [
	{ id: "newest", label: "Newest" },
	{ id: "price-asc", label: "Price: Low to High" },
	{ id: "price-desc", label: "Price: High to Low" },
];

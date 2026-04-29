//Translation.jsx

//Menu
export const menuEN = {
	home: "Home",
	shop: "Shop",
	workshops: "Workshops",
	about: "About",
	faq: "Faq",
	sale: "Sale",
};

export const menuUA = {
	home: "ГОЛОВНА",
	shop: "Магазин",
	workshops: "Майстер-класи",
	about: "Про нас",
	faq: "Питання",
	sale: "Poзпродаж",
};

//Product Card
export const productCardEN = {
	new: "New",
	addToWishlist: "Add to wishlist",
	removeFromWishlist: "Remove from wishlist",
	"details-btn": "View details",
};

export const productCardUA = {
	new: "Новинка",
	addToWishlist: "Додайте до списку бажань",
	removeFromWishlist: "Видалити зі списку бажань",
	"details-btn": "Детальніше",
};

// Wishlist page
export const wishlistPageEN = {
	title: "My Wishlist",
	subtitle: "Pieces you've fallen in love with. Take your time — magic waits.",
	items: "items",
	itemsFound: (count) =>
		`${count} treasure${count === 1 ? "" : "s"} in your wishlist`,
	"empty-title": "Your wishlist is empty",
	"empty-text": "Let's find something special for you",
	"empty-btn": "Browse the shop",
};

export const wishlistPageUA = {
	title: "Мій список бажань",
	subtitle: "Вироби, які зачарували вас. Не поспішайте — магія чекає.",
	items: "товарів",
	itemsFound: (count) => {
		const lastTwo = count % 100;
		const lastOne = count % 10;

		let form;
		if (lastTwo >= 11 && lastTwo <= 19) {
			form = "ів"; // 11-19 always "ів"
		} else if (lastOne === 1) {
			form = ""; // 1, 21, 31 → "товар"
		} else if (lastOne >= 2 && lastOne <= 4) {
			form = "и"; // 2-4, 22-24 → "товари"
		} else {
			form = "ів"; // 0, 5-9, 20 → "товарів"
		}

		return `${count} скарб${form} у вашому списку бажань`;
	},
	"empty-title": "Ваш список бажань порожній",
	"empty-text": "Давайте знайдемо щось особливе для вас",
	"empty-btn": "Перейти до магазину",
};

//Product page
export const productPageEN = {
	breadcrumbs: { home: "Home", catalog: "Catalog" },
	specs: {
		size: "Size",
		collection: "Collection",
		color: "Colors",
		sku: "SKU",
	},
	addToCart: "Request to order",
	related: "You may also like",
	recentlyViewed: "Recently viewed",
};

export const productPageUA = {
	breadcrumbs: { home: "Головна", catalog: "Каталог" },
	specs: {
		size: "Розмір",
		collection: "Колекція",
		color: "Кольори",
		sku: "Артикул",
	},
	addToCart: "Замовити",
	related: "Вам також може сподобатись",
	recentlyViewed: "Раніше переглянуті товари",
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
	itemsFound: (count) => {
		const lastTwo = count % 100;
		const lastOne = count % 10;

		let form;
		if (lastTwo >= 11 && lastTwo <= 19) {
			form = "ів"; // 11-19 always "ів"
		} else if (lastOne === 1) {
			form = ""; // 1, 21, 31 → "товар"
		} else if (lastOne >= 2 && lastOne <= 4) {
			form = "и"; // 2-4, 22-24 → "товари"
		} else {
			form = "ів"; // 0, 5-9, 20 → "товарів"
		}

		return `${count} товар${form} знайдено`;
	},
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

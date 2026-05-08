//Translation.jsx

// Menu --------------------------------
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

// Product Card-----------------------
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

// Wishlist page---------------------------------------
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

// Product page----------------------------------
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
	viewCart: "View Cart",
	addedToCart: "Added to cart",
	addToWishlistAria: "Add to wishlist",
	removeWishlistAria: "Remove from wishlist",
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
	viewCart: "Перейти до кошика",
	addedToCart: "Було додано до кошика",
	addToWishlistAria: "Додати до списку бажань",
	removeWishlistAria: "Видалити з списку бажань",
};

// Buttons--------------------------------------
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

// Sort options-------------------------------
export const sortOptionsUA = [
	{ id: "newest", label: "Новинки" },
	{ id: "price-asc", label: "Ціна: дешевші" },
	{ id: "price-desc", label: "Ціна: дорожчі" },
];

export const sortOptionsEN = [
	{ id: "newest", label: "Newest" },
	{ id: "price-asc", label: "Price: Low to High" },
	{ id: "price-desc", label: "Price: High to Low" },
];

// Login Page-----------------------------------
export const loginPageEN = {
	title: "Login to your account",
	subtitle: "Welcome back! Please enter your details to continue.",
	emailLabel: "Email",
	passwordLabel: "Password",
	passwordPlaceholder: "Enter your password",
	loginBtn: "Log In",
	registerInvitation: "Don't have an account? Register",
	continueWithoutAccount: "Continue without registration",
};

export const loginPageUA = {
	title: "Вхід в акаунт",
	subtitle: "Увійдіть, щоб відстежувати замовлення",
	emailLabel: "Електронна пошта",
	passwordLabel: "Пароль",
	passwordPlaceholder: "Введіть пароль",
	loginBtn: "Увійти",
	registerInvitation: "Немає акаунту? Зареєструватися",
	continueWithoutAccount: "Продовжити без реєстрації",
};

// Registration Page---------------------------------------
export const registrationPageEN = {
	title: "Create an account",
	subtitle: "Join us for a magical shopping experience!",
	firstNameLabel: "First name",
	firstNamePlaceholder: "Your first name",
	lastNameLabel: "Last name",
	lastNamePlaceholder: "Your last name",
	emailLabel: "Email",
	passwordLabel: "Password",
	passwordPlaceholder: "Create a password",
	passwordConfirmLabel: "Confirm password",
	registerBtn: "Sign up", // more natural than "Register"
	loginInvitation: "Already have an account? Log in",
};

export const registrationPageUA = {
	title: "Створіть акаунт",
	subtitle: "Приєднуйтесь до нас і насолоджуйтесь магічним шопінгом!",
	firstNameLabel: "Ім’я",
	firstNamePlaceholder: "Ваше ім’я",
	lastNameLabel: "Прізвище",
	lastNamePlaceholder: "Ваше прізвище",
	emailLabel: "Електронна пошта",
	passwordLabel: "Пароль",
	passwordPlaceholder: "Створіть пароль",
	passwordConfirmLabel: "Підтвердіть пароль",
	registerBtn: "Зареєструватися",
	loginInvitation: "Вже маєте акаунт? Увійти",
};

// Cart Page----------------------------------
export const cartPageEN = {
	title: "Your Cart",
	subtitle: "Review your selected treasures before sending an order.",
	emptyTitle: "Your cart is empty",
	emptyText: "Let's find something special for you",
	emptyBtn: "Browse the shop",
	checkout: "Request to order",
	continueShopping: "Continue shopping",
	orderTitle: "Order summary",
	deliveryTitle: "Shipping",
	deliveryInfo: "Calculated at checkout",
	totalTitle: "Total",
	backBtn: "Continue Shopping",
};

export const cartPageUA = {
	title: "Ваш кошик",
	subtitle: "Перегляньте вибрані скарби перед відправкою замовлення.",
	emptyTitle: "Ваш кошик порожній",
	emptyText: "Давайте знайдемо щось особливе для вас",
	emptyBtn: "Перейти до магазину",
	checkout: "Оформити замовлення",
	continueShopping: "Продовжити покупки",
	orderTitle: "Ваше замовлення",
	deliveryTitle: "Доставка",
	deliveryInfo: "Розраховується під час оформлення замовлення",
	totalTitle: "До сплати",
	backBtn: "Продовжити покупки",
};

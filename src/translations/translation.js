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

// SUBSCRIPTION SECTION

export const subscriptiopnEN = {
	title: "Join Our Enchanted Circle",
	text: "Subscribe to receive updates about new pieces and workshops",
	placeholder: "Enter your email",
	buttonLabel: "Subscribe",
	ariaLabel: "Email for newsletter subscription",

	successMessage: "Thank you for subscribing to our enchanted circle.",
	emptyEmailMessage: "Please enter your email.",
	invalidEmailMessage: "Please enter a valid email.",
	alreadySubscribedMessage: "This email is already subscribed.",
	errorMessage: "Something went wrong. Please try again.",
	loadingLabel: "Subscribing...",
	workshopsLabel: "Workshops",
	masterClassesLabel: "Master classes",
	salesLabel: "Sales",
	emptyInterestsMessage: "Please choose at least one topic.",
};
export const subscriptiopnUA = {
	title: "Приєднуйтесь до нашого чарівного кола",
	text: "Підпишіться, щоб отримувати новини про нові вироби та майстер-класи",
	placeholder: "Введіть вашу електронну пошту",
	buttonLabel: "Підписатися",
	ariaLabel: "Електронна пошта для підписки на новини",

	successMessage: "Дякуємо за підписку на наше чарівне коло.",
	emptyEmailMessage: "Будь ласка, введіть вашу електронну пошту.",
	invalidEmailMessage: "Будь ласка, введіть коректну електронну пошту.",
	alreadySubscribedMessage: "Ця електронна пошта вже підписана.",
	errorMessage: "Щось пішло не так. Спробуйте ще раз.",
	loadingLabel: "Підписка...",
	workshopsLabel: "Воркшопи",
	masterClassesLabel: "Майстер-класи",
	salesLabel: "Знижки",
	emptyInterestsMessage: "Будь ласка, оберіть хоча б одну тему.",
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

// Toolbar--------------------------------------
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

// LOGIN PAGE-----------------------------------

export const loginPageEN = {
	title: "Login to your account",
	subtitle: "Welcome back! Please enter your details to continue.",
	emailLabel: "Email",
	passwordLabel: "Password",
	passwordPlaceholder: "Enter your password",
	loginBtn: "Log In",
	registerInvitation: "Don't have an account? Register",
	continueWithoutAccount: "Continue without registration",
	emptyEmailMessage: "Please enter your email.",
	invalidEmailMessage: "Please enter a valid email address.",
	emptyPasswordMessage: "Please enter your password.",
	hidePasswordAriaLabel: "Hide password",
	showPasswordAriaLabel: "Show password",
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
	emptyEmailMessage: "Будь ласка, введіть вашу електронну пошту.",
	invalidEmailMessage: "Будь ласка, введіть коректну електронну пошту.",
	emptyPasswordMessage: "Будь ласка, введіть пароль.",
	hidePasswordAriaLabel: "Сховати пароль",
	showPasswordAriaLabel: "Показати пароль",
};

// REGISTRATION PAGE---------------------------------------

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

// CART PAGE----------------------------------

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

// BUTTONS-----------------------------------------

export const buttonsEN = {
	bookNow: "Book now",
};

export const buttonsUA = {
	bookNow: "Забронювати",
};

// GET IN TOUCH FORM------------------------------------

export const getInTouchEN = {
	title: "Get in Touch",
	text: "Have a question about a piece, order, or workshop? Send us a message.",
	name: "Your name",
	email: "Email address",
	message: "Message",
	button: "Send Message",
	emailText: "Or email us directly:",
	emptyNameMessage: "Please enter your name.",
	emptyEmailMessage: "Please enter your email.",
	invalidEmailMessage: "Please enter a valid email address.",
	emptyMessageMessage: "Please enter your message.",
	shortMessageMessage: "Please write a little more detail.",
	successMessage: "Thank you! Your message has been sent.",
	errorMessage: "Something went wrong. Please try again.",
	sendingMessage: "Sending your message...",
};

export const getInTouchUA = {
	title: "Звʼяжіться з нами",
	text: "Маєте запитання щодо виробу, замовлення чи майстер-класу? Напишіть нам.",
	name: "Ваше імʼя",
	email: "Електронна пошта",
	message: "Повідомлення",
	button: "Надіслати",
	emailText: "Або напишіть нам напряму:",
	emptyNameMessage: "Будь ласка, введіть ваше ім’я.",
	emptyEmailMessage: "Будь ласка, введіть вашу електронну пошту.",
	invalidEmailMessage: "Будь ласка, введіть коректну електронну пошту.",
	emptyMessageMessage: "Будь ласка, введіть повідомлення.",
	shortMessageMessage: "Будь ласка, напишіть трохи більше деталей.",
	successMessage: "Дякуємо! Ваше повідомлення надіслано.",
	errorMessage: "Щось пішло не так. Спробуйте ще раз.",
	sendingMessage: "Надсилаємо ваше повідомлення...",
};

// WORKSHOP BOOKING FORM

export const workShopBookingEN = {
	title: "Book a Workshop",
	text: "Leave your details and we’ll contact you to confirm your booking.",
	name: "Your name",
	email: "Email address",
	phone: "Phone number",
	date: "Choose a date",
	participants: "Number of participants",
	message: "Comment or question",
	button: "Send Request",
	note: "Your booking is not confirmed yet. We’ll contact you after checking availability.",

	emptyNameMessage: "Please enter your name.",
	emptyEmailMessage: "Please enter your email.",
	invalidEmailMessage: "Please enter a valid email address.",
	emptyPhoneMessage: "Please enter your phone number.",
	emptyDateMessage: "Please choose a workshop date.",
};

export const workShopBookingUA = {
	title: "Забронювати майстер-клас",
	text: "Залиште ваші дані, і ми звʼяжемося з вами для підтвердження участі.",
	name: "Ваше імʼя",
	email: "Електронна пошта",
	phone: "Телефон",
	date: "Оберіть дату",
	participants: "Кількість учасників",
	message: "Коментар або запитання",
	button: "Надіслати запит",
	note: "Бронювання ще не підтверджене. Ми звʼяжемося з вами після перевірки доступності.",

	emptyNameMessage: "Будь ласка, введіть ваше ім’я.",
	emptyEmailMessage: "Будь ласка, введіть вашу електронну пошту.",
	invalidEmailMessage: "Будь ласка, введіть коректну електронну пошту.",
	emptyPhoneMessage: "Будь ласка, введіть номер телефону.",
	emptyDateMessage: "Будь ласка, оберіть дату майстер-класу.",
};

// ORDER PAGE----------------------------------

export const orderPageEN = {
	title: "Request Your Order",
	subtitle:
		"Your order is not confirmed yet. We will check availability, shipping, and send you a confirmation with payment details.",

	// Breadcrumbs
	home: "Home",
	shop: "Shop",
	cart: "Cart",
	checkout: "Checkout",

	// Sections
	contactTitle: "Contact Details",
	shippingTitle: "Shipping Address",
	summaryTitle: "Order Summary",

	// Fields
	name: "Name",
	lastName: "Last Name",
	email: "Email",
	phone: "Phone",
	address: "Address",
	apartment: "Apartment, suite, etc.",
	city: "City",
	postalCode: "Postal Code",
	country: "Country",

	// Gift
	giftPostcard: "Add a gift postcard",
	giftNote: "Gift Note optional",
	giftPlaceholder: "Write a magical message for your recipient...",
	giftPostcardSummary: "Gift postcard",

	// Buttons
	submitBtn: "Send Order Request",
	backToCart: "Back to cart",

	// Summary
	total: "Total",
	shippingNote:
		"Shipping price will be confirmed after we check the item location and destination country.",

	// Notice
	paymentNotice:
		"Payment is not taken now. The owner will confirm your order first.",

	// Errors
	nameError: "Please enter your name.",
	lastNameError: "Please enter your last name.",
	emailError: "Please enter your email.",
	addressError: "Please enter your address.",
	apartmentError: "Please enter apartment or suite information.",
	cityError: "Please enter your city.",
	postalCodeError: "Please enter your postal code.",
	countryError: "Please enter your country.",
};

export const orderPageUA = {
	title: "Запит на замовлення",
	subtitle:
		"Ваше замовлення ще не підтверджене. Ми перевіримо доступність, доставку та надішлемо вам підтвердження з деталями оплати.",

	// Breadcrumbs
	home: "Головна",
	shop: "Магазин",
	cart: "Кошик",
	checkout: "Оформлення",

	// Sections
	contactTitle: "Контактні дані",
	shippingTitle: "Адреса доставки",
	summaryTitle: "Підсумок замовлення",

	// Fields
	name: "Ім’я",
	lastName: "Прізвище",
	email: "Електронна пошта",
	phone: "Телефон",
	address: "Адреса",
	apartment: "Квартира, офіс тощо",
	city: "Місто",
	postalCode: "Поштовий індекс",
	country: "Країна",

	// Gift
	giftPostcard: "Додати подарункову листівку",
	giftNote: "Текст для листівки (необов’язково)",
	giftPlaceholder: "Напишіть чарівне побажання для отримувача...",
	giftPostcardSummary: "Подарункова листівка",

	// Buttons
	submitBtn: "Надіслати запит на замовлення",
	backToCart: "Назад до кошика",

	// Summary
	total: "Разом",
	shippingNote:
		"Вартість доставки буде підтверджена після перевірки місця знаходження товару та країни доставки.",

	// Notice
	paymentNotice:
		"Оплата зараз не стягується. Власник магазину спочатку підтвердить ваше замовлення.",

	// Errors
	nameError: "Будь ласка, введіть ім’я.",
	lastNameError: "Будь ласка, введіть прізвище.",
	emailError: "Будь ласка, введіть електронну пошту.",
	addressError: "Будь ласка, введіть адресу.",
	apartmentError: "Будь ласка, введіть квартиру або офіс.",
	cityError: "Будь ласка, введіть місто.",
	postalCodeError: "Будь ласка, введіть поштовий індекс.",
	countryError: "Будь ласка, введіть країну.",
};

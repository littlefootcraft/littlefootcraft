//Translation.jsx

// MENU --------------------------------
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

// HEADER---------------------------------
export const headerEN = {
	search: "Search",
	searchButton: "Open search",
	closeSearch: "Close search",
	languageButton: "Select language",
	wishlist: "Wishlist",
	cart: "Shopping cart",
	login: "Login",
	toggleMenu: "Toggle menu",
};

export const headerUA = {
	search: "Пошук",
	searchButton: "Відкрити пошук",
	closeSearch: "Закрити пошук",
	languageButton: "Обрати мову",
	wishlist: "Список бажань",
	cart: "Кошик",
	login: "Увійти",
	toggleMenu: "Відкрити меню",
};

// SUBSCRIPTION SECTION-----------------------------------------

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

// PRODUCT CARD-----------------------
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

// WISHLIST PAGE---------------------------------------
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

// PRODUCT PAGE----------------------------------
export const productPageEN = {
	breadcrumbs: { home: "Home", catalog: "Catalog" },
	specs: {
		design: "Design",
		materials: "Materials",
		size: "Size",
		collection: "Collection",
		color: "Colors",
		sku: "SKU",
		clasp: "Clasp",
	},
	addToCart: "Add to cart",
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
		design: "Дизайн",
		materials: "Матеріали",
		size: "Розмір",
		collection: "Колекція",
		color: "Кольори",
		sku: "Артикул",
		clasp: "Застібка",
	},
	addToCart: "Додати до кошика",
	related: "Вам також може сподобатись",
	recentlyViewed: "Раніше переглянуті товари",
	viewCart: "Перейти до кошика",
	addedToCart: "Було додано до кошика",
	addToWishlistAria: "Додати до списку бажань",
	removeWishlistAria: "Видалити з списку бажань",
};

// TOOLBAR--------------------------------------
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

// SORT OPTIONS-------------------------------
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
	// text: "Leave your details and we’ll contact you to confirm your booking.",
	name: "Your name",
	email: "Email address",
	phone: "Phone number",
	date: "Choose a date",
	participants: "Number of participants",
	message: "Comment or question",
	button: "Send Request",
	note: "Your booking is not confirmed yet. Once you submit your request, we'll check availability and contact you with confirmation details.",

	emptyNameMessage: "Please enter your name.",
	emptyEmailMessage: "Please enter your email.",
	invalidEmailMessage: "Please enter a valid email address.",
	emptyPhoneMessage: "Please enter your phone number.",
	emptyDateMessage: "Please choose a workshop date.",
	invalidPhoneMessage: "Please enter a valid phone number.",

	sendingMessage: "Sending your request...",
	successMessage:
		"Your booking request has been received. We’ll contact you soon to confirm availability.",
	errorMessage: "Something went wrong. Please try again later.",

	cancellationPolicyTitle: "Cancellation Policy",
	cancellationPolicy: [
		"Full refund for cancellations made 48 hours or more before the workshop.",
		"50% refund for cancellations made between 24 and 48 hours before the workshop.",
		"No refund for cancellations made less than 24 hours before the workshop.",
	],

	alreadyBookedMessage:
		"We have already received a booking request for this workshop date from this email address. If you have not received a confirmation yet, please contact us at littlefootcraft@gmail.com and we will be happy to assist you.",
};

export const workShopBookingUA = {
	title: "Забронювати майстер-клас",
	// text: "Залиште ваші дані, і ми звʼяжемося з вами для підтвердження участі.",
	name: "Ваше імʼя",
	email: "Електронна пошта",
	phone: "Телефон",
	date: "Оберіть дату",
	participants: "Кількість учасників",
	message: "Коментар або запитання",
	button: "Надіслати запит",
	note: "Ваше бронювання ще не підтверджено. Після надсилання запиту ми перевіримо наявність місць і зв’яжемося з вами для підтвердження участі.",

	emptyNameMessage: "Будь ласка, введіть ваше ім’я.",
	emptyEmailMessage: "Будь ласка, введіть вашу електронну пошту.",
	invalidEmailMessage: "Будь ласка, введіть коректну електронну пошту.",
	emptyPhoneMessage: "Будь ласка, введіть номер телефону.",
	emptyDateMessage: "Будь ласка, оберіть дату майстер-класу.",
	invalidPhoneMessage: "Будь ласка, введіть коректний номер телефону.",

	sendingMessage: "Надсилаємо ваш запит...",
	successMessage:
		"Ваш запит отримано. Ми зв’яжемося з вами найближчим часом для підтвердження доступності.",
	errorMessage: "Щось пішло не так. Спробуйте ще раз пізніше.",

	cancellationPolicyTitle: "Політика скасування",
	cancellationPolicy: [
		"Повне повернення коштів при скасуванні за 48 годин або більше до початку майстер-класу.",
		"50% повернення коштів при скасуванні за 24–48 годин до початку майстер-класу.",
		"Повернення коштів не здійснюється при скасуванні менш ніж за 24 години до початку майстер-класу.",
	],

	alreadyBookedMessage:
		"Ми вже отримали запит на бронювання цієї дати майстер-класу з цієї електронної адреси. Якщо ви ще не отримали підтвердження, будь ласка, зв’яжіться з нами за адресою littlefootcraft@gmail.com, і ми з радістю вам допоможемо.",
};

// WORKSHOP CONFIRMATION EMAIL---------------------------------

export const workshopConfirmationEmailEN = {
	subject: "We received your workshop booking request",
	title: "Workshop Booking Request Received",
	greeting: "Thank you for your workshop booking request!",
	intro: "We have received your request and will review it shortly.",
	notConfirmed:
		"Please note that your place is not yet confirmed. The workshop organizer will verify availability and contact you by email to confirm your booking and provide any additional details.",
	workshop: "Workshop",
	dateRequested: "Date requested",
	participants: "Participants",
	questions:
		"If you have any questions, feel free to reply to our email or send a letter to littlefootcraft@gmail.com. We would be happy to assist you.",
	thankYou: "Thank you for your interest in LittleFootCraft workshops!",
	signature: "Warm regards,",
	team: "LittleFootCraft",
	location: "Format",
	cancelBooking: "Cancel Booking",
	price: "Price",
	time: "Time",

	cancellationPolicyTitle: "Cancellation Policy",
	cancellationPolicy: [
		"Full refund for cancellations made 48 hours or more before the workshop.",
		"50% refund for cancellations made between 24 and 48 hours before the workshop.",
		"No refund for cancellations made less than 24 hours before the workshop.",
	],

	alreadyBookedMessage:
		"A booking request for this workshop has already been submitted using this email address. Please check your inbox or contact us if you need assistance.",
};

export const workshopConfirmationEmailUA = {
	subject: "Ми отримали ваш запит на бронювання майстер-класу",
	title: "Запит на бронювання отримано",
	greeting: "Дякуємо за ваш запит на бронювання майстер-класу!",
	intro: "Ми отримали ваш запит і незабаром його розглянемо.",
	notConfirmed:
		"Будь ласка, зверніть увагу: ваше місце ще не підтверджене. Організатор майстер-класу перевірить наявність місць і зв’яжеться з вами електронною поштою для підтвердження бронювання та надання додаткових деталей.",
	workshop: "Майстер-клас",
	dateRequested: "Обрана дата",
	participants: "Кількість учасників",
	questions:
		"Якщо у вас виникли запитання, ви можете відповісти на цей лист або написати нам на littlefootcraft@gmail.com. Ми будемо раді допомогти.",
	thankYou: "Дякуємо за інтерес до майстер-класів LittleFootCraft!",
	signature: "З теплом,",
	team: "LittleFootCraft",
	location: "Формат",
	cancelBooking: "Скасувати бронювання",
	price: "Вартість",
	time: "Час",

	cancellationPolicyTitle: "Політика скасування",
	cancellationPolicy: [
		"Повне повернення коштів при скасуванні за 48 годин або більше до початку майстер-класу.",
		"50% повернення коштів при скасуванні за 24–48 годин до початку майстер-класу.",
		"Повернення коштів не здійснюється при скасуванні менш ніж за 24 години до початку майстер-класу.",
	],

	alreadyBookedMessage:
		"Запит на бронювання цього майстер-класу вже було надіслано з цієї електронної адреси. Будь ласка, перевірте свою пошту або зв’яжіться з нами, якщо вам потрібна допомога.",
};

// WORKSHOP CANCELLATION PAGE--------------------------

export const workshopCancellationEN = {
	title: "Cancel workshop booking?",
	cancelledTitle: "Booking Cancelled",
	imageAlt: "Cancel workshop",
	bookingLabel: "You are about to cancel:",
	dateLabel: "Date:",
	formatLabel: "Format:",
	locationLabel: "Location:",
	confirmMessage: "Are you sure you want to cancel this workshop booking?",

	cancelButton: "Cancel",
	returnButton: "No, return",

	notFound: "Booking was not found.",

	cancelError:
		"We could not cancel your booking. Please contact us at littlefootcraft@gmail.com.",

	refundMessages: {
		full_refund:
			"Your workshop booking has been cancelled. According to our cancellation policy, you are eligible for a full refund. If your payment was made earlier, you will receive a full refund within 3–5 business days.",

		partial_refund:
			"Your workshop booking has been cancelled. According to our cancellation policy, you are eligible for a 50% refund. If your payment was made earlier, the refund will be processed within 3–5 business days.",

		no_refund:
			"Your workshop booking has been cancelled. According to our cancellation policy, this cancellation is not eligible for a refund.",
	},
};

export const workshopCancellationUA = {
	title: "Скасувати бронювання?",
	cancelledTitle: "Бронювання скасовано",
	imageAlt: "Скасування майстер-класу",
	bookingLabel: "Ви збираєтеся скасувати:",
	dateLabel: "Дата:",
	formatLabel: "Формат:",
	locationLabel: "Локація:",
	confirmMessage:
		"Ви впевнені, що хочете скасувати бронювання цього майстер-класу?",

	cancelButton: "Скасувати",
	returnButton: "Ні, повернутися",

	notFound: "Бронювання не знайдено.",

	cancelError:
		"Не вдалося скасувати бронювання. Будь ласка, напишіть нам на littlefootcraft@gmail.com.",

	refundMessages: {
		full_refund:
			"Ваше бронювання скасовано. Відповідно до нашої політики скасування, ви маєте право на повне повернення коштів. Якщо оплата була здійснена раніше, повне повернення коштів буде оброблено протягом 3–5 робочих днів.",

		partial_refund:
			"Ваше бронювання скасовано. Відповідно до нашої політики скасування, ви маєте право на повернення 50% вартості. Якщо оплата була здійснена раніше, повернення коштів буде оброблено протягом 3–5 робочих днів.",

		no_refund:
			"Ваше бронювання скасовано. Відповідно до нашої політики скасування, це скасування не передбачає повернення коштів.",
	},
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
	street: "Street",
	apartment: "Apartment, suite, etc. (optional)",
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
	streetError: "Please enter your street.",
	// apartmentError: "Please enter apartment or suite information.",
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
	street: "Вулиця",
	apartment: "Квартира, офіс тощо (необов'язково)",
	city: "Місто",
	postalCode: "Поштовий індекс",
	country: "Країна",

	// Gift
	giftPostcard: "Додати подарункову листівку",
	giftNote: "Текст для листівки (необов’язково)",
	giftPlaceholder: "Напишіть чарівне побажання для отримувача...",
	giftPostcardSummary: "Подарункова листівка",

	// BUTTONS
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
	streetError: "Будь ласка, введіть вулицю.",
	// apartmentError: "Будь ласка, введіть квартиру або офіс.",
	cityError: "Будь ласка, введіть місто.",
	postalCodeError: "Будь ласка, введіть поштовий індекс.",
	countryError: "Будь ласка, введіть країну.",
};

// NOT FOUND PAGE----------------------------------

export const notFoundPageEN = {
	eyebrow: "Lost in the enchanted forest",
	code: "404",
	title: "Oops! This page went on an adventure",
	text: "Looks like this little path led somewhere we can’t find. Let’s guide you back to handmade treasures.",
	goHome: "Go to Home",
	browseShop: "Browse Shop",
};

export const notFoundPageUA = {
	eyebrow: "Загубилися в зачарованому лісі",
	code: "404",
	title: "Ой! Ця сторінка вирушила у пригоду",
	text: "Схоже, ця стежка привела нас туди, де ми не можемо знайти потрібну сторінку. Давайте повернемо вас до світу рукотворних скарбів.",
	goHome: "На головну",
	browseShop: "До магазину",
};

// WENT WRONG PAGE----------------------------------

export const serverErrorPageEN = {
	eyebrow: "A little magic went astray",
	code: "500",
	title: "Oops! Something went wrong",
	text: "It seems one of our enchanted threads became tangled. Please try again in a moment while we weave everything back together.",
	goHome: "Go to Home",
	browseShop: "Browse Shop",
};

export const serverErrorPageUA = {
	eyebrow: "Трішки магії збилося зі шляху",
	code: "500",
	title: "Ой! Щось пішло не так",
	text: "Схоже, одна з наших чарівних ниточок заплуталася. Спробуйте ще раз за мить, поки ми все впорядковуємо.",
	goHome: "На головну",
	browseShop: "До магазину",
};

//NETWORK ERROR PAGE----------------------------------

export const networkErrorPageEN = {
	eyebrow: "The path is a little misty",
	code: "Offline",
	title: "Connection lost",
	text: "It looks like we can’t reach the enchanted workshop right now. Please check your internet connection and try again.",
	tryAgain: "Try Again",
	goHome: "Go to Home",
	browseShop: "Browse Shop",
};

export const networkErrorPageUA = {
	eyebrow: "Стежка трохи вкрилася туманом",
	code: "Offline",
	title: "З’єднання втрачено",
	text: "Схоже, зараз ми не можемо дістатися до чарівної майстерні. Перевірте інтернет-з’єднання та спробуйте ще раз.",
	tryAgain: "Спробувати ще раз",
	goHome: "На головну",
	browseShop: "До магазину",
};

// DEVELOPER SIGNATURE----------------------------------

export const devSignEN = "Crafted with care by";
export const devSignUA = "З любов’ю створено";

// SUBSCRIPTION CONFIRMATION-----------------------------------

export const newsletterEN = {
	emailSubject: "Thank you for subscribing to LittleFootCraft",
	emailTitle: "Thank you for subscribing ✨",
	emailIntro:
		"You have successfully joined the magical LittleFootCraft community.",
	emailSubscribedTo: "You subscribed to:",
	emailUpdates: "We'll send you updates based on your selected topics.",
	emailButton: "Visit LittleFootCraft",
	emailClosing: "Warm wishes,",
	emailUnsubscribe:
		"You received this email because you subscribed to LittleFootCraft updates.",
	emailUnsubscribeButton: "Unsubscribe",
	interests: {
		workshops: "Workshops",
		sales: "Sales",
	},
};

export const newsletterUA = {
	emailSubject: "Дякуємо за підписку на LittleFootCraft",
	emailTitle: "Дякуємо за підписку ✨",
	emailIntro: "Ви успішно приєдналися до магічної спільноти LittleFootCraft.",
	emailSubscribedTo: "Ви підписалися на:",
	emailUpdates: "Ми надсилатимемо вам новини відповідно до вибраних тем.",
	emailButton: "Відвідати сайт",
	emailClosing: "З теплом,",
	emailUnsubscribe:
		"Ви отримали цей лист, тому що підписалися на новини LittleFootCraft.",
	emailUnsubscribeButton: "Відписатися",
	interests: {
		workshops: "Майстер-класи",
		sales: "Знижки та пропозиції",
	},
};

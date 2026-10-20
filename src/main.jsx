//main.jsx
import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from "react-router-dom";

import "./styles/index.scss";
// SHARED LAYOUTS
import { Layout } from "./layouts/Layout";
import ShopLayout from "./layouts/ShopLayout";

// PROVIDERS
import { WorkshopsProvider } from "./context/WorkshopsContext";
import { ProductsProvider } from "./context/ProductsContext";
// CRM AUTH
// import { CrmAuthProvider } from "./context/CrmAuthContext";

// CRM AUTH AND LAYOUT
// import CrmLayout from "./layouts/CrmLayout";
// import ProtectedCrmRoute from "./components/crm/ProtectedCrmRoute";
const CrmRootLayout = lazy(() => import("./layouts/CrmRootLayout"));
const CrmLayout = lazy(() => import("./layouts/CrmLayout"));
const ProtectedCrmRoute = lazy(
	() => import("./components/crm/ProtectedCrmRoute"),
);

// STOREFRONT PAGES
const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const WorkshopsPage = lazy(() => import("./pages/WorkshopsPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegistrationPage = lazy(() => import("./pages/RegistrationPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const SalePage = lazy(() => import("./pages/SalePage"));
const OrderPage = lazy(() => import("./pages/OrderPage"));
import NotFoundPage from "./pages/NotFoundPage";
const ServerErrorPage = lazy(() => import("./pages/ServerErrorPage"));
const NetworkErrorPage = lazy(() => import("./pages/NetworkErrorPage"));
const UnsubscribePage = lazy(() => import("./pages/UnsubscribePage"));
const CancelWorkshopPage = lazy(() => import("./pages/CancelWorkshopPage"));

// CRM PAGES
const CrmLoginPage = lazy(() => import("./pages/crm/CrmLoginPage"));
const CrmDashboardPage = lazy(() => import("./pages/crm/CrmDashboardPage"));

const CrmNewsletterPage = lazy(
	() => import("./pages/crm/newsletter/CrmNewsletterPage"),
);
const CrmSubscribersPage = lazy(
	() => import("./pages/crm/newsletter/CrmSubscribersPage"),
);
const CrmCampaignsPage = lazy(
	() => import("./pages/crm/campaigns/CrmCampaignsPage"),
);
const CrmNewNewsletterPage = lazy(
	() => import("./pages/crm/newsletter/CrmNewNewsletterPage"),
);
const CrmSendDetailsPage = lazy(
	() => import("./pages/crm/sends/CrmSendDetailsPage"),
);
const CrmInventoryPage = lazy(
	() => import("./pages/crm/catalog/inventory/CrmInventoryPage"),
);
const CrmInventoryDetailsPage = lazy(
	() => import("./pages/crm/catalog/inventory/CrmInventoryDetailsPage"),
);
const CrmActiveOrdersPage = lazy(
	() => import("./pages/crm/orders/CrmActiveOrdersPage"),
);
const CrmOrderDetailsPage = lazy(
	() => import("./pages/crm/orders/CrmOrderDetailsPage"),
);
const CrmArtistsPage = lazy(
	() => import("./pages/crm/catalog/artists/CrmArtistsPage"),
);
const CrmArtistFormPage = lazy(
	() => import("./pages/crm/catalog/artists/CrmArtistFormPage"),
);
const CrmArtistDetailsPage = lazy(
	() => import("./pages/crm/catalog/artists/CrmArtistDetailsPage"),
);
const CrmCompletedOrdersPage = lazy(
	() => import("./pages/crm/orders/CrmCompletedOrdersPage"),
);
const CrmCancelledOrdersPage = lazy(
	() => import("./pages/crm/orders/CrmCancelledOrdersPage"),
);
const CrmArchivedOrdersPage = lazy(
	() => import("./pages/crm/orders/CrmArchivedOrdersPage"),
);

const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));

const router = createBrowserRouter([
	{
		path: "/crm",
		element: <CrmRootLayout />,
		children: [
			{ path: "login", element: <CrmLoginPage /> },

			{
				element: (
					<ProtectedCrmRoute>
						<CrmLayout />
					</ProtectedCrmRoute>
				),
				children: [
					{
						index: true,
						element: <CrmDashboardPage />,
					},
					{
						path: "orders",
						element: <CrmActiveOrdersPage />,
					},
					{
						path: "orders/completed",
						element: <CrmCompletedOrdersPage />,
					},
					{
						path: "orders/cancelled",
						element: <CrmCancelledOrdersPage />,
					},
					{
						path: "orders/archive",
						element: <CrmArchivedOrdersPage />,
					},
					{
						path: "orders/:orderId",
						element: <CrmOrderDetailsPage />,
					},
					{
						path: "newsletter",
						element: <CrmNewsletterPage />,
					},
					{
						path: "newsletter/subscribers",
						element: <CrmSubscribersPage />,
					},
					{
						path: "newsletter/campaigns",
						element: <CrmCampaignsPage />,
					},
					{
						path: "newsletter/new",
						element: <CrmNewNewsletterPage />,
					},
					{
						path: "newsletter/sends/:sendId",
						element: <CrmSendDetailsPage />,
					},
					{
						path: "inventory",
						element: <CrmInventoryPage />,
					},
					{
						path: "inventory/:sku",
						element: <CrmInventoryDetailsPage />,
					},

					{
						path: "artists",
						element: <CrmArtistsPage />,
					},
					{
						path: "artists/new",
						element: <CrmArtistFormPage />,
					},
					{
						path: "artists/:artistId",
						element: <CrmArtistDetailsPage />,
					},
				],
			},
		],
	},

	{
		path: "/",
		element: (
			<Navigate
				to="/en"
				replace
			/>
		),
	},
	{
		path: "/:lang",
		element: <Layout />,
		errorElement: <ServerErrorPage />,
		children: [
			{ index: true, element: <HomePage /> },
			{ path: "network-error", element: <NetworkErrorPage /> },

			{
				path: "unsubscribe",
				element: <UnsubscribePage />,
			},
			{
				path: "workshop-cancel/:token",
				element: <CancelWorkshopPage />,
			},
			{
				path: "*",
				element: <NotFoundPage />,
			},

			{
				// path: "shop",
				element: <ShopLayout />,
				// ShopLayout - wraps all shop-related routes
				children: [
					{ path: "shop", element: <ShopPage /> },

					{
						path: "sale",
						element: <SalePage />,
					},
				],
			},
			{
				path: "shop/:sku",
				element: <ProductPage />,
			},
			{ path: "workshops", element: <WorkshopsPage /> },
			{ path: "about", element: <AboutPage /> },
			{ path: "faq", element: <FAQPage /> },
			{ path: "wishlist", element: <WishlistPage /> },
			{ path: "login", element: <LoginPage /> },
			{ path: "registration", element: <RegistrationPage /> },
			{ path: "forgot-password", element: <ForgotPasswordPage /> },
			{ path: "cart", element: <CartPage /> },
			{
				path: "order",
				element: <OrderPage />,
			},
		],
	},
]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<ProductsProvider>
			<WorkshopsProvider>
				<Suspense fallback={<div role="status">Loading...</div>}>
					<RouterProvider router={router} />
				</Suspense>
			</WorkshopsProvider>
		</ProductsProvider>
	</StrictMode>,
);

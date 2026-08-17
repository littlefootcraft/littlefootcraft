//main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from "react-router-dom";

import "./styles/index.scss";
import { Layout } from "./layouts/Layout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ShopPage from "./pages/ShopPage";
import FAQPage from "./pages/FAQPage";
import ProductPage from "./pages/ProductPage";
// import ContactPage from "./pages/ContactPage";
import WorkshopsPage from "./pages/WorkshopsPage";
import ShopLayout from "./layouts/ShopLayout";
import WishlistPage from "./pages/WishlistPage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import CartPage from "./pages/CartPage";
import SalePage from "./pages/SalePage";
import OrderPage from "./pages/OrderPage";
import NotFoundPage from "./pages/NotFoundPage";
import ServerErrorPage from "./pages/ServerErrorPage";
import NetworkErrorPage from "./pages/NetworkErrorPage";
import UnsubscribePage from "./pages/UnsubscribePage";
import CancelWorkshopPage from "./pages/CancelWorkshopPage";

// PROVIDERS
import { WorkshopsProvider } from "./context/WorkshopsContext";

// CRM AUTH
import { CrmAuthProvider } from "./context/CrmAuthContext";

// CRM
import CrmLayout from "./layouts/CrmLayout";

import CrmLoginPage from "./pages/crm/CrmLoginPage";

import CrmDashboardPage from "./pages/crm/CrmDashboardPage";
import CrmNewsletterPage from "./pages/crm/newsletter/CrmNewsletterPage";
import CrmSubscribersPage from "./pages/crm/newsletter/CrmSubscribersPage";
import ProtectedCrmRoute from "./components/crm/ProtectedCrmRoute";
import CrmCampaignsPage from "./pages/crm/newsletter/CrmCampaignsPage";
import CrmNewNewsletterPage from "./pages/crm/newsletter/CrmNewNewsletterPage";

const router = createBrowserRouter([
	{
		path: "/crm/login",
		element: <CrmLoginPage />,
	},
	{
		path: "/crm",
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
		<WorkshopsProvider>
			<CrmAuthProvider>
				<RouterProvider router={router} />
			</CrmAuthProvider>
		</WorkshopsProvider>
	</StrictMode>,
);

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

const router = createBrowserRouter([
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
		<RouterProvider router={router} />
	</StrictMode>,
);

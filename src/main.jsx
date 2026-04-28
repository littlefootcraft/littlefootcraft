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
		children: [
			{ index: true, element: <HomePage /> },

			{
				path: "shop",
				element: <ShopLayout />,
				// ShopLayout - wraps all shop-related routes
				children: [
					{ index: true, element: <ShopPage /> },
					{
						path: ":sku",
						element: <ProductPage />,
						handle: { title: "Item" },
					},
					// { path: "promo", element: <PromoPage /> },
				],
			},

			{ path: "workshops", element: <WorkshopsPage /> },
			{ path: "about", element: <AboutPage /> },
			{ path: "faq", element: <FAQPage /> },
			// { path: "contact", element: <ContactPage /> },
		],
	},
	{
		path: "*",
		element: (
			<Navigate
				to="/en"
				replace
			/>
		),
	},
]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);

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
			{ path: "shop", element: <ShopPage /> },
			{ path: "workshops", element: <WorkshopsPage /> },
			{ path: "about", element: <AboutPage /> },
			{ path: "faq", element: <FAQPage /> },
			// { path: "contact", element: <ContactPage /> },
			{
				path: "shop/:sku",
				element: <ProductPage />,
				handle: { title: "Item" },
			},
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

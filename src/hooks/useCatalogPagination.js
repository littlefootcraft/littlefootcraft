import { useSearchParams } from "react-router-dom";

export const useCatalogPagination = (
	items,
	itemsPerPage = 12,
	pageKey = "page",
) => {
	const [searchParams, setSearchParams] = useSearchParams();

	// safe page (not exceeding max)
	const safeItems = items ?? [];

	// Gets current page from URL
	// const page = Number(searchParams.get("page")) || 1;
	const rawPage = Number(searchParams.get(pageKey)) || 1;
	const normalizedPage = Math.max(rawPage, 1);

	// Calculates how many pages exist.
	const totalPages = Math.ceil((safeItems.length ?? 0) / itemsPerPage);

	// If user manually types ?page=999, it falls back to the last real page
	// const safePage = totalPages > 0 ? Math.men(page, totalPages) : 1;
	const safePage = totalPages > 0 ? Math.min(normalizedPage, totalPages) : 1;

	const start = (safePage - 1) * itemsPerPage;
	const end = start + itemsPerPage;

	// Returns only items for current page
	const paginatedItems = safeItems.slice(start, end);

	const setParams = ({ page, ...filters }) => {
		const params = new URLSearchParams(searchParams);

		// if filters changed, reset page
		params.delete(pageKey);

		if (page && page > 1) {
			params.set(pageKey, String(page));
		}
		setSearchParams(params);
	};

	return { page: safePage, totalPages, paginatedItems, setParams };
};

// // ShopPage.jsx
// useCatalogPagination(allProducts, 20, "page");

// // SalePage.jsx
// useCatalogPagination(saleProducts, 20, "salePage");

import { useSearchParams } from "react-router-dom";

export const useCatalogPagination = (
	items,
	itemsPerPage = 12,
	pageKey = "page",
) => {
	const [searchParams, setSearchParams] = useSearchParams();

	const safeItems = items ?? [];

	// Read and validate the requested page
	const requestedPage = Number(searchParams.get(pageKey));

	const normalizedPage =
		Number.isSafeInteger(requestedPage) && requestedPage > 0
			? requestedPage
			: 1;

	// Calculate total pages
	const totalPages = Math.ceil(safeItems.length / itemsPerPage);

	// Keep page within available results
	const safePage = totalPages > 0 ? Math.min(normalizedPage, totalPages) : 1;

	// Paginate
	const start = (safePage - 1) * itemsPerPage;

	const paginatedItems = safeItems.slice(start, start + itemsPerPage);

	// Update page without removing other URL parameters
	const setParams = ({ page }) => {
		const nextPage = Number(page);

		if (!Number.isSafeInteger(nextPage) || nextPage < 1) {
			return;
		}

		setSearchParams((previous) => {
			const params = new URLSearchParams(previous);

			if (nextPage === 1) {
				params.delete(pageKey);
			} else {
				params.set(pageKey, String(nextPage));
			}

			return params;
		});
	};

	return {
		page: safePage,
		totalPages,
		paginatedItems,
		setParams,
	};
};

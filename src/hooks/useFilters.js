// src/hooks/useFilters.js
import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";

// These are the only filter keys we support.
// If it's not in this list, we ignore it.
const FILTERS_KEYS = ["category", "color", "collection"];

export const useFilters = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	// --- FILTERS ---
	// Read active filters from URL
	//?category=brooch&color=gold&color=pink
	// → { category: ["brooch"], color: ["gold", "pink"], collection: [] }
	const activeFilters = Object.fromEntries(
		FILTERS_KEYS.map((key) => [key, searchParams.getAll(key)]),
	); // { category: [], color: [], collection: [] }

	// Toggle one filter value on or off
	const toggleFilter = useCallback(
		(key, value) => {
			const params = new URLSearchParams(searchParams);
			const current = params.getAll(key);

			// Remove page on filter change
			params.delete("page"); // reset to page 1 on filter change

			if (current.includes(value)) {
				// It's already active → remove it
				params.delete(key);
				current
					.filter((v) => v !== value)
					.forEach((v) => params.append(key, v));
			} else {
				// It's not active → add it
				params.append(key, value);
			}

			setSearchParams(params);
		},
		[searchParams, setSearchParams],
	);

	// Remove all filters and sorting at once
	const clearFilters = useCallback(() => {
		const params = new URLSearchParams();
		params.delete("page");
		setSearchParams(params);
	}, [searchParams, setSearchParams]);

	// True if at least one filter has a value selected
	const hasActiveFilters = FILTERS_KEYS.some(
		(key) => activeFilters[key].length > 0,
	);

	// --- SORTING ---
	// Read current sort from URL, default to "newest"
	const sortKey = searchParams.get("sort") || "newest";

	// Write a new sort value into the URL
	const setSort = useCallback(
		(value) => {
			const params = new URLSearchParams(searchParams);
			params.set("sort", value);
			params.delete("page"); // reset to page 1 on sort change
			setSearchParams(params);
		},
		[searchParams, setSearchParams],
	);

	return {
		activeFilters,
		toggleFilter,
		clearFilters,
		hasActiveFilters,
		sortKey,
		setSort,
	};
};

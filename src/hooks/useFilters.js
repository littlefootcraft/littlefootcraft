// src/hooks/useFilters.js
import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";

// These are the only filter keys we support.
// If it's not in this list, we ignore it.
const FILTERS_KEYS = ["category", "color", "collection"];

export const useFilters = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const query = searchParams.get("search") || "";

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
			if (!FILTERS_KEYS.includes(key)) return;

			setSearchParams((previous) => {
				const params = new URLSearchParams(previous);
				const current = params.getAll(key);

				params.delete("page");

				if (current.includes(value)) {
					params.delete(key);

					current
						.filter((v) => v !== value)
						.forEach((v) => params.append(key, v));
				} else {
					params.append(key, value);
				}

				return params;
			});
		},
		[setSearchParams],
	);

	// Remove all filters and sorting at once
	const clearFilters = useCallback(() => {
		setSearchParams((previous) => {
			const params = new URLSearchParams(previous);

			FILTERS_KEYS.forEach((key) => params.delete(key));
			params.delete("page");

			return params;
		});
	}, [setSearchParams]);

	// True if at least one filter has a value selected
	const hasActiveFilters = FILTERS_KEYS.some(
		(key) => activeFilters[key].length > 0,
	);

	// --- SORTING ---
	// Read current sort from URL, default to "newest"
	const sortKey = searchParams.get("sort") || "newest";

	const setQuery = useCallback(
		(value) => {
			setSearchParams((previous) => {
				const params = new URLSearchParams(previous);

				if (value.trim()) {
					params.set("search", value);
				} else {
					params.delete("search");
				}

				params.delete("page");

				return params;
			});
		},
		[setSearchParams],
	);

	// Write a new sort value into the URL
	const setSort = useCallback(
		(value) => {
			setSearchParams((previous) => {
				const params = new URLSearchParams(previous);

				if (value === "newest") {
					params.delete("sort");
				} else {
					params.set("sort", value);
				}

				params.delete("page");
				return params;
			});
		},
		[setSearchParams],
	);

	return {
		activeFilters,
		toggleFilter,
		clearFilters,
		hasActiveFilters,
		sortKey,
		query,
		setQuery,
		setSort,
	};
};

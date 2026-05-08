//ShopToolbar.jsx
import { useEffect, useState } from "react";
import { SecondaryBtn } from "../components/SecondaryBtn";
import { ChevronDown } from "lucide-react";
import shopPage from "../content/pages/shop-page.json";
import { COLORS } from "../constants/filterOptions";
import categories from "../content/categories/categories.json";
import collections from "../content/collections/collections.json";

import {
	sortOptionsUA,
	sortOptionsEN,
	toolbarEN,
	toolbarUA,
} from "../translations/translation";
import { useLanguage } from "../context/LanguageContext";

export const ShopToolbar = ({
	query,
	onQueryChange,
	sortKey,
	onSortChange,
	onFiltersOpen,
	count,
	activeFilters,
	toggleFilter,
	clearFilters,
	hasActiveFilters,
}) => {
	const { currentLang, setCurrentLang } = useLanguage();
	const SORT_OPTIONS = currentLang === "en" ? sortOptionsEN : sortOptionsUA;
	const t = currentLang === "en" ? toolbarEN : toolbarUA;

	const tField = (field) => field?.[currentLang] ?? field?.en ?? "";
	//Dropdown sort menu
	const [isSortOpen, setIsSortOpen] = useState(false);
	const current = SORT_OPTIONS.find((o) => o.id === sortKey) || SORT_OPTIONS[0];

	// Turns { key: "color", value: "pink" } → "Pink"
	// Turns { key: "collection", value: "bloom-spell" } → "Bloom Spell"
	const getLabel = (key, value) => {
		if (key === "color") {
			const found = COLORS.find((c) => c.id === value);
			return found ? (currentLang === "ua" ? found.ua : found.en) : value;
		}
		if (key === "collection") {
			const found = collections.find((c) => c.id === value);
			return found ? tField(found.name) : value;
		}
		if (key === "category") {
			const found = categories.find((c) => c.id === value);
			return found ? tField(found.name) : value;
		}
		return value;
	};

	return (
		<div className="shop-toolbar">
			<div className="container">
				<div className="shop-toolbar__switchers">
					<SecondaryBtn
						variant="filter"
						onClick={onFiltersOpen}
					>
						{t.filters}
					</SecondaryBtn>

					<div className="shop-toolbar__sort">
						<button
							type="button"
							className={`shop-toolbar__sort-btn ${
								isSortOpen ? "shop-toolbar__sort-btn--open" : ""
							}`}
							onClick={() => setIsSortOpen((v) => !v)}
							aria-haspopup="listbox"
							aria-expanded={isSortOpen}
						>
							{current.label}
							<ChevronDown
								size={14}
								className="shop-toolbar__sort-arrow"
							/>
						</button>
						{isSortOpen && (
							<ul
								className="shop-toolbar__sort-menu"
								role="listbox"
							>
								{SORT_OPTIONS.map((o) => (
									<li
										key={o.id}
										className="shop-toolbar__sort-item"
									>
										<button
											type="button"
											className="shop-toolbar__sort-option"
											onClick={() => {
												onSortChange(o.id);
												setIsSortOpen(false);
											}}
											aria-selected={o.id === sortKey}
										>
											<span>{o.label}</span>
											{o.id === sortKey && (
												<span className="shop-toolbar__sort-check">
													{o.id === sortKey ? "✓" : ""}
												</span>
											)}
										</button>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>

				<div className="shop-toolbar__active-filters">
					{hasActiveFilters && (
						<>
							{/* Clear all link */}
							<button
								className="shop-toolbar__clear-all"
								onClick={clearFilters}
								type="button"
							>
								{currentLang === "ua" ? "Видалити все" : "Clear all"}
							</button>

							{/* One tag per active filter value */}
							{Object.entries(activeFilters).flatMap(([key, values]) =>
								values.map((value) => (
									<span
										key={`${key}-${value}`}
										className="shop-toolbar__filter-tag"
									>
										{getLabel(key, value)}
										<button
											className="shop-toolbar__filter-tag-remove"
											onClick={() => toggleFilter(key, value)}
											type="button"
											aria-label={`Remove ${value} filter`}
										>
											×
										</button>
									</span>
								)),
							)}
						</>
					)}
				</div>
				<span className="shop-toolbar__count">{t.itemsFound(count)}</span>
			</div>
		</div>
	);
};

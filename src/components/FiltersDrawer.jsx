// components/FiltersDrawer.jsx
import { useEffect, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { COLORS } from "../constants/filterOptions";
import categories from "../content/categories/categories.json";
import collections from "../content/collections/collections.json";

// A single collapsible section — Category, Collection, or Color
// isOpen and onToggle control whether the options are visible
const FilterSection = ({ title, isOpen, onToggle, children }) => (
	<div className="filters-drawer__section">
		<button
			className="filters-drawer__section-header"
			onClick={onToggle}
			type="button"
		>
			<span className="filters-drawer__section-title">{title}</span>
			<ChevronDown
				className={`filters-drawer__chevron ${isOpen ? "filters-drawer__chevron--open" : ""}`}
			/>
		</button>
		{isOpen && <div className="filters-drawer__section-body">{children}</div>}
	</div>
);

export const FiltersDrawer = ({
	isOpen,
	onClose,
	activeFilters,
	toggleFilter,
	clearFilters,
	hasActiveFilters,
}) => {
	const { currentLang } = useLanguage();
	const t = (field) => field?.[currentLang] ?? field?.en ?? "";

	// Which sections are open — all open by default
	// This is purely visual state, lives only in this component
	const [openSections, setOpenSections] = useState({
		category: true,
		collection: true,
		color: true,
	});

	const toggleSection = (key) => {
		setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	// Count total active filters for the badge
	const activeCount = Object.values(activeFilters).flat().length;

	// Prevent scroll when filters are open
	useEffect(() => {
		if (!isOpen) return;

		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = originalOverflow;
		};
	}, [isOpen]);

	return (
		<>
			{/* Backdrop — clicking outside closes the drawer */}
			<div
				className="filters-drawer__backdrop"
				onClick={onClose}
			/>

			<div className="filters-drawer">
				{/* Header */}
				<div className="filters-drawer__header">
					<div className="filters-drawer__header-left">
						<h2 className="filters-drawer__title">
							{currentLang === "ua" ? "Фільтри" : "Filters"}
						</h2>
						{activeCount > 0 && (
							<span className="filters-drawer__count">{activeCount}</span>
						)}
					</div>
					<button
						className="filters-drawer__close"
						onClick={onClose}
						type="button"
						aria-label="Close filters"
					>
						<X />
					</button>
				</div>

				{/* Scrollable filter sections */}
				<div className="filters-drawer__sections">
					{/* Category */}
					<FilterSection
						title={currentLang === "ua" ? "Категорії" : "Category"}
						isOpen={openSections.category}
						onToggle={() => toggleSection("category")}
					>
						<div className="filters-drawer__options">
							{categories.map((cat) => {
								const isActive = activeFilters.category.includes(cat.id);
								return (
									<button
										key={cat.id}
										className={`filters-drawer__option ${isActive ? "filters-drawer__option--active" : ""}`}
										onClick={() => toggleFilter("category", cat.id)}
										type="button"
									>
										{t(cat.name)}
									</button>
								);
							})}
						</div>
					</FilterSection>

					{/* Collection */}
					<FilterSection
						title={currentLang === "ua" ? "Колекція" : "Collection"}
						isOpen={openSections.collection}
						onToggle={() => toggleSection("collection")}
					>
						<div className="filters-drawer__options">
							{collections.map((col) => {
								const isActive = activeFilters.collection.includes(col.id);
								return (
									<button
										key={col.id}
										className={`filters-drawer__option ${isActive ? "filters-drawer__option--active" : ""}`}
										onClick={() => toggleFilter("collection", col.id)}
										type="button"
									>
										{t(col.name)}
									</button>
								);
							})}
						</div>
					</FilterSection>

					{/* Color — swatches instead of text buttons */}
					<FilterSection
						title={currentLang === "ua" ? "Колір" : "Color"}
						isOpen={openSections.color}
						onToggle={() => toggleSection("color")}
					>
						<div className="filters-drawer__colors">
							{COLORS.map((color) => {
								const isActive = activeFilters.color.includes(color.id);
								return (
									<button
										key={color.id}
										className={`filters-drawer__color-btn ${isActive ? "filters-drawer__color-btn--active" : ""}`}
										onClick={() => toggleFilter("color", color.id)}
										type="button"
										title={t({ en: color.en, ua: color.ua })}
										aria-label={t({ en: color.en, ua: color.ua })}
										aria-pressed={isActive}
									>
										{/* Swatch circle */}
										<span
											className="filters-drawer__color-swatch"
											style={{
												backgroundColor: color.hex ?? "transparent",
												// multicolor gets a gradient instead
												background: color.hex
													? color.hex
													: "linear-gradient(135deg, red, orange, yellow, green, blue, violet)",
											}}
										/>
										<span className="filters-drawer__color-label">
											{t({ en: color.en, ua: color.ua })}
										</span>
									</button>
								);
							})}
						</div>
					</FilterSection>
				</div>

				{/* Footer — clear button, only visible when filters are active */}
				{hasActiveFilters && (
					<div className="filters-drawer__footer">
						<button
							className="filters-drawer__clear"
							onClick={clearFilters}
							type="button"
						>
							{currentLang === "ua" ? "Очистити фільтри" : "Clear all filters"}
						</button>
					</div>
				)}
			</div>
		</>
	);
};

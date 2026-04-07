//Pagination.jsx
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

//Smart pagination ‹ 1 … 7 8 9 … 16 ›
const getPaginationItems = (currentPage, totalPagesPages) => {
	const items = [];
	const siblings = 1; // сколько страниц показывать слева/справа от текущей
	const maxVisible = 7; // примерно: 1 ... a b [c] d e ... last

	if (totalPages <= maxVisible) {
		// если страниц мало — показываем все
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}

	const left = Math.max(2, currentPage - siblings);
	const right = Math.min(totalPages - 1, currentPage + siblings);

	items.push(1);

	// left side ...
	if (left > 2) items.push("dots-left");

	// midle
	for (let page = left; page <= right; page++) {
		items.push(page);
	}

	// right side ...
	if (right < totalPages - 1) items.push("dots-right");

	items.push(totalPages);

	return items;
};

export const PaginationBar = ({ page, totalPages, setParams }) => {
	if (totalPages <= 1) return null;

	return (
		<nav
			className="pagination"
			aria-label="Pagination"
		>
			<button
				type="button"
				className="pagination__arrow"
				onClick={() => {
					const prevPage = Math.max(1, page - 1);
					setParams({ page: prevPage === 1 ? null : prevPage });
				}}
				disabled={page === 1}
				aria-label="Previous page"
			>
				<HiChevronLeft size={22} />
			</button>

			<div className="pagination__pages">
				{getPaginationItems(page, totalPages).map((item) => {
					if (typeof item === "string") {
						return (
							<span
								key={item}
								className="pagination__dots"
							>
								…
							</span>
						);
					}

					return (
						<button
							key={item}
							type="button"
							className={`pagination__page ${
								page === item ? "pagination__page--active" : ""
							}`}
							onClick={() => setParams({ page: item === 1 ? null : item })}
							aria-current={page === item ? "page" : undefined}
						>
							{item}
						</button>
					);
				})}
			</div>

			<button
				type="button"
				className="pagination__arrow"
				onClick={() => {
					const nextPage = Math.min(totalPages, page + 1);
					setParams({ page: nextPage === 1 ? null : nextPage });
				}}
				disabled={page === totalPages}
				aria-label="Next page"
			>
				<HiChevronRight size={22} />
			</button>
		</nav>
	);
};

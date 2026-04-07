//ShopPage.jsx
import { useOutletContext } from "react-router-dom";
import { useCatalogPagination } from "../hooks/useCatalogPagination";
import { PaginationBar } from "../components/Pagination";
import { ProductCard } from "../components/ProductCard";

const ShopPage = () => {
	// //For pagination
	// const { page, totalPages, paginatedItems, setParams } = useCatalogPagination(
	// 	// visibleProducts,
	// 	20,
	// ); // number is amount visible cards
	return (
		<section className="shop-page">
			<div className="shop-page__top container">
				<h1 className="shop-page__top-title">Enchanted Treasures</h1>
				<span className="shop-page__top-text text">
					Each piece is handcrafted with care and imbued with magic. Find your
					perfect treasure.
				</span>
			</div>
			<div className="shop-page__cards container"></div>

			<div className="shop-page__pagination-slot">
				{/* <PaginationBar
					page={page}
					totalPages={totalPages}
					setParams={setParams}
				/> */}
			</div>
		</section>
	);
};

export default ShopPage;

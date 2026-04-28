//PromoPage.jsx

import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";

const PromoPage = () => {
	const { setPageTitle } = useOutletContext();

	// {product.oldPrice && (
	//     <span className="product-card__badge">Sale</span>
	// )}

	return <div>PromoPage</div>;
};

export default PromoPage;

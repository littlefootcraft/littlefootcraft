//useProductCardState.js
// import { useMemo, useState } from "react";

export function useProductCardState(product) {
	// const photos = product?.photo ?? [];
	const selectedSku = product?.sku ?? null;
	const image = product?.photo?.[0]?.src ?? null;

	// const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

	// const image = photos[selectedPhotoIndex]?.src ?? photos[0]?.src ?? null;

	// const shownPhotos = useMemo(() => {
	// 	return photos.slice(0, 4);
	// }, [photos]);

	// const restCount = Math.max(photos.length - shownPhotos.length, 0);
	return {
		image,
		selectedSku,
		// selectedPhotoIndex,
		// setSelectedPhotoIndex,
		// shownPhotos,
		// restCount,
	};
}

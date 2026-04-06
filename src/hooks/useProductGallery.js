import { useState } from "react";

export function useProductGallery(product) {
	const photos = product?.photo ?? [];
	const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

	const image = photos[selectedPhotoIndex]?.src ?? photos[0]?.src ?? null;

	return {
		photos,
		image,
		selectedPhotoIndex,
		setSelectedPhotoIndex,
	};
}

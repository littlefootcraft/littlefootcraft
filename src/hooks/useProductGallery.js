import { useState } from "react";

export function useProductGallery(product) {
	// All photos for this product, or empty array if none
	const photos = product?.photo ?? [];

	// Which photo index is currently shown large
	const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

	// The current main image — whichever index is selected
	// If somehow the index is out of range, fall back to first photo
	const mainImage = photos[selectedIndex] ?? photos[0] ?? null;

	// Thumbnails — all photos, we'll show them all in a strip
	// useMemo so this array isn't recreated on every render
	const thumbnails = useMemo(() => photos, [photos]);

	return {
		mainImage, // { src, alt: { en, ua } }
		thumbnails, // array of { src, alt }
		selectedIndex,
		setSelectedIndex,
	};
}

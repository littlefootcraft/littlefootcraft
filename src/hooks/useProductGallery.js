// src/hooks/useProductGallery.js
import { useState, useMemo, useEffect } from "react";

export function useProductGallery(product) {
	const photos = product?.photo ?? [];
	const hasVideo = Boolean(product?.video);

	// Build the full media list — video first (if exists), then photos
	// Each item has a type so the gallery knows how to render it
	const mediaItems = useMemo(() => {
		const items = [];

		if (hasVideo) {
			items.push({
				type: "video",
				src: product.video,
				alt: null,
			});
		}

		photos.forEach((photo) => {
			items.push({
				type: "image",
				src: photo.src,
				alt: photo.alt, // { en, ua } object — use t() when rendering
			});
		});

		return items;
	}, [photos, hasVideo, product?.video]);

	const [activeIndex, setActiveIndex] = useState(0);
	const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

	// Reset to first item when product changes
	useEffect(() => {
		setActiveIndex(0);
	}, [product?.sku]);

	const activeItem = mediaItems[activeIndex] ?? null;

	// When user clicks a thumbnail
	const handleThumbClick = (index) => {
		const item = mediaItems[index];
		if (item?.type === "video") {
			// Clicking video thumbnail opens modal, doesn't change main image
			setIsVideoModalOpen(true);
		} else {
			setActiveIndex(index);
		}
	};

	const goToPrev = () => setActiveIndex((i) => Math.max(i - 1, 0));
	const goToNext = () =>
		setActiveIndex((i) => Math.min(i + 1, mediaItems.length - 1));

	return {
		mediaItems,
		activeIndex,
		activeItem,
		isVideoModalOpen,
		setIsVideoModalOpen,
		handleThumbClick,
		goToPrev,
		goToNext,
	};
}

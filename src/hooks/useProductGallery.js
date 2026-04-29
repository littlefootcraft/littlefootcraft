// src/hooks/useProductGallery.js
import { useState, useMemo, useEffect } from "react";

export function useProductGallery(product) {
	const photos = product?.photo ?? [];
	const video = product?.video ?? null; // now an object { src, alt }

	const mediaItems = useMemo(() => {
		const items = [];

		// Video first
		if (video) {
			items.push({
				type: "video",
				src: video.src,
				alt: video.alt,
			});
		}

		// Photos after
		photos.forEach((photo) => {
			items.push({
				type: "image",
				src: photo.src,
				alt: photo.alt,
			});
		});

		return items;
	}, [photos, video]);

	const [activeIndex, setActiveIndex] = useState(0);
	const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

	// Reset when product changes
	useEffect(() => {
		setActiveIndex(video ? 1 : 0);
	}, [product?.sku]);

	const activeItem = mediaItems[activeIndex] ?? null;

	const handleThumbClick = (index) => {
		const item = mediaItems[index];
		if (item?.type === "video") {
			// clicking video thumbnail opens modal, doesn't swap main image
			setIsVideoModalOpen(true);
		} else {
			setActiveIndex(index);
		}
	};

	const goToPrev = () => {
		setActiveIndex((i) => {
			const prev = i - 1;
			// skip video index (0) when navigating with arrows
			if (mediaItems[prev]?.type === "video") return i;
			return Math.max(prev, 0);
		});
	};

	const goToNext = () => {
		// skip video index when navigating with arrows
		setActiveIndex((i) => Math.min(i + 1, mediaItems.length - 1));
	};

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

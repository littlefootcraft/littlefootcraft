import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useParams } from "react-router-dom";

// SUPABASE
import { supabase } from "../../../../lib/supabaseClient";

const getInventoryStatus = (item) => {
	const available = item.quantity - item.reserved_quantity;

	if (item.quantity === 0 && item.sold_at) {
		return "sold";
	}

	if (available === 0 && item.reserved_quantity > 0) {
		return "pending";
	}

	return "in_stock";
};

const getStatusLabel = (status) => {
	switch (status) {
		case "in_stock":
			return "In stock";

		case "pending":
			return "Pending";

		case "sold":
			return "Sold";

		default:
			return status;
	}
};

const CrmInventoryDetailsPage = () => {
	const { sku } = useParams();

	const [product, setProduct] = useState(null);
	const [inventory, setInventory] = useState(null);
	const [artist, setArtist] = useState(null);

	const [quantity, setQuantity] = useState("");
	const [reservedQuantity, setReservedQuantity] = useState("");

	const [status, setStatus] = useState("loading");
	const [saveStatus, setSaveStatus] = useState("idle");
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		const loadProduct = async () => {
			try {
				setStatus("loading");
				setErrorMessage("");

				// ========================================
				// PRODUCT
				// ========================================

				const productsResponse = await fetch("/data/products.json");

				if (!productsResponse.ok) {
					throw new Error("Could not load products.");
				}

				const productsData = await productsResponse.json();

				const currentProduct = productsData.find((item) => item.sku === sku);

				if (!currentProduct) {
					throw new Error("Product not found.");
				}

				// ========================================
				// INVENTORY + LOCATION
				// ========================================

				const { data: inventoryData, error: inventoryError } = await supabase
					.from("product_inventory")
					.select(
						`
								id,
								sku,
								location_id,
								quantity,
								reserved_quantity,
								created_at,
								updated_at,
								sold_at,
								location:inventory_locations (
									id,
									code,
									name,
									country_code,
									country_name,
									city
								)
							`,
					)
					.eq("sku", sku)
					.single();

				if (inventoryError) {
					throw inventoryError;
				}

				// ========================================
				// ARTIST
				// ========================================

				let artistData = null;

				if (currentProduct.artist) {
					const { data, error: artistError } = await supabase
						.from("artists")
						.select(
							`
								id,
								name,
								slug,
								country_code,
								country_name,
								city,
								is_active
							`,
						)
						.eq("slug", currentProduct.artist)
						.maybeSingle();

					if (artistError) {
						throw artistError;
					}

					artistData = data;
				}

				setProduct(currentProduct);
				setInventory(inventoryData);
				setArtist(artistData);

				setQuantity(String(inventoryData.quantity));
				setReservedQuantity(String(inventoryData.reserved_quantity));

				setStatus("success");
			} catch (error) {
				console.error("Failed to load inventory details:", error);

				setStatus("error");
				setErrorMessage(error.message || "Could not load inventory details.");
			}
		};

		loadProduct();
	}, [sku]);

	const available = useMemo(() => {
		if (!inventory) return 0;

		return inventory.quantity - inventory.reserved_quantity;
	}, [inventory]);

	const inventoryStatus = useMemo(() => {
		if (!inventory) return null;

		return getInventoryStatus(inventory);
	}, [inventory]);

	const isNew = product?.badges?.isNew === true;

	const isSale =
		product?.oldPrice != null && product?.oldPrice > product?.price;

	const discountPercent = useMemo(() => {
		if (!isSale) return null;

		return Math.round(
			((product.oldPrice - product.price) / product.oldPrice) * 100,
		);
	}, [product, isSale]);

	const handleSave = async () => {
		const nextQuantity = Number(quantity);
		const nextReservedQuantity = Number(reservedQuantity);

		if (
			!Number.isInteger(nextQuantity) ||
			nextQuantity < 0 ||
			!Number.isInteger(nextReservedQuantity) ||
			nextReservedQuantity < 0
		) {
			setSaveStatus("error");
			setErrorMessage("Quantity and reserved quantity must be whole numbers.");
			return;
		}

		if (nextReservedQuantity > nextQuantity) {
			setSaveStatus("error");
			setErrorMessage("Reserved quantity cannot be greater than quantity.");
			return;
		}

		try {
			setSaveStatus("loading");
			setErrorMessage("");

			const soldAt =
				nextQuantity === 0
					? (inventory.sold_at ?? new Date().toISOString())
					: null;

			const { data, error } = await supabase
				.from("product_inventory")
				.update({
					quantity: nextQuantity,
					reserved_quantity: nextReservedQuantity,
					sold_at: soldAt,
				})
				.eq("sku", sku)
				.select(
					`
						id,
						sku,
						location_id,
						quantity,
						reserved_quantity,
						created_at,
						updated_at,
						sold_at,
						location:inventory_locations (
							id,
							code,
							name,
							country_code,
							country_name,
							city
						)
					`,
				)
				.single();

			if (error) {
				throw error;
			}

			setInventory(data);
			setQuantity(String(data.quantity));
			setReservedQuantity(String(data.reserved_quantity));

			setSaveStatus("success");
		} catch (error) {
			console.error("Failed to update inventory:", error);

			setSaveStatus("error");
			setErrorMessage(error.message || "Inventory could not be updated.");
		}
	};

	if (status === "loading") {
		return (
			<section className="crm-inventory-details">
				<p className="crm-inventory-details__state">
					Loading inventory details...
				</p>
			</section>
		);
	}

	if (status === "error") {
		return (
			<section className="crm-inventory-details">
				<Link
					to="/crm/inventory"
					className="crm-inventory-details__back"
				>
					<ArrowLeft size={17} />
					Back to inventory
				</Link>

				<p className="crm-inventory-details__state crm-inventory-details__state--error">
					{errorMessage}
				</p>
			</section>
		);
	}

	const mainPhoto = product.photo?.[0]?.src;

	return (
		<section className="crm-inventory-details">
			<Link
				to="/crm/inventory"
				className="crm-inventory-details__back"
			>
				<ArrowLeft size={17} />
				Back to inventory
			</Link>

			<div className="crm-inventory-details__header">
				<div>
					<p className="crm-inventory-details__eyebrow">Inventory</p>

					<h1 className="crm-inventory-details__title">{product.name?.en}</h1>

					<p className="crm-inventory-details__sku">{product.sku}</p>
				</div>

				<div className="crm-inventory-details__badges">
					{isNew && (
						<span className="crm-inventory-details__badge crm-inventory-details__badge--new">
							New
						</span>
					)}

					{isSale && (
						<span className="crm-inventory-details__badge crm-inventory-details__badge--sale">
							Sale
						</span>
					)}

					<span
						className={`crm-inventory-details__status crm-inventory-details__status--${inventoryStatus}`}
					>
						{getStatusLabel(inventoryStatus)}
					</span>
				</div>
			</div>

			<div className="crm-inventory-details__layout">
				<div className="crm-inventory-details__product-card">
					{mainPhoto && (
						<img
							src={mainPhoto}
							alt={product.name?.en ?? product.sku}
							className="crm-inventory-details__image"
						/>
					)}

					<div className="crm-inventory-details__product-info">
						<div className="crm-inventory-details__row">
							<span>Category</span>

							<strong>{product.specifications?.category?.en ?? "—"}</strong>
						</div>

						<div className="crm-inventory-details__row">
							<span>Collection</span>

							<strong>{product.specifications?.collection ?? "—"}</strong>
						</div>

						<div className="crm-inventory-details__row">
							<span>Artist</span>

							<strong>
								{artist ? (
									<Link
										to={`/crm/artists/${artist.id}`}
										className="crm-inventory-details__artist-link"
									>
										{artist.name}
									</Link>
								) : (
									"—"
								)}
							</strong>
						</div>

						<div className="crm-inventory-details__row">
							<span>Price</span>
							<strong>${product.price}</strong>
						</div>

						{isSale && (
							<>
								<div className="crm-inventory-details__row">
									<span>Old price</span>
									<strong>${product.oldPrice}</strong>
								</div>

								<div className="crm-inventory-details__row">
									<span>Discount</span>
									<strong>{discountPercent}%</strong>
								</div>
							</>
						)}
					</div>
				</div>

				<div className="crm-inventory-details__inventory-card">
					<div className="crm-inventory-details__section-header">
						<div>
							<h2>Inventory</h2>

							<p>Update live stock information for this product.</p>
						</div>
					</div>

					<div className="crm-inventory-details__form">
						<label className="crm-inventory-details__field">
							<span>Quantity</span>

							<input
								type="number"
								min="0"
								step="1"
								value={quantity}
								onChange={(e) => setQuantity(e.target.value)}
							/>
						</label>

						<label className="crm-inventory-details__field">
							<span>Reserved</span>

							<input
								type="number"
								min="0"
								step="1"
								value={reservedQuantity}
								onChange={(e) => setReservedQuantity(e.target.value)}
							/>
						</label>
					</div>

					<div className="crm-inventory-details__summary">
						<div className="crm-inventory-details__row">
							<span>Available</span>
							<strong>{available}</strong>
						</div>

						<div className="crm-inventory-details__row">
							<span>Status</span>

							<strong>{getStatusLabel(inventoryStatus)}</strong>
						</div>

						<div className="crm-inventory-details__row">
							<span>Location</span>

							<strong>
								{inventory.location ? (
									<>
										{inventory.location.city || inventory.location.name},{" "}
										{inventory.location.country_name}
									</>
								) : (
									"—"
								)}
							</strong>
						</div>

						<div className="crm-inventory-details__row">
							<span>Last updated</span>

							<strong>
								{new Date(inventory.updated_at).toLocaleString("en-US", {
									month: "short",
									day: "numeric",
									year: "numeric",
									hour: "numeric",
									minute: "2-digit",
								})}
							</strong>
						</div>

						<div className="crm-inventory-details__row">
							<span>Sold at</span>

							<strong>
								{inventory.sold_at
									? new Date(inventory.sold_at).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										})
									: "—"}
							</strong>
						</div>
					</div>

					{errorMessage && saveStatus === "error" && (
						<p className="crm-inventory-details__message crm-inventory-details__message--error">
							{errorMessage}
						</p>
					)}

					{saveStatus === "success" && (
						<p className="crm-inventory-details__message crm-inventory-details__message--success">
							Inventory updated.
						</p>
					)}

					<button
						type="button"
						className="crm-inventory-details__save"
						onClick={handleSave}
						disabled={saveStatus === "loading"}
					>
						<Save size={17} />

						{saveStatus === "loading" ? "Saving..." : "Save inventory"}
					</button>
				</div>
			</div>
		</section>
	);
};

export default CrmInventoryDetailsPage;

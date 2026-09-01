import { useEffect, useMemo, useState } from "react";
import { Package, Search } from "lucide-react";
import { Link } from "react-router-dom";

// SUPABASE
import { supabase } from "../../../../lib/supabaseClient";

// COMPONENTS
import { CrmSelect } from "../../../../components/crm/CrmSelect";
import { CrmFlagBadge } from "../../../../components/crm/CrmFlagBadge";

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

const CrmInventoryPage = () => {
	const [products, setProducts] = useState([]);
	const [inventory, setInventory] = useState([]);

	const [search, setSearch] = useState("");
	const [category, setCategory] = useState("all");
	const [status, setStatus] = useState("all");
	const [productFlag, setProductFlag] = useState("all");

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const loadInventory = async () => {
			setLoading(true);
			setError("");

			try {
				// 1. LOAD PRODUCTS FROM JSON
				const productsResponse = await fetch("/data/products.json");

				if (!productsResponse.ok) {
					throw new Error("Could not load products.");
				}

				const productsData = await productsResponse.json();

				// 2. LOAD INVENTORY LOCATIONS
				const { data: locationsData, error: locationsError } = await supabase
					.from("inventory_locations")
					.select(
						`
			id,
			code,
			name,
			country_code,
			country_name,
			city,
			is_active
		`,
					)
					.eq("is_active", true);

				if (locationsError) {
					throw locationsError;
				}

				const locations = locationsData ?? [];

				const locationByCode = new Map(
					locations.map((location) => [location.code, location]),
				);

				// 3. LOAD EXISTING INVENTORY

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
					.order("updated_at", { ascending: false });

				if (inventoryError) {
					throw inventoryError;
				}

				let existingInventory = inventoryData ?? [];

				// 4. ASSIGN LOCATIONS TO EXISTING INVENTORY THAT HAS NO LOCATION YET
				const inventoryWithoutLocation = existingInventory.filter(
					(item) => !item.location_id,
				);

				if (inventoryWithoutLocation.length > 0) {
					for (const inventoryItem of inventoryWithoutLocation) {
						const product = productsData.find(
							(item) => item.sku === inventoryItem.sku,
						);

						if (!product?.inventoryLocation) {
							continue;
						}

						const location = locationByCode.get(product.inventoryLocation);

						if (!location) {
							throw new Error(
								`Inventory location "${product.inventoryLocation}" was not found for SKU ${product.sku}.`,
							);
						}

						const { error: updateLocationError } = await supabase
							.from("product_inventory")
							.update({
								location_id: location.id,
							})
							.eq("id", inventoryItem.id);

						if (updateLocationError) {
							throw updateLocationError;
						}
					}

					const { data: refreshedInventory, error: refreshError } =
						await supabase
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
							.order("updated_at", { ascending: false });

					if (refreshError) {
						throw refreshError;
					}

					existingInventory = refreshedInventory ?? [];
				}

				// 5. FIND PRODUCTS THAT DO NOT HAVE INVENTORY YET
				const existingSkus = new Set(existingInventory.map((item) => item.sku));

				const missingInventory = productsData
					.filter((product) => !existingSkus.has(product.sku))
					.map((product) => {
						if (!product.inventoryLocation) {
							throw new Error(
								`Inventory location is missing for SKU ${product.sku}.`,
							);
						}

						const location = locationByCode.get(product.inventoryLocation);

						if (!location) {
							throw new Error(
								`Inventory location "${product.inventoryLocation}" was not found for SKU ${product.sku}.`,
							);
						}

						return {
							sku: product.sku,
							location_id: location.id,
							quantity: 1,
							reserved_quantity: 0,
						};
					});

				let completeInventory = existingInventory;

				// 6. CREATE MISSING INVENTORY ROWS
				if (missingInventory.length > 0) {
					const { data: insertedInventory, error: insertError } = await supabase
						.from("product_inventory")
						.insert(missingInventory)
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
						);

					if (insertError) {
						throw insertError;
					}

					completeInventory = [
						...existingInventory,
						...(insertedInventory ?? []),
					];
				}

				setProducts(productsData);
				setInventory(completeInventory);
			} catch (err) {
				console.error("Inventory loading error:", err);

				setError(err.message || "Could not load inventory.");
			} finally {
				setLoading(false);
			}
		};

		loadInventory();
	}, []);

	const inventoryMap = useMemo(() => {
		return new Map(inventory.map((item) => [item.sku, item]));
	}, [inventory]);

	const inventoryProducts = useMemo(() => {
		return products
			.map((product) => {
				const inventoryItem = inventoryMap.get(product.sku);

				if (!inventoryItem) {
					return null;
				}

				const available =
					inventoryItem.quantity - inventoryItem.reserved_quantity;

				const inventoryStatus = getInventoryStatus(inventoryItem);

				const isNew = product.badges?.isNew === true;

				const isSale =
					product.oldPrice != null && product.oldPrice > product.price;

				return {
					...product,
					inventory: inventoryItem,
					available,
					inventoryStatus,
					isNew,
					isSale,
				};
			})
			.filter(Boolean);
	}, [products, inventoryMap]);

	const categories = useMemo(() => {
		const values = products
			.map((product) => product.specifications?.category?.en)
			.filter(Boolean);

		return [...new Set(values)].sort();
	}, [products]);

	const filteredProducts = useMemo(() => {
		const normalizedSearch = search.trim().toLowerCase();

		return inventoryProducts.filter((product) => {
			const productName = product.name?.en?.toLowerCase() ?? "";

			const sku = product.sku?.toLowerCase() ?? "";

			const productCategory = product.specifications?.category?.en ?? "";

			const matchesSearch =
				!normalizedSearch ||
				productName.includes(normalizedSearch) ||
				sku.includes(normalizedSearch);

			const matchesCategory =
				category === "all" || productCategory === category;

			const matchesStatus =
				status === "all" || product.inventoryStatus === status;

			let matchesProductFlag = true;

			if (productFlag === "new") {
				matchesProductFlag = product.isNew;
			}

			if (productFlag === "sale") {
				matchesProductFlag = product.isSale;
			}

			return (
				matchesSearch && matchesCategory && matchesStatus && matchesProductFlag
			);
		});
	}, [inventoryProducts, search, category, status, productFlag]);

	// Inventory summary calculations
	const showingSummary = useMemo(() => {
		return {
			results: filteredProducts.length,

			inStock: filteredProducts.filter(
				(product) => product.inventoryStatus === "in_stock",
			).length,

			pending: filteredProducts.filter(
				(product) => product.inventoryStatus === "pending",
			).length,

			sold: filteredProducts.filter(
				(product) => product.inventoryStatus === "sold",
			).length,
		};
	}, [filteredProducts]);

	const inventorySummary = useMemo(() => {
		return {
			results: inventoryProducts.length,

			inStock: inventoryProducts.filter(
				(product) => product.inventoryStatus === "in_stock",
			).length,

			pending: inventoryProducts.filter(
				(product) => product.inventoryStatus === "pending",
			).length,

			sold: inventoryProducts.filter(
				(product) => product.inventoryStatus === "sold",
			).length,
		};
	}, [inventoryProducts]);

	if (loading) {
		return (
			<section className="crm-inventory">
				<p className="crm-inventory__state">Loading inventory...</p>
			</section>
		);
	}

	if (error) {
		return (
			<section className="crm-inventory">
				<p className="crm-inventory__state crm-inventory__state--error">
					{error}
				</p>
			</section>
		);
	}

	return (
		<section className="crm-inventory">
			<div className="crm-inventory__header">
				<div>
					<h1 className="crm-inventory__title">Inventory</h1>

					<p className="crm-inventory__subtitle">
						Track product availability, reservations, and sold items.
					</p>
				</div>

				{/* SUMMARY */}
				<div className="crm-inventory__summary">
					<div className="crm-inventory__summary-row">
						<div className="crm-inventory__summary-heading">
							<span className="crm-inventory__summary-heading-title">
								Inventory
							</span>

							<span className="crm-inventory__summary-heading-text">
								All products
							</span>
						</div>

						<div className="crm-inventory__summary-item">
							<span className="crm-inventory__summary-value">
								{inventorySummary.results}
							</span>

							<span className="crm-inventory__summary-label">Results</span>
						</div>

						<div className="crm-inventory__summary-item">
							<span className="crm-inventory__summary-value">
								{inventorySummary.inStock}
							</span>

							<span className="crm-inventory__summary-label">In stock</span>
						</div>

						<div className="crm-inventory__summary-item">
							<span className="crm-inventory__summary-value">
								{inventorySummary.pending}
							</span>

							<span className="crm-inventory__summary-label">Pending</span>
						</div>

						<div className="crm-inventory__summary-item">
							<span className="crm-inventory__summary-value">
								{inventorySummary.sold}
							</span>

							<span className="crm-inventory__summary-label">Sold</span>
						</div>
					</div>

					<div className="crm-inventory__summary-row">
						<div className="crm-inventory__summary-heading">
							<span className="crm-inventory__summary-heading-title">
								Showing
							</span>

							<span className="crm-inventory__summary-heading-text">
								Current filters
							</span>
						</div>

						<div className="crm-inventory__summary-item">
							<span className="crm-inventory__summary-value">
								{showingSummary.results}
							</span>

							<span className="crm-inventory__summary-label">Results</span>
						</div>

						<div className="crm-inventory__summary-item">
							<span className="crm-inventory__summary-value">
								{showingSummary.inStock}
							</span>

							<span className="crm-inventory__summary-label">In stock</span>
						</div>

						<div className="crm-inventory__summary-item">
							<span className="crm-inventory__summary-value">
								{showingSummary.pending}
							</span>

							<span className="crm-inventory__summary-label">Pending</span>
						</div>

						<div className="crm-inventory__summary-item">
							<span className="crm-inventory__summary-value">
								{showingSummary.sold}
							</span>

							<span className="crm-inventory__summary-label">Sold</span>
						</div>
					</div>
				</div>
			</div>

			{/* TOOLBAR */}
			<div className="crm-inventory__toolbar">
				<div className="crm-inventory__search">
					<Search
						size={18}
						className="crm-inventory__search-icon"
					/>

					<input
						type="search"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search product or SKU"
						className="crm-inventory__search-input"
					/>
				</div>

				<div className="crm-inventory__select-wrap">
					<div className="crm-inventory__select">
						<CrmSelect
							value={category}
							onChange={setCategory}
							ariaLabel="Filter by category"
							options={[
								{
									value: "all",
									label: "All categories",
								},
								...categories.map((item) => ({
									value: item,
									label: item,
								})),
							]}
						/>
					</div>
					<div className="crm-inventory__select">
						<CrmSelect
							value={status}
							onChange={setStatus}
							ariaLabel="Filter by inventory status"
							options={[
								{
									value: "all",
									label: "All statuses",
								},
								{
									value: "in_stock",
									label: "In stock",
								},
								{
									value: "pending",
									label: "Pending",
								},
								{
									value: "sold",
									label: "Sold",
								},
							]}
						/>
					</div>
					<div className="crm-inventory__select">
						<CrmSelect
							value={productFlag}
							onChange={setProductFlag}
							ariaLabel="Filter by product flag"
							options={[
								{
									value: "all",
									label: "All products",
								},
								{
									value: "new",
									label: "New",
								},
								{
									value: "sale",
									label: "Sale",
								},
							]}
						/>
					</div>
				</div>
			</div>

			{/* TABLE */}
			<div className="crm-inventory__table-wrap">
				<table className="crm-inventory__table">
					<thead>
						<tr>
							<th>Flag</th>
							<th>Product</th>
							<th>SKU</th>
							<th>Category</th>
							<th>Quantity</th>
							<th>Reserved</th>
							<th>Available</th>
							<th>Status</th>
							<th>Location</th>
							<th>Updated</th>
						</tr>
					</thead>

					<tbody>
						{filteredProducts.map((product) => (
							<tr key={product.sku}>
								<td>
									<div className="crm-inventory__flags">
										{product.isNew && (
											<CrmFlagBadge variant="new">New</CrmFlagBadge>
										)}

										{product.isSale && (
											<CrmFlagBadge variant="sale">Sale</CrmFlagBadge>
										)}
									</div>
								</td>

								<td>
									<div className="crm-inventory__product">
										<Link
											to={`/crm/inventory/${product.sku}`}
											className="crm-inventory__product-name"
										>
											{product.name?.en}
										</Link>
									</div>
								</td>

								<td>
									<span className="crm-inventory__sku">{product.sku}</span>
								</td>

								<td>{product.specifications?.category?.en}</td>

								<td className="crm-inventory__quantity">
									{product.inventory.quantity}
								</td>

								<td className="crm-inventory__reserved">
									{product.inventory.reserved_quantity}
								</td>

								<td className="crm-inventory__available">
									{product.available}
								</td>

								<td>
									<span
										className={`crm-inventory__status crm-inventory__status--${product.inventoryStatus}`}
									>
										{getStatusLabel(product.inventoryStatus)}
									</span>
								</td>
								<td className="crm-inventory__location">
									{product.inventory.location ? (
										<>
											<span className="crm-inventory__location-city">
												{product.inventory.location.city ||
													product.inventory.location.name}
											</span>

											<span className="crm-inventory__location-country">
												{product.inventory.location.country_name}
											</span>
										</>
									) : (
										<span>—</span>
									)}
								</td>
								<td className="crm-inventory__updated">
									{new Date(product.inventory.updated_at).toLocaleDateString(
										"en-US",
										{
											month: "short",
											day: "numeric",
											year: "numeric",
										},
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{filteredProducts.length === 0 && (
					<div className="crm-inventory__empty">No inventory items found.</div>
				)}
			</div>
		</section>
	);
};

export default CrmInventoryPage;

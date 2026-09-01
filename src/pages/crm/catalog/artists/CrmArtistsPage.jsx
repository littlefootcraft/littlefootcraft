import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Plus, Search, ExternalLink, Eye } from "lucide-react";

// SUPABASE
import { supabase } from "../../../../lib/supabaseClient";

// COMPONENTS
import { CrmSelect } from "../../../../components/crm/CrmSelect";

const CrmArtistsPage = () => {
	const [artists, setArtists] = useState([]);

	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("all");

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const loadArtists = async () => {
			setLoading(true);
			setError("");

			const { data, error: artistsError } = await supabase
				.from("artists")
				.select(
					`
						id,
						name,
						slug,
						country_code,
						country_name,
						city,
						email,
						website,
						instagram,
						bio,
						is_active,
						created_at
					`,
				)
				.order("name", { ascending: true });

			if (artistsError) {
				console.error("Artists loading error:", artistsError);

				setError("Could not load artists.");
				setLoading(false);

				return;
			}

			setArtists(data ?? []);
			setLoading(false);
		};

		loadArtists();
	}, []);

	const filteredArtists = useMemo(() => {
		const normalizedSearch = search.trim().toLowerCase();

		return artists.filter((artist) => {
			const artistName = artist.name?.toLowerCase() ?? "";
			const artistEmail = artist.email?.toLowerCase() ?? "";
			const artistCountry = artist.country_name?.toLowerCase() ?? "";
			const artistCity = artist.city?.toLowerCase() ?? "";

			const matchesSearch =
				!normalizedSearch ||
				artistName.includes(normalizedSearch) ||
				artistEmail.includes(normalizedSearch) ||
				artistCountry.includes(normalizedSearch) ||
				artistCity.includes(normalizedSearch);

			const matchesStatus =
				status === "all" ||
				(status === "active" && artist.is_active) ||
				(status === "inactive" && !artist.is_active);

			return matchesSearch && matchesStatus;
		});
	}, [artists, search, status]);

	const activeArtists = artists.filter((artist) => artist.is_active).length;

	const inactiveArtists = artists.length - activeArtists;

	if (loading) {
		return (
			<section className="crm-artists">
				<p className="crm-artists__state">Loading artists...</p>
			</section>
		);
	}

	if (error) {
		return (
			<section className="crm-artists">
				<p className="crm-artists__state crm-artists__state--error">{error}</p>
			</section>
		);
	}

	return (
		<section className="crm-artists">
			<div className="crm-artists__header">
				<div>
					<h1 className="crm-artists__title">Artists</h1>

					<p className="crm-artists__subtitle">
						Manage artists whose work is sold through LittleFootCraft.
					</p>
				</div>

				<Link
					to="/crm/artists/new"
					className="crm-artists__add-button"
				>
					<Plus size={19} />
					<span>Add artist</span>
				</Link>
			</div>

			<div className="crm-artists__summary">
				<div className="crm-artists__summary-item">
					<span className="crm-artists__summary-value">{artists.length}</span>

					<span className="crm-artists__summary-label">Artists</span>
				</div>

				<div className="crm-artists__summary-item">
					<span className="crm-artists__summary-value">{activeArtists}</span>

					<span className="crm-artists__summary-label">Active</span>
				</div>

				<div className="crm-artists__summary-item">
					<span className="crm-artists__summary-value">{inactiveArtists}</span>

					<span className="crm-artists__summary-label">Inactive</span>
				</div>

				<div className="crm-artists__summary-item">
					<span className="crm-artists__summary-value">
						{filteredArtists.length}
					</span>

					<span className="crm-artists__summary-label">Showing</span>
				</div>
			</div>

			<div className="crm-artists__toolbar">
				<div className="crm-artists__search">
					<Search
						size={18}
						className="crm-artists__search-icon"
					/>

					<input
						type="search"
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder="Search artist, email or location"
						className="crm-artists__search-input"
					/>
				</div>

				<div className="crm-artists__filter">
					<CrmSelect
						value={status}
						onChange={setStatus}
						ariaLabel="Filter artists by status"
						options={[
							{
								value: "all",
								label: "All statuses",
							},
							{
								value: "active",
								label: "Active",
							},
							{
								value: "inactive",
								label: "Inactive",
							},
						]}
					/>
				</div>
			</div>

			<div className="crm-artists__table-wrap">
				<table className="crm-artists__table">
					<thead>
						<tr>
							<th>Artist</th>
							<th>Location</th>
							{/* <th>Email</th>
							<th>Website</th>
							<th>Instagram</th> */}
							<th>Status</th>
							<th>Added</th>
							<th>Actions</th>
						</tr>
					</thead>

					<tbody>
						{filteredArtists.map((artist) => {
							const location = [artist.city, artist.country_name]
								.filter(Boolean)
								.join(", ");

							return (
								<tr key={artist.id}>
									<td>
										<div className="crm-artists__artist">
											<Link
												to={`/crm/artists/${artist.id}`}
												className="crm-artists__artist-name"
											>
												{artist.name}
											</Link>

											<span className="crm-artists__slug">{artist.slug}</span>
										</div>
									</td>

									<td>{location || "—"}</td>

									{/* <td>
										{artist.email ? (
											<a
												href={`mailto:${artist.email}`}
												className="crm-artists__link"
											>
												<Mail size={16} />
												<span>{artist.email}</span>
											</a>
										) : (
											"—"
										)}
									</td> */}

									{/* <td>
										{artist.website ? (
											<a
												href={artist.website}
												target="_blank"
												rel="noreferrer"
												className="crm-artists__link"
											>
												<span>Website</span>
												<ExternalLink size={15} />
											</a>
										) : (
											"—"
										)}
									</td> */}

									{/* <td>
										{artist.instagram ? (
											<a
												href={artist.instagram}
												target="_blank"
												rel="noreferrer"
												className="crm-artists__link"
											>
												<span>Instagram</span>
												<ExternalLink size={15} />
											</a>
										) : (
											"—"
										)}
									</td> */}

									<td>
										<span
											className={`crm-artists__status ${
												artist.is_active
													? "crm-artists__status--active"
													: "crm-artists__status--inactive"
											}`}
										>
											{artist.is_active ? "Active" : "Inactive"}
										</span>
									</td>

									<td className="crm-artists__date">
										{new Date(artist.created_at).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										})}
									</td>

									<td>
										<Link
											to={`/crm/artists/${artist.id}`}
											className="crm-artists__view"
											aria-label={`View ${artist.name}`}
										>
											<Eye size={18} />
											<span>View</span>
										</Link>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>

				{filteredArtists.length === 0 && (
					<div className="crm-artists__empty">No artists found.</div>
				)}
			</div>
		</section>
	);
};

export default CrmArtistsPage;

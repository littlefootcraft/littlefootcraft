import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Mail, Save } from "lucide-react";

import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

// SUPABASE
import { supabase } from "../../../../lib/supabaseClient";

countries.registerLocale(enLocale);

const createSlug = (value) => {
	return value
		.toLowerCase()
		.trim()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
};

const CrmArtistDetailsPage = () => {
	const { artistId } = useParams();
	const navigate = useNavigate();

	const [artist, setArtist] = useState(null);

	const [form, setForm] = useState({
		name: "",
		slug: "",
		countryCode: "",
		city: "",
		email: "",
		website: "",
		instagram: "",
		bio: "",
		isActive: true,
	});

	const [errors, setErrors] = useState({});
	const [status, setStatus] = useState("loading");
	const [message, setMessage] = useState("");

	const countryOptions = useMemo(() => {
		const countryNames = countries.getNames("en", {
			select: "official",
		});

		return Object.entries(countryNames).sort((a, b) =>
			a[1].localeCompare(b[1]),
		);
	}, []);

	useEffect(() => {
		const loadArtist = async () => {
			setStatus("loading");
			setMessage("");

			const { data, error } = await supabase
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
						created_at,
						updated_at
					`,
				)
				.eq("id", artistId)
				.single();

			if (error) {
				console.error("Artist loading error:", error);

				setStatus("error");
				setMessage("Could not load artist.");

				return;
			}

			setArtist(data);

			setForm({
				name: data.name ?? "",
				slug: data.slug ?? "",
				countryCode: data.country_code ?? "",
				city: data.city ?? "",
				email: data.email ?? "",
				website: data.website ?? "",
				instagram: data.instagram ?? "",
				bio: data.bio ?? "",
				isActive: data.is_active ?? true,
			});

			setStatus("idle");
		};

		loadArtist();
	}, [artistId]);

	const handleChange = (event) => {
		const { name, value } = event.target;

		setForm((current) => ({
			...current,
			[name]: value,
		}));

		setErrors((current) => ({
			...current,
			[name]: "",
		}));

		setMessage("");
	};

	const handleSlugChange = (event) => {
		setForm((current) => ({
			...current,
			slug: createSlug(event.target.value),
		}));

		setErrors((current) => ({
			...current,
			slug: "",
		}));

		setMessage("");
	};

	const validateForm = () => {
		const newErrors = {};

		if (form.name.trim().length < 2) {
			newErrors.name = "Artist name is required.";
		}

		if (!form.slug.trim()) {
			newErrors.slug = "Slug is required.";
		}

		if (!form.countryCode) {
			newErrors.countryCode = "Country is required.";
		}

		if (!form.city.trim()) {
			newErrors.city = "City is required.";
		}

		if (form.email.trim()) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

			if (!emailRegex.test(form.email.trim())) {
				newErrors.email = "Enter a valid email address.";
			}
		}

		if (form.website.trim()) {
			try {
				new URL(form.website.trim());
			} catch {
				newErrors.website = "Enter the full website URL, including https://";
			}
		}

		if (form.instagram.trim()) {
			try {
				new URL(form.instagram.trim());
			} catch {
				newErrors.instagram =
					"Enter the full Instagram URL, including https://";
			}
		}

		return newErrors;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		setMessage("");

		const newErrors = validateForm();

		setErrors(newErrors);

		if (Object.keys(newErrors).length > 0) {
			return;
		}

		setStatus("saving");

		const countryName = countries.getName(form.countryCode, "en") || "";

		const { data, error } = await supabase
			.from("artists")
			.update({
				name: form.name.trim(),
				slug: form.slug.trim(),

				country_code: form.countryCode,
				country_name: countryName,
				city: form.city.trim(),

				email: form.email.trim().toLowerCase() || null,
				website: form.website.trim() || null,
				instagram: form.instagram.trim() || null,

				bio: form.bio.trim() || null,

				is_active: form.isActive,
			})
			.eq("id", artistId)
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
					created_at,
					updated_at
				`,
			)
			.single();

		if (error) {
			console.error("Artist update error:", error);

			setStatus("error");

			if (
				error.code === "23505" &&
				error.message?.includes("artists_slug_key")
			) {
				setMessage(
					"Another artist already uses this slug. Please choose a different one.",
				);

				return;
			}

			setMessage("Could not save artist.");

			return;
		}

		setArtist(data);
		setStatus("success");
		setMessage("Artist updated successfully.");
	};

	if (status === "loading") {
		return (
			<section className="crm-artist-details">
				<p className="crm-artist-details__state">Loading artist...</p>
			</section>
		);
	}

	if (!artist) {
		return (
			<section className="crm-artist-details">
				<p className="crm-artist-details__state crm-artist-details__state--error">
					{message || "Artist not found."}
				</p>

				<Link
					to="/crm/artists"
					className="crm-artist-details__back"
				>
					<ArrowLeft size={18} />
					<span>Back to artists</span>
				</Link>
			</section>
		);
	}

	return (
		<section className="crm-artist-details">
			<div className="crm-artist-details__header">
				<div>
					<Link
						to="/crm/artists"
						className="crm-artist-details__back"
					>
						<ArrowLeft size={18} />
						<span>Back to artists</span>
					</Link>

					<div className="crm-artist-details__title-row">
						<h1 className="crm-artist-details__title">{artist.name}</h1>

						<span
							className={`crm-artist-details__status ${
								artist.is_active
									? "crm-artist-details__status--active"
									: "crm-artist-details__status--inactive"
							}`}
						>
							{artist.is_active ? "Active" : "Inactive"}
						</span>
					</div>

					<p className="crm-artist-details__subtitle">
						View and update artist information.
					</p>
				</div>
			</div>

			<div className="crm-artist-details__meta">
				<div className="crm-artist-details__meta-item">
					<span className="crm-artist-details__meta-label">Created</span>

					<strong>
						{new Date(artist.created_at).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
							year: "numeric",
						})}
					</strong>
				</div>

				<div className="crm-artist-details__meta-item">
					<span className="crm-artist-details__meta-label">Updated</span>

					<strong>
						{new Date(artist.updated_at).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
							year: "numeric",
						})}
					</strong>
				</div>

				<div className="crm-artist-details__meta-item">
					<span className="crm-artist-details__meta-label">Location</span>

					<strong>
						{[artist.city, artist.country_name].filter(Boolean).join(", ")}
					</strong>
				</div>
			</div>

			<form
				className="crm-artist-details__form"
				onSubmit={handleSubmit}
			>
				<div className="crm-artist-details__card">
					<div className="crm-artist-details__section-heading">
						<h2 className="crm-artist-details__section-title">
							Artist information
						</h2>
					</div>

					<div className="crm-artist-details__grid">
						<div className="crm-artist-details__field">
							<label htmlFor="artist-name">Artist name</label>

							<input
								id="artist-name"
								name="name"
								type="text"
								value={form.name}
								onChange={handleChange}
								disabled={status === "saving"}
								required
							/>

							{errors.name && (
								<p className="crm-artist-details__error">{errors.name}</p>
							)}
						</div>

						<div className="crm-artist-details__field">
							<label htmlFor="artist-slug">Slug</label>

							<input
								id="artist-slug"
								name="slug"
								type="text"
								value={form.slug}
								onChange={handleSlugChange}
								disabled={status === "saving"}
								required
							/>

							{errors.slug && (
								<p className="crm-artist-details__error">{errors.slug}</p>
							)}
						</div>
					</div>
				</div>

				<div className="crm-artist-details__card">
					<div className="crm-artist-details__section-heading">
						<h2 className="crm-artist-details__section-title">Location</h2>

						<p className="crm-artist-details__section-text">
							This is where the artist is based, not necessarily where inventory
							is stored.
						</p>
					</div>

					<div className="crm-artist-details__grid">
						<div className="crm-artist-details__field">
							<label htmlFor="artist-country">Country</label>

							<select
								id="artist-country"
								name="countryCode"
								value={form.countryCode}
								onChange={handleChange}
								disabled={status === "saving"}
								required
							>
								<option value="">Select a country</option>

								{countryOptions.map(([code, name]) => (
									<option
										key={code}
										value={code}
									>
										{name}
									</option>
								))}
							</select>

							{errors.countryCode && (
								<p className="crm-artist-details__error">
									{errors.countryCode}
								</p>
							)}
						</div>

						<div className="crm-artist-details__field">
							<label htmlFor="artist-city">City</label>

							<input
								id="artist-city"
								name="city"
								type="text"
								value={form.city}
								onChange={handleChange}
								disabled={status === "saving"}
								required
							/>

							{errors.city && (
								<p className="crm-artist-details__error">{errors.city}</p>
							)}
						</div>
					</div>
				</div>

				<div className="crm-artist-details__card">
					<div className="crm-artist-details__section-heading">
						<h2 className="crm-artist-details__section-title">
							Contact and links
						</h2>
					</div>

					<div className="crm-artist-details__grid">
						<div className="crm-artist-details__field">
							<label htmlFor="artist-email">Email</label>

							<input
								id="artist-email"
								name="email"
								type="email"
								value={form.email}
								onChange={handleChange}
								disabled={status === "saving"}
							/>

							{errors.email && (
								<p className="crm-artist-details__error">{errors.email}</p>
							)}
						</div>

						<div className="crm-artist-details__field">
							<label htmlFor="artist-website">Website</label>

							<input
								id="artist-website"
								name="website"
								type="url"
								value={form.website}
								onChange={handleChange}
								disabled={status === "saving"}
							/>

							{errors.website && (
								<p className="crm-artist-details__error">{errors.website}</p>
							)}
						</div>

						<div className="crm-artist-details__field crm-artist-details__field--full">
							<label htmlFor="artist-instagram">Instagram</label>

							<input
								id="artist-instagram"
								name="instagram"
								type="url"
								value={form.instagram}
								onChange={handleChange}
								disabled={status === "saving"}
							/>

							{errors.instagram && (
								<p className="crm-artist-details__error">{errors.instagram}</p>
							)}
						</div>
					</div>

					{(artist.email || artist.website || artist.instagram) && (
						<div className="crm-artist-details__links">
							{artist.email && (
								<a
									href={`mailto:${artist.email}`}
									className="crm-artist-details__external-link"
								>
									<Mail size={17} />
									<span>Email artist</span>
								</a>
							)}

							{artist.website && (
								<a
									href={artist.website}
									target="_blank"
									rel="noreferrer"
									className="crm-artist-details__external-link"
								>
									<span>Website</span>
									<ExternalLink size={16} />
								</a>
							)}

							{artist.instagram && (
								<a
									href={artist.instagram}
									target="_blank"
									rel="noreferrer"
									className="crm-artist-details__external-link"
								>
									<span>Instagram</span>
									<ExternalLink size={16} />
								</a>
							)}
						</div>
					)}
				</div>

				<div className="crm-artist-details__card">
					<div className="crm-artist-details__section-heading">
						<h2 className="crm-artist-details__section-title">Biography</h2>
					</div>

					<div className="crm-artist-details__field">
						<label htmlFor="artist-bio">Bio</label>

						<textarea
							id="artist-bio"
							name="bio"
							value={form.bio}
							onChange={handleChange}
							rows={6}
							disabled={status === "saving"}
						/>
					</div>
				</div>

				<div className="crm-artist-details__card">
					<div className="crm-artist-details__status-row">
						<div>
							<h2 className="crm-artist-details__section-title">
								Artist status
							</h2>

							<p className="crm-artist-details__section-text">
								Inactive artists remain in the CRM and are not deleted.
							</p>
						</div>

						<label className="crm-artist-details__checkbox">
							<input
								type="checkbox"
								checked={form.isActive}
								onChange={(event) =>
									setForm((current) => ({
										...current,
										isActive: event.target.checked,
									}))
								}
								disabled={status === "saving"}
							/>

							<span>Active artist</span>
						</label>
					</div>
				</div>

				{message && (
					<p
						className={`crm-artist-details__feedback ${
							status === "success"
								? "crm-artist-details__feedback--success"
								: "crm-artist-details__feedback--error"
						}`}
					>
						{message}
					</p>
				)}

				<div className="crm-artist-details__actions">
					<button
						type="button"
						className="crm-artist-details__cancel"
						onClick={() => navigate("/crm/artists")}
					>
						Cancel
					</button>

					<button
						type="submit"
						className="crm-artist-details__save"
						disabled={status === "saving"}
					>
						<Save size={18} />

						<span>{status === "saving" ? "Saving..." : "Save changes"}</span>
					</button>
				</div>
			</form>
		</section>
	);
};

export default CrmArtistDetailsPage;

import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

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

const CrmArtistFormPage = () => {
	const navigate = useNavigate();

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

	const [slugEdited, setSlugEdited] = useState(false);

	const [errors, setErrors] = useState({});
	const [status, setStatus] = useState("idle");
	const [message, setMessage] = useState("");

	const countryOptions = useMemo(() => {
		const countryNames = countries.getNames("en", {
			select: "official",
		});

		return Object.entries(countryNames).sort((a, b) =>
			a[1].localeCompare(b[1]),
		);
	}, []);

	const handleChange = (event) => {
		const { name, value } = event.target;

		setForm((current) => {
			const updatedForm = {
				...current,
				[name]: value,
			};

			if (name === "name" && !slugEdited) {
				updatedForm.slug = createSlug(value);
			}

			return updatedForm;
		});

		setErrors((current) => ({
			...current,
			[name]: "",
		}));

		setMessage("");
	};

	const handleSlugChange = (event) => {
		const value = event.target.value;

		setSlugEdited(true);

		setForm((current) => ({
			...current,
			slug: createSlug(value),
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

		setStatus("loading");

		const countryName = countries.getName(form.countryCode, "en") || "";

		const { data, error } = await supabase
			.from("artists")
			.insert({
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
			.select("id")
			.single();

		if (error) {
			console.error("Artist creation error:", error);

			setStatus("error");

			if (
				error.code === "23505" &&
				error.message?.includes("artists_slug_key")
			) {
				setMessage(`Artist with slug "${form.slug.trim()}" already exists.`);

				return;
			}

			setMessage("Could not create artist.");

			return;
		}

		setStatus("success");

		navigate(`/crm/artists/${data.id}`);
	};

	return (
		<section className="crm-artist-form">
			<div className="crm-artist-form__header">
				<div>
					<Link
						to="/crm/artists"
						className="crm-artist-form__back"
					>
						<ArrowLeft size={18} />
						<span>Back to artists</span>
					</Link>

					<h1 className="crm-artist-form__title">Add artist</h1>

					<p className="crm-artist-form__subtitle">
						Add an artist whose work can be sold through LittleFootCraft.
					</p>
				</div>
			</div>

			<form
				className="crm-artist-form__form"
				onSubmit={handleSubmit}
			>
				<div className="crm-artist-form__card">
					<div className="crm-artist-form__section-heading">
						<h2 className="crm-artist-form__section-title">
							Artist information
						</h2>

						<p className="crm-artist-form__section-text">
							Basic information used to identify the artist.
						</p>
					</div>

					<div className="crm-artist-form__grid">
						<div className="crm-artist-form__field">
							<label htmlFor="artist-name">Artist name</label>

							<input
								id="artist-name"
								name="name"
								type="text"
								value={form.name}
								onChange={handleChange}
								placeholder="Artist name"
								disabled={status === "loading"}
								required
							/>

							{errors.name && (
								<p className="crm-artist-form__error">{errors.name}</p>
							)}
						</div>

						<div className="crm-artist-form__field">
							<label htmlFor="artist-slug">Slug</label>

							<input
								id="artist-slug"
								name="slug"
								type="text"
								value={form.slug}
								onChange={handleSlugChange}
								placeholder="artist-name"
								disabled={status === "loading"}
								required
							/>

							<p className="crm-artist-form__hint">
								Used as the permanent identifier for this artist.
							</p>

							{errors.slug && (
								<p className="crm-artist-form__error">{errors.slug}</p>
							)}
						</div>
					</div>
				</div>

				<div className="crm-artist-form__card">
					<div className="crm-artist-form__section-heading">
						<h2 className="crm-artist-form__section-title">Location</h2>

						<p className="crm-artist-form__section-text">
							Where the artist is based. This does not determine where inventory
							is stored.
						</p>
					</div>

					<div className="crm-artist-form__grid">
						<div className="crm-artist-form__field">
							<label htmlFor="artist-country">Country</label>

							<select
								id="artist-country"
								name="countryCode"
								value={form.countryCode}
								onChange={handleChange}
								disabled={status === "loading"}
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
								<p className="crm-artist-form__error">{errors.countryCode}</p>
							)}
						</div>

						<div className="crm-artist-form__field">
							<label htmlFor="artist-city">City</label>

							<input
								id="artist-city"
								name="city"
								type="text"
								value={form.city}
								onChange={handleChange}
								placeholder="Galway"
								disabled={status === "loading"}
							/>

							{errors.city && (
								<p className="crm-artist-form__error">{errors.city}</p>
							)}
						</div>
					</div>
				</div>

				<div className="crm-artist-form__card">
					<div className="crm-artist-form__section-heading">
						<h2 className="crm-artist-form__section-title">
							Contact and links
						</h2>

						<p className="crm-artist-form__section-text">
							Optional contact information and public links.
						</p>
					</div>

					<div className="crm-artist-form__grid">
						<div className="crm-artist-form__field">
							<label htmlFor="artist-email">Email</label>

							<input
								id="artist-email"
								name="email"
								type="email"
								value={form.email}
								onChange={handleChange}
								placeholder="artist@example.com"
								disabled={status === "loading"}
							/>

							{errors.email && (
								<p className="crm-artist-form__error">{errors.email}</p>
							)}
						</div>

						<div className="crm-artist-form__field">
							<label htmlFor="artist-website">Website</label>

							<input
								id="artist-website"
								name="website"
								type="url"
								value={form.website}
								onChange={handleChange}
								placeholder="https://example.com"
								disabled={status === "loading"}
							/>

							{errors.website && (
								<p className="crm-artist-form__error">{errors.website}</p>
							)}
						</div>

						<div className="crm-artist-form__field crm-artist-form__field--full">
							<label htmlFor="artist-instagram">Instagram</label>

							<input
								id="artist-instagram"
								name="instagram"
								type="url"
								value={form.instagram}
								onChange={handleChange}
								placeholder="https://instagram.com/artist"
								disabled={status === "loading"}
							/>

							{errors.instagram && (
								<p className="crm-artist-form__error">{errors.instagram}</p>
							)}
						</div>
					</div>
				</div>

				<div className="crm-artist-form__card">
					<div className="crm-artist-form__section-heading">
						<h2 className="crm-artist-form__section-title">Biography</h2>

						<p className="crm-artist-form__section-text">
							Optional internal or future public description of the artist.
						</p>
					</div>

					<div className="crm-artist-form__field">
						<label htmlFor="artist-bio">Bio</label>

						<textarea
							id="artist-bio"
							name="bio"
							value={form.bio}
							onChange={handleChange}
							rows={6}
							placeholder="Write a short artist biography..."
							disabled={status === "loading"}
						/>
					</div>
				</div>

				<div className="crm-artist-form__card">
					<div className="crm-artist-form__status-row">
						<div>
							<h2 className="crm-artist-form__section-title">Artist status</h2>

							<p className="crm-artist-form__section-text">
								Inactive artists remain in the CRM but can be excluded from
								active selections later.
							</p>
						</div>

						<label className="crm-artist-form__checkbox">
							<input
								type="checkbox"
								checked={form.isActive}
								onChange={(event) =>
									setForm((current) => ({
										...current,
										isActive: event.target.checked,
									}))
								}
								disabled={status === "loading"}
							/>

							<span>Active artist</span>
						</label>
					</div>
				</div>

				{message && (
					<p className="crm-artist-form__feedback crm-artist-form__feedback--error">
						{message}
					</p>
				)}

				<div className="crm-artist-form__actions">
					<Link
						to="/crm/artists"
						className="crm-artist-form__cancel"
					>
						Cancel
					</Link>

					<button
						type="submit"
						className="crm-artist-form__save"
						disabled={status === "loading"}
					>
						<Save size={18} />

						<span>{status === "loading" ? "Saving..." : "Add artist"}</span>
					</button>
				</div>
			</form>
		</section>
	);
};

export default CrmArtistFormPage;

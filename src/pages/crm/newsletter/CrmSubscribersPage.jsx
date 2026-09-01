import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search, Trash2 } from "lucide-react";

// SUPABASE
import { supabase } from "../../../lib/supabaseClient";
import { CrmSelect } from "../../../components/crm/CrmSelect";
import { CrmDeleteModal } from "../../../components/crm/CrmDeleteModal";

const CrmSubscribersPage = () => {
	const [subscribers, setSubscribers] = useState([]);
	const [status, setStatus] = useState("loading");
	const [errorMessage, setErrorMessage] = useState("");

	const [search, setSearch] = useState("");
	const [languageFilter, setLanguageFilter] = useState("all");
	const [interestFilter, setInterestFilter] = useState("all");

	const [subscriberToDelete, setSubscriberToDelete] = useState(null);
	const [deleteStatus, setDeleteStatus] = useState("idle");

	// LOAD SUBSCRIBERS
	useEffect(() => {
		const loadSubscribers = async () => {
			try {
				setStatus("loading");
				setErrorMessage("");

				const { data, error } = await supabase
					.from("subscribers")
					.select("id, email, language, interests, created_at")
					.order("created_at", { ascending: false });

				if (error) {
					throw error;
				}

				setSubscribers(data ?? []);
				setStatus("success");
			} catch (error) {
				console.error("Failed to load subscribers:", error);

				setStatus("error");
				setErrorMessage("Subscribers could not be loaded.");
			}
		};

		loadSubscribers();
	}, []);

	// FILTER SUBSCRIBERS LOCALLY
	const filteredSubscribers = useMemo(() => {
		const normalizedSearch = search.trim().toLowerCase();

		return subscribers.filter((subscriber) => {
			const matchesSearch =
				!normalizedSearch ||
				subscriber.email.toLowerCase().includes(normalizedSearch);

			const matchesLanguage =
				languageFilter === "all" || subscriber.language === languageFilter;

			const matchesInterest =
				interestFilter === "all" ||
				subscriber.interests?.includes(interestFilter);

			return matchesSearch && matchesLanguage && matchesInterest;
		});
	}, [subscribers, search, languageFilter, interestFilter]);

	// DELETE SUBSCRIBER
	const handleConfirmDelete = async () => {
		if (!subscriberToDelete) return;

		try {
			setDeleteStatus("loading");

			const { data, error } = await supabase
				.from("subscribers")
				.delete()
				.eq("id", subscriberToDelete.id)
				.select("id");

			if (error) {
				throw error;
			}

			if (!data || data.length === 0) {
				throw new Error("Subscriber was not deleted.");
			}

			setSubscribers((current) =>
				current.filter((subscriber) => subscriber.id !== subscriberToDelete.id),
			);

			setSubscriberToDelete(null);
			setDeleteStatus("idle");
		} catch (error) {
			console.error("Failed to delete subscriber:", error);

			setDeleteStatus("error");
		}
	};
	return (
		<section className="crm-page crm-subscribers">
			<div className="crm-page__header">
				<div>
					<p className="crm-page__eyebrow">Newsletter</p>

					<h1 className="crm-page__title">Subscribers</h1>

					<p className="crm-page__description">
						View newsletter subscribers and their interests.
					</p>
				</div>
			</div>

			<div className="crm-subscribers__toolbar">
				<div className="crm-subscribers__search">
					<Search size={18} />

					<input
						type="search"
						placeholder="Search by email..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				<div className="crm-subscribers__select">
					<CrmSelect
						value={languageFilter}
						onChange={setLanguageFilter}
						ariaLabel="Filter by language"
						options={[
							{ value: "all", label: "All languages" },
							{ value: "en", label: "English" },
							{ value: "ua", label: "Ukrainian" },
						]}
					/>
				</div>

				<div className="crm-subscribers__select">
					<CrmSelect
						value={interestFilter}
						onChange={setInterestFilter}
						ariaLabel="Filter by interest"
						options={[
							{ value: "all", label: "All interests" },
							{ value: "workshops", label: "Workshops" },
							{ value: "sales", label: "Sales" },
						]}
					/>
				</div>
			</div>

			<div className="crm-subscribers__table-wrapper">
				<table className="crm-subscribers__table">
					<thead>
						<tr>
							<th>Email</th>
							<th>Language</th>
							<th>Interests</th>
							<th>Joined</th>
							<th>Delete</th>
						</tr>
					</thead>

					<tbody>
						{status === "loading" && (
							<tr>
								<td colSpan="5">
									<div className="crm-subscribers__empty">
										Loading subscribers...
									</div>
								</td>
							</tr>
						)}

						{status === "error" && (
							<tr>
								<td colSpan="5">
									<div className="crm-subscribers__error">{errorMessage}</div>
								</td>
							</tr>
						)}

						{status === "success" && filteredSubscribers.length === 0 && (
							<tr>
								<td colSpan="5">
									<div className="crm-subscribers__empty">
										No subscribers found.
									</div>
								</td>
							</tr>
						)}

						{status === "success" &&
							filteredSubscribers.map((subscriber) => (
								<tr key={subscriber.id}>
									<td>{subscriber.email}</td>

									<td>
										{subscriber.language === "ua" ? "Ukrainian" : "English"}
									</td>

									<td>
										<div className="crm-subscribers__interests-list">
											{subscriber.interests?.length > 0
												? subscriber.interests.map((interest) => (
														<span
															key={interest}
															className="crm-subscribers__interest"
														>
															{interest === "workshops"
																? "Workshops"
																: interest === "sales"
																	? "Sales"
																	: interest}
														</span>
													))
												: "—"}
										</div>
									</td>

									<td>
										{new Intl.DateTimeFormat("en-US", {
											year: "numeric",
											month: "short",
											day: "numeric",
										}).format(new Date(subscriber.created_at))}
									</td>

									<td className="crm-subscribers__delete-cell">
										<button
											type="button"
											className="crm-subscribers__delete-btn"
											onClick={() => {
												setSubscriberToDelete(subscriber);
												setDeleteStatus("idle");
											}}
											aria-label={`Delete ${subscriber.email}`}
											title="Delete subscriber"
										>
											<Trash2 size={17} />
										</button>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
			{subscriberToDelete && (
				<CrmDeleteModal
					title="Delete subscriber?"
					itemName={subscriberToDelete.email}
					message="This subscriber will be permanently removed from the subscriber list and will no longer receive newsletters."
					deleteStatus={deleteStatus}
					onClose={() => {
						setSubscriberToDelete(null);
						setDeleteStatus("idle");
					}}
					onConfirm={handleConfirmDelete}
					confirmText="Delete subscriber"
				/>
			)}
		</section>
	);
};

export default CrmSubscribersPage;

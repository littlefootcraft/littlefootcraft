import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

import { PrimaryBtn } from "../components/PrimaryBtn";
import { SecondaryBtn } from "../components/SecondaryBtn";
import UnsubscribeImage from "../assets/images/manage_subscription.png";
import { useLanguage } from "../context/LanguageContext";

const INTERESTS = ["workshops", "master-classes", "sales"];

const interestLabels = {
	en: {
		workshops: "Workshops",
		"master-classes": "Master classes",
		sales: "Sales",
	},
	ua: {
		workshops: "Воркшопи",
		"master-classes": "Майстер-класи",
		sales: "Знижки та пропозиції",
	},
};

const UnsubscribePage = () => {
	const { currentLang } = useLanguage();
	const [searchParams] = useSearchParams();
	const subscriberId = searchParams.get("id");

	const isUA = currentLang === "ua";

	const [subscriber, setSubscriber] = useState(null);
	const [selectedInterests, setSelectedInterests] = useState([]);
	const [status, setStatus] = useState("loading");
	const [message, setMessage] = useState("");

	useEffect(() => {
		const fetchSubscriber = async () => {
			if (!subscriberId) {
				setStatus("error");
				setMessage(
					isUA ? "Посилання недійсне." : "This subscription link is invalid.",
				);
				return;
			}

			const { data, error } = await supabase
				.from("subscribers")
				.select("id, email, interests")
				.eq("id", subscriberId)
				.single();

			if (error || !data) {
				setStatus("error");
				setMessage(
					isUA
						? "Підписку не знайдено або її вже було видалено."
						: "Subscription was not found or has already been removed.",
				);
				return;
			}

			setSubscriber(data);
			setSelectedInterests(data.interests || []);
			setStatus("idle");
		};

		fetchSubscriber();
	}, [subscriberId, isUA]);

	const toggleInterest = (interest) => {
		setSelectedInterests((prev) =>
			prev.includes(interest)
				? prev.filter((item) => item !== interest)
				: [...prev, interest],
		);
	};

	const handleUpdate = async () => {
		if (selectedInterests.length === 0) {
			setStatus("error");
			setMessage(
				isUA
					? "Оберіть хоча б одну тему або відпишіться повністю."
					: "Choose at least one topic or unsubscribe completely.",
			);
			return;
		}

		setStatus("loading");
		setMessage("");

		const { error } = await supabase
			.from("subscribers")
			.update({ interests: selectedInterests })

			.eq("id", subscriberId);

		if (error) {
			setStatus("error");
			setMessage(
				isUA
					? "Не вдалося оновити підписку. Спробуйте ще раз."
					: "We could not update your subscription. Please try again.",
			);
			return;
		}

		setStatus("success");
		setMessage(
			isUA
				? "Ваші налаштування підписки оновлено."
				: "Your subscription preferences have been updated.",
		);
	};

	const handleUnsubscribe = async () => {
		setStatus("loading");
		setMessage("");

		const { error } = await supabase
			.from("subscribers")
			.delete()
			.eq("id", subscriberId);

		if (error) {
			setStatus("error");
			setMessage(
				isUA
					? "Не вдалося відписатися. Спробуйте ще раз."
					: "We could not unsubscribe you. Please try again.",
			);
			return;
		}

		setSubscriber(null);
		setSelectedInterests([]);
		setStatus("success");
		setMessage(
			isUA
				? "Ви успішно відписалися від розсилки LittleFootCraft."
				: "You have successfully unsubscribed from LittleFootCraft updates.",
		);
	};

	return (
		<main className="unsubscribe-page">
			<div className="unsubscribe-page__section">
				<div className="unsubscribe-page__image">
					<img
						src={UnsubscribeImage}
						alt={isUA ? "Керування підпискою" : "Manage subscription"}
					/>
				</div>
				<section className="unsubscribe-page__card">
					<h1 className="unsubscribe-page__title">
						{isUA ? "Керування підпискою" : "Manage your subscription"}
					</h1>
					{subscriber && (
						<p className="unsubscribe-page__text">
							{isUA
								? "Оновіть теми, які вас цікавлять, або відпишіться від усіх листів."
								: "Update the topics you are interested in, or unsubscribe from all emails."}
						</p>
					)}
					{/* {subscriber && (
                    <p className="unsubscribe-page__email">{subscriber.email}</p>
                  )} */}
					{subscriber && (
						<div className="unsubscribe-page__interests">
							{INTERESTS.map((interest) => (
								<label
									key={interest}
									className="unsubscribe-page__interest"
								>
									<input
										type="checkbox"
										checked={selectedInterests.includes(interest)}
										onChange={() => toggleInterest(interest)}
									/>
									<span>
										{interestLabels[currentLang]?.[interest] ?? interest}
									</span>
								</label>
							))}
						</div>
					)}
					{subscriber && (
						<div className="unsubscribe-page__actions">
							<PrimaryBtn
								variant="change-subscription"
								type="button"
								onClick={handleUpdate}
								disabled={status === "loading"}
							>
								{isUA ? "Зберегти зміни" : "Save changes"}
							</PrimaryBtn>
							<SecondaryBtn
								variant="unsubscribe"
								type="button"
								onClick={handleUnsubscribe}
								disabled={status === "loading"}
							>
								{isUA ? "Скасувати все" : "Cancel all"}
							</SecondaryBtn>
						</div>
					)}
					{message && (
						<p
							className={`unsubscribe-page__message unsubscribe-page__message--${status}`}
						>
							{message}
						</p>
					)}
					<Link
						to={`/${currentLang}`}
						className="unsubscribe-page__link"
					>
						{isUA ? "Повернутися на сайт" : "Return to website"}
					</Link>
				</section>
			</div>
		</main>
	);
};

export default UnsubscribePage;

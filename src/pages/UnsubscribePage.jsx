import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const UnsubscribePage = () => {
	const { lang } = useParams();
	const [searchParams] = useSearchParams();
	const subscriberId = searchParams.get("id");

	const [status, setStatus] = useState("idle");
	const [message, setMessage] = useState("");

	const isUA = lang === "ua";

	const handleUnsubscribe = async () => {
		if (!subscriberId) {
			setStatus("error");
			setMessage(
				isUA
					? "Посилання для відписки недійсне."
					: "The unsubscribe link is invalid.",
			);
			return;
		}

		setStatus("loading");

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

		setStatus("success");
		setMessage(
			isUA
				? "Ви успішно відписалися від розсилки LittleFootCraft."
				: "You have successfully unsubscribed from LittleFootCraft updates.",
		);
	};

	return (
		<main className="unsubscribe-page">
			<section className="unsubscribe-page__card">
				<h1 className="unsubscribe-page__title">
					{isUA ? "Відписка від розсилки" : "Unsubscribe from updates"}
				</h1>

				<p className="unsubscribe-page__text">
					{isUA
						? "Ви більше не хочете отримувати листи від LittleFootCraft?"
						: "Do you no longer want to receive emails from LittleFootCraft?"}
				</p>

				{status !== "success" && (
					<button
						type="button"
						className="unsubscribe-page__button"
						onClick={handleUnsubscribe}
						disabled={status === "loading"}
					>
						{status === "loading"
							? isUA
								? "Відписуємо..."
								: "Unsubscribing..."
							: isUA
								? "Відписатися"
								: "Unsubscribe"}
					</button>
				)}

				{message && (
					<p
						className={`unsubscribe-page__message unsubscribe-page__message--${status}`}
					>
						{message}
					</p>
				)}

				<Link
					to={`/${lang}`}
					className="unsubscribe-page__link"
				>
					{isUA ? "Повернутися на сайт" : "Return to website"}
				</Link>
			</section>
		</main>
	);
};

export default UnsubscribePage;

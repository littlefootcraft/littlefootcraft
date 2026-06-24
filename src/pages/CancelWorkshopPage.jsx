import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

// SUPABASE
import { supabase } from "../lib/supabaseClient";

// COMPONENTS
import { PrimaryBtn } from "../components/PrimaryBtn";
import { SecondaryBtn } from "../components/SecondaryBtn";

import CancelWorkshopImage from "../assets/images/cancel_workshop.png";

// CONTEXTS
import { useLanguage } from "../context/LanguageContext";

// import WorkshopsPageContent from "../content/pages/workshops-page.json";

import {
	workshopCancellationEN,
	workshopCancellationUA,
} from "../translations/translation";

const CancelWorkshopPage = () => {
	const { currentLang } = useLanguage();
	const { token } = useParams();

	// Select translation dictionary based on current language
	const t =
		currentLang === "ua" ? workshopCancellationUA : workshopCancellationEN;

	const [status, setStatus] = useState("idle");
	const [message, setMessage] = useState("");
	const [booking, setBooking] = useState(null);

	// Format workshop date according to selected language
	const formatDate = (dateStr, lang = "en") => {
		const locale = lang === "ua" ? "uk-UA" : "en-US";

		const [year, month, day] = dateStr.split("-").map(Number);
		const date = new Date(year, month - 1, day);

		return new Intl.DateTimeFormat(locale, {
			day: "numeric",
			month: "long",
		}).format(date);
	};

	useEffect(() => {
		const fetchBooking = async () => {
			// Load booking information using cancellation token
			const { data, error } = await supabase
				.from("workshop_bookings")
				.select(
					"workshop_title, workshop_date, workshop_location, workshop_format, workshop_format, workshop_datetime, workshop_time, workshop_timezone",
				)
				.eq("cancellation_token", token)
				.single();

			// Show error if booking cannot be found
			if (error || !data) {
				setStatus("error");
				setMessage(t.notFound);
				return;
			}

			setBooking(data);
		};

		fetchBooking();
	}, [token, t.notFound]);

	const handleCancel = async () => {
		setStatus("loading");
		setMessage("");

		// Safety check in case booking data is missing
		if (!booking) {
			setStatus("error");
			setMessage(t.notFound);
			return;
		}

		// Calculate time remaining until workshop starts
		const now = new Date();
		// const workshopDate = new Date(booking.workshop_date);
		const workshopDateTime = new Date(booking.workshop_datetime);
		const hoursUntilWorkshop = (workshopDateTime - now) / (1000 * 60 * 60);

		let refundStatus = "no_refund";

		// Determine refund eligibility
		if (hoursUntilWorkshop >= 48) {
			refundStatus = "full_refund";
		} else if (hoursUntilWorkshop >= 24) {
			refundStatus = "partial_refund";
		} else {
			refundStatus = "no_refund";
		}

		// Update booking status in Supabase
		const { error } = await supabase
			.from("workshop_bookings")
			.update({
				status: "cancelled",
				cancelled_at: new Date().toISOString(),
				refund_status: refundStatus,
			})
			.eq("cancellation_token", token);

		// Show error if cancellation fails
		if (error) {
			setStatus("error");
			setMessage(t.cancelError);
			return;
		}

		// Show success message based on refund policy
		setStatus("success");
		setMessage(t.refundMessages[refundStatus]);
	};

	return (
		<main className="cancel-workshop-page">
			<div className="cancel-workshop-page__section">
				<div className="cancel-workshop-page__image">
					<img
						src={CancelWorkshopImage}
						alt={t.imageAlt}
					/>
				</div>

				<section className="cancel-workshop-page__card">
					<h1 className="cancel-workshop-page__title">
						{status === "success" ? t.cancelledTitle : t.title}
					</h1>
					{booking && (
						<div className="cancel-workshop-page__booking">
							<p>{booking.workshop_title}</p>

							<p>
								<strong>{t.dateLabel}</strong>{" "}
								{formatDate(booking.workshop_date, currentLang)}
							</p>
							<p>
								<strong>{t.timeLabel}</strong> {booking.workshop_time}
								{booking.workshop_timezone && ` (${booking.workshop_timezone})`}
							</p>

							<p>
								<strong>{t.formatLabel}</strong> {booking.workshop_format}
							</p>
						</div>
					)}
					{status !== "success" && (
						<>
							<p className="cancel-workshop-page__text">{t.confirmMessage}</p>

							<div className="cancel-workshop-page__actions">
								<SecondaryBtn
									variant="change-subscription"
									type="button"
									onClick={handleCancel}
									disabled={status === "loading"}
								>
									{t.cancelButton}
								</SecondaryBtn>

								<Link to={`/${currentLang}`}>
									<PrimaryBtn
										variant="unsubscribe"
										type="button"
									>
										{t.returnButton}
									</PrimaryBtn>
								</Link>
							</div>
						</>
					)}

					{message && (
						<p
							className={`cancel-workshop-page__message cancel-workshop-page__message--${status}`}
						>
							{message}
						</p>
					)}
				</section>
			</div>
		</main>
	);
};

export default CancelWorkshopPage;

import { useEffect, useState } from "react";

import PhoneInput, { getCountries } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import countries from "i18n-iso-countries";
import ukLocale from "i18n-iso-countries/langs/uk.json";
import enLocale from "i18n-iso-countries/langs/en.json";

import { isValidPhoneNumber } from "react-phone-number-input";

// COMPONENTS
import { PrimaryBtn } from "./PrimaryBtn";

// ICONS
import { X, Sparkles, CalendarDays, Clock3, MapPin } from "lucide-react";

// SUPABASE
import { supabase } from "../lib/supabaseClient";

import {
	workShopBookingEN,
	workShopBookingUA,
} from "../translations/translation";

import { sendWorkshopBookingEmail } from "../utils/sendWorkshopBookingEmail";

const MESSAGE_MAX_LENGTH = 500;

export const WorkshopBookingModal = ({
	isOpen,
	onClose,
	currentLang = "en",
	workshop,
}) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [selectedDate, setSelectedDate] = useState("");
	const [participants, setParticipants] = useState("1");
	const [message, setMessage] = useState("");
	const [errors, setErrors] = useState({});
	const [status, setStatus] = useState("idle");
	const [feedbackMessage, setFeedbackMessage] = useState("");

	const t = currentLang === "ua" ? workShopBookingUA : workShopBookingEN;
	const workshopLocation =
		workshop?.location?.[currentLang] ?? workshop?.location?.en ?? "";

	useEffect(() => {
		if (!isOpen) return;

		// Prevent page behind modal from scrolling
		document.body.style.overflow = "hidden";

		// Close modal when user presses Escape
		const handleEscape = (e) => {
			if (e.key === "Escape") onClose();
		};

		window.addEventListener("keydown", handleEscape);

		// Restore page scroll and remove Escape listener when modal closes
		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	// Get workshop title in the current language
	const workshopTitle =
		workshop?.title?.[currentLang] ?? workshop?.title?.en ?? "";

	// Get workshop time in the current language
	const workshopTime =
		workshop?.time?.[currentLang] ?? workshop?.time?.en ?? "";

	// Get workshop location in the current language
	const workshopExactLocation =
		workshop?.exactLocation?.[currentLang] ?? workshop?.exactLocation?.en ?? "";

	// Get available workshop dates
	const upcomingDates = workshop?.upcomingDates?.dates ?? [];

	// Update name only if it contains letters, spaces, apostrophes, or hyphens
	const handleNameChange = (e) => {
		const value = e.target.value;

		if (/^[\p{L}\s'ʼ-]*$/u.test(value)) {
			setName(value);
			setErrors((currentErrors) => ({
				...currentErrors,
				name: "",
			}));
		}
	};

	const workshopTimezone =
		workshop?.timezone?.label?.[currentLang] ??
		workshop?.timezone?.label?.en ??
		"";

	// Update email and clear previous email error
	const handleEmailChange = (e) => {
		setEmail(e.target.value);

		setErrors((currentErrors) => ({
			...currentErrors,
			email: "",
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const trimmedName = name.trim();
		const trimmedEmail = email.trim().toLowerCase();
		const trimmedPhone = phone.trim();
		const trimmedParticipants = Number(participants);

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		const nextErrors = {};

		if (!trimmedName) {
			nextErrors.name = t.emptyNameMessage;
		}

		if (!trimmedEmail) {
			nextErrors.email = t.emptyEmailMessage;
		} else if (trimmedEmail.length > 100) {
			nextErrors.email = t.invalidEmailMessage;
		} else if (!emailRegex.test(trimmedEmail)) {
			nextErrors.email = t.invalidEmailMessage;
		}

		if (!trimmedPhone) {
			nextErrors.phone = t.emptyPhoneMessage;
		} else if (!isValidPhoneNumber(trimmedPhone)) {
			// console.log("invalidPhoneMessage:", t.invalidPhoneMessage);
			nextErrors.phone = t.invalidPhoneMessage;
		}

		if (!selectedDate) {
			nextErrors.selectedDate = t.emptyDateMessage;
		}

		if (Object.keys(nextErrors).length > 0) {
			setErrors(nextErrors);
			return;
		}

		// If validation passed, clear previous validation errors
		setErrors({});

		// Show loading state while saving booking
		setStatus("loading");
		setFeedbackMessage(t.sendingMessage);

		// Check if this email already booked this workshop
		const { data: existingBooking, error: duplicateError } = await supabase
			.from("workshop_bookings")
			.select("id")
			.eq("email", trimmedEmail)
			.eq("workshop_id", workshop.id)
			.eq("workshop_date", selectedDate)
			.neq("status", "cancelled")
			.maybeSingle();

		// console.log("Duplicate error:", duplicateError);
		// console.log("Existing booking:", existingBooking);

		if (duplicateError) {
			setStatus("error");
			setFeedbackMessage(t.errorMessage);
			return;
		}

		if (existingBooking) {
			setStatus("error");
			setFeedbackMessage(t.alreadyBookedMessage);
			return;
		}

		// console.log("Existing booking:", existingBooking);

		const cancellationToken = crypto.randomUUID();

		// Save workshop booking to Supabase
		const { error } = await supabase.from("workshop_bookings").insert({
			workshop_id: workshop?.id,
			workshop_title: workshopTitle,
			workshop_date: selectedDate,
			workshop_datetime: `${selectedDate}T16:00:00+01:00`,

			workshop_time: workshopTime,
			workshop_timezone: workshopTimezone,
			workshop_format: workshopLocation,
			workshop_location: workshopExactLocation,

			customer_name: trimmedName,
			email: trimmedEmail,
			phone: trimmedPhone,
			participants_count: trimmedParticipants,
			message: message.trim(),
			language: currentLang,
			status: "new",
			cancellation_token: cancellationToken,
		});

		// console.log("Supabase error:", error);

		// If booking could not be saved, show error message
		if (error) {
			// console.log("Supabase workshop booking error:", error);
			if (error.code === "23505") {
				setStatus("error");
				setFeedbackMessage(t.alreadyBookedMessage);
				return;
			}

			setStatus("error");
			setFeedbackMessage(t.errorMessage);
			return;
		}

		const cancelUrl = `https://littlefootcraft.art/${currentLang}/workshop-cancel/${cancellationToken}`;

		console.log("Cancellation token:", cancellationToken);
		// console.log("Insert successful");

		console.log("Sending workshop confirmation email...");

		// Send confirmation email to customer
		const { error: emailError } = await sendWorkshopBookingEmail({
			to: trimmedEmail,
			workshopTitle,
			selectedDate,
			workshopTime,
			workshopTimezone,
			workshopLocation,
			workshopPrice: workshop.price,
			participantsCount: trimmedParticipants,
			currentLang,
			cancelUrl,
		});

		// Log email errors, but do not block the booking
		// because the booking is already saved in Supabase
		if (emailError) {
			console.log("Workshop confirmation email error:", emailError);
		}

		// Show successful booking request message
		setStatus("success");
		setFeedbackMessage(t.successMessage);

		// Clear form fields after successful submission
		setName("");
		setEmail("");
		setPhone("");
		setSelectedDate("");
		setParticipants("1");
		setMessage("");
	};

	return (
		<div
			className="workshop-booking-modal"
			onClick={onClose}
		>
			<div
				className="workshop-booking-modal__content"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					type="button"
					className="workshop-booking-modal__close"
					onClick={onClose}
					aria-label="Close booking form"
				>
					<X />
				</button>

				<div className="workshop-booking-modal__icon">
					<Sparkles />
				</div>

				<h2 className="workshop-booking-modal__title">{t.title}</h2>

				{workshopTitle && (
					<p className="workshop-booking-modal__workshop-name">
						{workshopTitle}
					</p>
				)}
				{(workshopTime || workshopExactLocation) && (
					<div className="workshop-booking-modal__details">
						{workshopTime && (
							<p className="workshop-booking-modal__detail">
								<Clock3 />
								<span>
									{workshopTime}
									{workshopTimezone && ` (${workshopTimezone})`}
								</span>
							</p>
						)}
						{workshopLocation && (
							<p className="workshop-booking-modal__detail">
								<MapPin />
								<span>{workshopLocation}</span>
							</p>
						)}
						{workshopExactLocation && (
							<p className="workshop-booking-modal__detail">
								{/* <MapPin /> */}
								<span>
									<MapPin />
									{workshopExactLocation}
								</span>
							</p>
						)}
					</div>
				)}

				{/* {status !== "success" && (
					<p className="workshop-booking-modal__text">{t.text}</p>
				)} */}

				{status !== "success" && (
					<form
						className="workshop-booking-modal__form"
						onSubmit={handleSubmit}
						noValidate
					>
						<div className="workshop-booking-modal__field">
							<label className="workshop-booking-modal__label">{t.name}</label>

							<input
								className="workshop-booking-modal__input"
								type="text"
								name="name"
								placeholder={t.name}
								value={name}
								maxLength={50}
								onChange={handleNameChange}
								disabled={status === "loading"}
							/>

							<p className="workshop-booking-modal__field-message">
								{errors.name}
							</p>
						</div>

						<div className="workshop-booking-modal__field">
							<label className="workshop-booking-modal__label">{t.email}</label>

							<input
								className="workshop-booking-modal__input"
								type="email"
								name="email"
								placeholder={t.email}
								value={email}
								maxLength={50}
								onChange={handleEmailChange}
								disabled={status === "loading"}
							/>

							<p className="workshop-booking-modal__field-message">
								{errors.email}
							</p>
						</div>

						<div className="workshop-booking-modal__field">
							<label className="workshop-booking-modal__label">{t.phone}</label>

							<PhoneInput
								// className="workshop-booking-modal__input"
								type="tel"
								international
								defaultCountry="IE"
								name="phone"
								placeholder={t.phone}
								countryCallingCodeEditable={false}
								value={phone}
								limitMaxLength
								onChange={(value) => {
									const phoneValue = value || "";

									setPhone(phoneValue);

									setErrors((currentErrors) => ({
										...currentErrors,
										phone: "",
									}));
								}}
								disabled={status === "loading"}
							/>

							<p className="workshop-booking-modal__field-message">
								{errors.phone}
							</p>
						</div>

						<div className="workshop-booking-modal__row">
							<div className="workshop-booking-modal__field">
								<label className="workshop-booking-modal__label">
									<CalendarDays />
									{t.date}
								</label>

								<select
									className="workshop-booking-modal__select"
									name="selectedDate"
									value={selectedDate}
									onChange={(e) => {
										setSelectedDate(e.target.value);
										setErrors((currentErrors) => ({
											...currentErrors,
											selectedDate: "",
										}));
									}}
									disabled={status === "loading"}
								>
									<option value="">{t.date}</option>

									{upcomingDates.map((date) => (
										<option
											key={date}
											value={date}
										>
											{date}
										</option>
									))}
								</select>
								<p className="workshop-booking-modal__field-message">
									{errors.selectedDate}
								</p>
							</div>

							<div className="workshop-booking-modal__field">
								<label className="workshop-booking-modal__label">
									{t.participants}
								</label>

								<input
									className="workshop-booking-modal__input"
									type="number"
									name="participants"
									min="1"
									max="20"
									value={participants}
									onChange={(e) => setParticipants(e.target.value)}
									disabled={status === "loading"}
								/>
							</div>
						</div>

						<div className="workshop-booking-modal__field">
							<label className="workshop-booking-modal__label">
								{t.message}
							</label>

							<textarea
								className="workshop-booking-modal__textarea"
								name="message"
								placeholder={t.message}
								rows="4"
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								maxLength={MESSAGE_MAX_LENGTH}
								disabled={status === "loading"}
							/>
							<p className="workshop-booking-modal__counter">
								{message.length}/{MESSAGE_MAX_LENGTH}
							</p>
						</div>

						{workshop.price != 0 && (
							<div className="workshop-booking-modal__policy">
								<h3 className="workshop-booking-modal__policy-title">
									{t.cancellationPolicyTitle}
								</h3>

								<ul className="workshop-booking-modal__policy-list">
									{t.cancellationPolicy.map((item) => (
										<li
											key={item}
											className="workshop-booking-modal__policy-item"
										>
											✧ {item}
										</li>
									))}
								</ul>
							</div>
						)}

						<p className="workshop-booking-modal__note">{t.note}</p>
						<p
							className={`workshop-booking-modal__message workshop-booking-modal__message--${status}`}
						>
							{feedbackMessage}
						</p>
						<PrimaryBtn
							variant="subscription"
							type="submit"
							className="workshop-booking-modal__submit"
							disabled={status === "loading"}
						>
							{t.button}
						</PrimaryBtn>
					</form>
				)}

				{status === "success" && (
					<div className="workshop-booking-modal__success">
						<p className="workshop-booking-modal__success-message">
							{feedbackMessage}
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

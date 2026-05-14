import { useEffect, useState } from "react";
import { X, Sparkles, CalendarDays } from "lucide-react";
import { PrimaryBtn } from "./PrimaryBtn";

import {
	workShopBookingEN,
	workShopBookingUA,
} from "../translations/translation";

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

	const t = currentLang === "ua" ? workShopBookingUA : workShopBookingEN;

	useEffect(() => {
		if (!isOpen) return;

		document.body.style.overflow = "hidden";

		const handleEscape = (e) => {
			if (e.key === "Escape") onClose();
		};

		window.addEventListener("keydown", handleEscape);

		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const workshopTitle =
		workshop?.title?.[currentLang] ?? workshop?.title?.en ?? "";

	const upcomingDates = workshop?.upcomingDates?.dates ?? [];

	// To show message if NaN enrtered
	const handlePhoneChange = (e) => {
		const value = e.target.value;

		if (/^\d*$/.test(value)) {
			setPhone(value);
			setErrors((currentErrors) => ({
				...currentErrors,
				phone: "",
			}));
		}
	};

	// For name do not accept numbers
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

	const handleEmailChange = (e) => {
		setEmail(e.target.value);

		setErrors((currentErrors) => ({
			...currentErrors,
			email: "",
		}));
	};

	const handleSubmit = (e) => {
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
		} else if (!emailRegex.test(trimmedEmail)) {
			nextErrors.email = t.invalidEmailMessage;
		}

		if (!trimmedPhone) {
			nextErrors.phone = t.emptyPhoneMessage;
		}

		if (!selectedDate) {
			nextErrors.selectedDate = t.emptyDateMessage;
		}

		if (Object.keys(nextErrors).length > 0) {
			setErrors(nextErrors);
			return;
		}

		setErrors({});

		console.log({
			workshopId: workshop?.id,
			workshopTitle,
			name: trimmedName,
			email: trimmedEmail,
			phone: trimmedPhone,
			selectedDate,
			participants: trimmedParticipants,
			message,
			language: currentLang,
		});

		// Later we will send this to Supabase
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

				<p className="workshop-booking-modal__text">{t.text}</p>

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
							onChange={handleNameChange}
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
							onChange={handleEmailChange}
						/>

						<p className="workshop-booking-modal__field-message">
							{errors.email}
						</p>
					</div>

					<div className="workshop-booking-modal__field">
						<label className="workshop-booking-modal__label">{t.phone}</label>

						<input
							className="workshop-booking-modal__input"
							type="tel"
							name="phone"
							placeholder={t.phone}
							value={phone}
							onChange={handlePhoneChange}
							inputMode="numeric"
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
								onChange={(e) => setSelectedDate(e.target.value)}
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
							/>
						</div>
					</div>

					<div className="workshop-booking-modal__field">
						<label className="workshop-booking-modal__label">{t.message}</label>

						<textarea
							className="workshop-booking-modal__textarea"
							name="message"
							placeholder={t.message}
							rows="4"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
						/>
					</div>

					<p className="workshop-booking-modal__note">{t.note}</p>

					<PrimaryBtn
						variant="subscription"
						type="submit"
						className="workshop-booking-modal__submit"
					>
						{t.button}
					</PrimaryBtn>
				</form>
			</div>
		</div>
	);
};

// src/pages/crm/CrmLoginPage.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

const CrmLoginPage = () => {
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [status, setStatus] = useState("idle");
	const [errorMessage, setErrorMessage] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		setStatus("loading");
		setErrorMessage("");

		const { data, error } = await supabase.auth.signInWithPassword({
			email: email.trim(),
			password,
		});

		if (error) {
			console.error("CRM login error:", error);

			setErrorMessage("Invalid email or password.");
			setStatus("error");

			return;
		}

		console.log("CRM user:", data.user);

		setStatus("success");

		navigate("/crm");
	};

	return (
		<main className="crm-login">
			<div className="crm-login__container">
				<h1 className="crm-login__title">LittleFootCraft CRM</h1>

				<p className="crm-login__text">Sign in to manage LittleFootCraft.</p>

				<form
					className="crm-login__form"
					onSubmit={handleSubmit}
				>
					<label className="crm-login__field">
						<span>Email</span>

						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							autoComplete="email"
							required
						/>
					</label>

					<label className="crm-login__field">
						<span>Password</span>

						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							autoComplete="current-password"
							required
						/>
					</label>

					{errorMessage && <p className="crm-login__error">{errorMessage}</p>}

					<button
						type="submit"
						className="crm-login__button"
						disabled={status === "loading"}
					>
						{status === "loading" ? "Signing in..." : "Sign in"}
					</button>
				</form>
			</div>
		</main>
	);
};

export default CrmLoginPage;

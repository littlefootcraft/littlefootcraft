// src/layouts/CrmLayout.jsx

import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Mail, Users, Send, LogOut } from "lucide-react";

import { supabase } from "../lib/supabaseClient";

const CrmLayout = () => {
	const navigate = useNavigate();

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error("CRM logout error:", error);
			return;
		}

		navigate("/crm/login");
	};

	return (
		<div className="crm-layout">
			<aside className="crm-layout__sidebar">
				<div className="crm-layout__brand">
					<p className="crm-layout__brand-name">LittleFootCraft</p>
					<span className="crm-layout__brand-label">CRM</span>
				</div>

				<nav className="crm-layout__nav">
					<NavLink
						to="/crm"
						end
						className={({ isActive }) =>
							`crm-layout__nav-link ${
								isActive ? "crm-layout__nav-link--active" : ""
							}`
						}
					>
						<LayoutDashboard size={19} />
						<span>Dashboard</span>
					</NavLink>

					<NavLink
						to="/crm/newsletter"
						end
						className={({ isActive }) =>
							`crm-layout__nav-link ${
								isActive ? "crm-layout__nav-link--active" : ""
							}`
						}
					>
						<Mail size={19} />
						<span>Newsletter</span>
					</NavLink>

					<NavLink
						to="/crm/newsletter/subscribers"
						className={({ isActive }) =>
							`crm-layout__nav-link ${
								isActive ? "crm-layout__nav-link--active" : ""
							}`
						}
					>
						<Users size={19} />
						<span>Subscribers</span>
					</NavLink>

					<NavLink
						to="/crm/newsletter/campaigns"
						className={({ isActive }) =>
							`crm-layout__nav-link ${
								isActive ? "crm-layout__nav-link--active" : ""
							}`
						}
					>
						<Send size={19} />
						<span>Campaigns</span>
					</NavLink>
				</nav>

				<div className="crm-layout__sidebar-footer">
					<button
						type="button"
						className="crm-layout__logout"
						onClick={handleLogout}
					>
						<LogOut size={18} />
						<span>Log out</span>
					</button>
				</div>
			</aside>

			<div className="crm-layout__main">
				<header className="crm-layout__topbar">
					<div>
						<p className="crm-layout__topbar-label">LittleFootCraft</p>
						<p className="crm-layout__topbar-text">Owner management</p>
					</div>
				</header>

				<main className="crm-layout__content">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default CrmLayout;

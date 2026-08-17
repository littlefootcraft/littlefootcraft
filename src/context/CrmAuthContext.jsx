import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const CrmAuthContext = createContext(null);

export const CrmAuthProvider = ({ children }) => {
	const [session, setSession] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getInitialSession = async () => {
			const { data, error } = await supabase.auth.getSession();

			if (error) {
				console.error("Error getting CRM session:", error);
			}

			setSession(data.session);
			setLoading(false);
		};

		getInitialSession();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			setLoading(false);
		});

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	return (
		<CrmAuthContext.Provider
			value={{
				session,
				user: session?.user ?? null,
				loading,
			}}
		>
			{children}
		</CrmAuthContext.Provider>
	);
};

export const useCrmAuth = () => {
	return useContext(CrmAuthContext);
};

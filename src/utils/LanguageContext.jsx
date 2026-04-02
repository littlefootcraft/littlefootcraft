//LanguageContext.jsx
import { createContext, useContext, useState, useMemo, useEffect } from "react";

const LanguageContext = createContext(null);

export function LanguageProvider({ children, initialLang = "en" }) {
	const [currentLang, setCurrentLang] = useState(initialLang);

	useEffect(() => {
		setCurrentLang(initialLang);
	}, [initialLang]);

	//“when currentLang changes, create a fresh context value object”
	const value = useMemo(() => ({ currentLang, setCurrentLang }), [currentLang]);

	return (
		<LanguageContext.Provider value={value}>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLanguage() {
	const ctx = useContext(LanguageContext);
	if (!ctx)
		throw new Error("useLanguage must be used within a LanguageProvider");
	return ctx;
}

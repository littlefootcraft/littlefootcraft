import { CrmAuthProvider } from "../context/CrmAuthContext";
import { Outlet } from "react-router-dom";

const CrmRootLayout = () => {
	return (
		<CrmAuthProvider>
			<Outlet />
		</CrmAuthProvider>
	);
};

export default CrmRootLayout;

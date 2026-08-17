import { Navigate } from "react-router-dom";
import { useCrmAuth } from "../../context/CrmAuthContext";

const ProtectedCrmRoute = ({ children }) => {
	const { session, loading } = useCrmAuth();

	if (loading) {
		return <p>Loading...</p>;
	}

	if (!session) {
		return (
			<Navigate
				to="/crm/login"
				replace
			/>
		);
	}

	return children;
};

export default ProtectedCrmRoute;

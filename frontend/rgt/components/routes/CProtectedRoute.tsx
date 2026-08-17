import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/auth/CAuthContext";
import type { GCompProps } from "../shared/ccommon";
import { ROUTE_AUTH } from "../../../src/consts";

export interface CProtectedRouteProps extends GCompProps {}

function CProtectedRoute({}: CProtectedRouteProps) {
	const { user, status } = useAuth();

	if (!user || status == "logged-out") return <Navigate to={ROUTE_AUTH} replace />;
	return <Outlet />;
}

export default CProtectedRoute;

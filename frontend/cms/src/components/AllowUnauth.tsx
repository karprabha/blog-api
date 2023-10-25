import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AllowUnauth = () => {
    const { auth } = useAuth();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    return auth?.accessToken ? (
        <Navigate to={from} state={{ from: location }} replace />
    ) : (
        <Outlet />
    );
};

export default AllowUnauth;

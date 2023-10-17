import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";

interface Location {
    pathname: string;
    search: string;
    hash: string;
    state: unknown;
    key: string;
}

const useFailedAuth = () => {
    const navigate = useNavigate();
    const logout = useLogout();

    const resetSessionAndRedirectUser = async (location: Location) => {
        await logout();
        navigate("/login", { state: { from: location }, replace: true });
    };

    return resetSessionAndRedirectUser;
};

export default useFailedAuth;

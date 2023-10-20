import { useRouter } from "next/navigation";
import useLogout from "../hooks/useLogout";

const useFailedAuth = () => {
    const router = useRouter();
    const logout = useLogout();

    const resetSessionAndRedirectUser = async () => {
        await logout();
        router.push("/login");
    };

    return resetSessionAndRedirectUser;
};

export default useFailedAuth;

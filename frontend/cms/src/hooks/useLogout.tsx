import useAuth from "./useAuth";

const useLogout = () => {
    const { setAuth } = useAuth();

    const logout = async () => {
        setAuth({});
        try {
            const response = await fetch("/api/v1/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                console.log("Logout successful");
            } else {
                console.error("Logout failed");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return logout;
};

export default useLogout;

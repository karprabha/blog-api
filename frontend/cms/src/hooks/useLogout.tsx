import useAuth from "./useAuth";

const API_URI = import.meta.env.VITE_API_URI;

const useLogout = () => {
    const { setAuth } = useAuth();

    const logout = async () => {
        setAuth({ username: "", accessToken: "" });
        try {
            const response = await fetch(`${API_URI}/api/v1/auth/logout`, {
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

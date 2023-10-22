import useAuth from "./useAuth";

const API_URI = import.meta.env.VITE_API_URI;

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        try {
            const response = await fetch(`${API_URI}/api/v1/auth/refresh`, {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Token refresh failed");
            }

            const data = await response.json();
            setAuth((prev) => ({
                ...prev,
                accessToken: data.accessToken,
            }));

            return data.accessToken;
        } catch (error) {
            console.error("Token refresh error:", error);
            throw error;
        }
    };

    return refresh;
};

export default useRefreshToken;

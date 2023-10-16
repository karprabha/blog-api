import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        try {
            const response = await fetch("/api/v1/auth/refresh", {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Token refresh failed");
            }

            const data = await response.json();
            setAuth((prev) => ({
                ...prev,
                roles: ["admin"],
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

import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

type Options = RequestInit;

const useFetch = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    const sendFetchRequest = async (
        url: string,
        options: Options = {}
    ): Promise<Response> => {
        if (!options.headers) {
            options.headers = {};
        }

        (options.headers as Record<string, string>)[
            "Authorization"
        ] = `Bearer ${auth?.accessToken}`;

        try {
            const response = await fetch(url, {
                ...options,
                credentials: "include",
            });

            if (response.status === 401) {
                const newAccessToken = await refresh();

                if (newAccessToken) {
                    (options.headers as Record<string, string>)[
                        "Authorization"
                    ] = `Bearer ${newAccessToken}`;

                    const retryResponse = await fetch(url, {
                        ...options,
                        credentials: "include",
                    });

                    return retryResponse;
                }
            }

            return response;
        } catch (error) {
            console.error("Fetch request error:", error);
            throw error;
        }
    };

    return sendFetchRequest;
};

export default useFetch;

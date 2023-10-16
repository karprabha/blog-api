import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

const PersistLogin = () => {
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (err) {
                console.error(err);
            } finally {
                isMounted && setIsLoading(false);
            }
        };

        !auth?.accessToken && persist
            ? verifyRefreshToken()
            : setIsLoading(false);

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <>
            {!persist ? (
                <Outlet />
            ) : isLoading ? (
                <p className="text-xl">Loading...</p>
            ) : (
                <Outlet />
            )}
        </>
    );
};

export default PersistLogin;

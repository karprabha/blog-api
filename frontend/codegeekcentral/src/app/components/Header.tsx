"use client";

import Link from "next/link";
import useLogout from "../../hooks/useLogout";
import useAuth from "../../hooks/useAuth";

const Header = () => {
    const logout = useLogout();
    const { auth } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <header className="bg-cyan-600">
            <div className="max-w-7xl m-auto py-2 flex justify-between items-center">
                <h1 className="text-2xl text-white font-semibold">
                    <Link href={"/"}>CodeGeekCentral</Link>
                </h1>
                <nav>
                    <ul className="flex space-x-4">
                        {auth?.accessToken ? (
                            <>
                                <li>
                                    <Link
                                        href="/profile"
                                        className="text-white hover:text-yellow-400"
                                    >
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/"
                                        className="text-white hover:text-yellow-400"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        href="/login"
                                        className="text-white hover:text-yellow-400"
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/signup"
                                        className="text-white hover:text-yellow-400"
                                    >
                                        Signup
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;

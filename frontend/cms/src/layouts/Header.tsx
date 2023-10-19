import { Link, NavLink } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import useAuth from "../hooks/useAuth";

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
                    <Link to={"/"}>Blog CMS</Link>
                </h1>
                <nav>
                    <ul className="flex space-x-4">
                        {auth?.accessToken ? (
                            <>
                                <li>
                                    <NavLink
                                        to="/create-post"
                                        className="text-white hover:text-yellow-400"
                                    >
                                        Create Post
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/profile"
                                        className="text-white hover:text-yellow-400"
                                    >
                                        Profile
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/"
                                        className="text-white hover:text-yellow-400"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </NavLink>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <NavLink
                                        to="/login"
                                        className="text-white hover:text-yellow-400"
                                    >
                                        Login
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/signup"
                                        className="text-white hover:text-yellow-400"
                                    >
                                        Signup
                                    </NavLink>
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

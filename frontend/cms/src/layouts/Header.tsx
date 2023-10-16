import { Link, NavLink } from "react-router-dom";
import useLogout from "../hooks/useLogout";

const Header = () => {
    const logout = useLogout();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <header className="bg-teal-600 p-2 flex justify-between items-center">
            <h1 className="text-2xl text-white">
                <Link to={"/"}>Blog CMS</Link>
            </h1>
            <nav>
                <ul className="flex space-x-4">
                    <li>
                        <NavLink
                            to={`/`}
                            className="text-white hover:text-teal-300"
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={`/profile`}
                            className="text-white hover:text-teal-300"
                        >
                            Profile
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={`/login`}
                            className="text-white hover:text-teal-300"
                        >
                            Login
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={`/signup`}
                            className="text-white hover:text-teal-300"
                        >
                            Signup
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={`/create-post`}
                            className="text-white hover:text-teal-300"
                        >
                            Create Post
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={`/users`}
                            className="text-white hover:text-teal-300"
                        >
                            Users
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={`/`}
                            className="text-white hover:text-teal-300"
                            onClick={handleLogout}
                        >
                            Logout
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;

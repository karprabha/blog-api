import { Link, NavLink } from "react-router-dom";

const Header = () => {
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
                            to={`/logout`}
                            className="text-white hover:text-teal-300"
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

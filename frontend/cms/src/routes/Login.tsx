import { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const API_URI = import.meta.env.VITE_API_URI;

const Login = () => {
    const { setAuth, persist, setPersist } = useAuth();
    const userRef = useRef<HTMLInputElement>(null);
    const errRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    useEffect(() => {
        if (userRef.current) {
            userRef.current.focus();
        }
    }, []);

    useEffect(() => {
        setErrorMessages([]);
    }, [username, password]);

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await fetch(`${API_URI}/api/v1/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const { accessToken } = await response.json();

                setAuth({ accessToken, username });
                setUsername("");
                setPassword("");
                navigate(from, { replace: true });
            } else {
                const { errors, message } = await response.json();

                if (errors) {
                    const newErrorMessages = errors.map(
                        (error: { msg: string }) => error.msg
                    );
                    setErrorMessages(newErrorMessages);
                } else if (message) setErrorMessages([message]);
                errRef.current?.focus();
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessages([`"Login error:", ${error}`]);
            errRef.current?.focus();
        }
    };

    const handleDemoLogin = async () => {
        const demoUsername: string = import.meta.env.VITE_DEMO_USERNAME;
        const demoPassword: string = import.meta.env.VITE_DEMO_PASSWORD;

        setUsername(demoUsername);
        setPassword(demoPassword);
    };

    const togglePersist = () => {
        setPersist((prev) => !prev);
    };

    useEffect(() => {
        localStorage.setItem("persist", persist.toString());
    }, [persist]);

    return (
        <div className="flex my-20 items-center justify-center h-full bg-gray-100">
            <div className="bg-white w-full max-w-sm box-border p-8 rounded-lg shadow-lg">
                <div ref={errRef}>
                    {errorMessages.map((errorMessage, index) => (
                        <p
                            key={index}
                            className="text-red-500 bg-red-100 p-2 rounded mb-4 text-center"
                            aria-live="assertive"
                        >
                            {errorMessage}
                        </p>
                    ))}
                </div>
                <h2 className="text-2xl text-center mb-4">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block text-gray-600 text-sm font-medium mb-2"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            required
                            autoComplete="off"
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-gray-600 text-sm font-medium mb-2"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            required
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                    >
                        Login
                    </button>

                    <button
                        onClick={handleDemoLogin}
                        className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                    >
                        Privileged Demo Access
                    </button>
                    <div className="mb-4 mt-2">
                        <input
                            type="checkbox"
                            id="persist"
                            onChange={togglePersist}
                            checked={persist}
                            className="rounded text-blue-500 cursor-pointer focus:ring-2 focus:ring-blue-500"
                        />
                        <label htmlFor="persist" className="ml-2 text-gray-700">
                            Trust This Device
                        </label>
                    </div>
                </form>
                <p className="mt-4 text-center text-gray-600 text-sm">
                    Need an Account?{" "}
                    <span className="line">
                        <Link to={"/signup"} className="text-blue-500">
                            Sign Up
                        </Link>
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;

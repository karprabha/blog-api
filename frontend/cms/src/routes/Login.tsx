import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const rootUrl = "/";

    const handleLogin = async () => {
        try {
            const response = await fetch("/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const { accessToken, refreshToken } = await response.json();

                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);

                navigate(rootUrl);
            } else {
                alert("Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <div className="flex my-20 items-center justify-center h-full bg-gray-100">
            <div className="bg-white w-full max-w-sm box-border p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl text-center mb-4">Login</h2>
                <form>
                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block text-gray-600 text-sm font-medium mb-2"
                        >
                            Username
                        </label>
                        <input
                            type="username"
                            id="username"
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
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="button"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                        onClick={handleLogin}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import Home from "./routes/Home.tsx";
import Profile from "./routes/Profile.tsx";
import Login from "./routes/Login.tsx";
import ErrorPage from "./routes/ErrorPage.tsx";

const Router = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <App />,
            errorElement: <ErrorPage />,
            children: [
                { index: true, element: <Home /> },
                {
                    path: "/profile",
                    element: <Profile />,
                },
                {
                    path: "/login",
                    element: <Login />,
                },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
};

export default Router;

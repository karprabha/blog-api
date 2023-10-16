import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import Home from "./routes/Home.tsx";
import Users from "./routes/Users.tsx";
import Login from "./routes/Login.tsx";
import Signup from "./routes/Signup.tsx";
import Profile from "./routes/Profile.tsx";
import ErrorPage from "./routes/ErrorPage.tsx";
import RequireAuth from "./components/RequireAuth.tsx";
import CreateBlogPost from "./routes/CreateBlogPost.tsx";
import Unauthorized from "./routes/UnauthorizedPage.tsx";
import PersistLogin from "./components/PersistLogin.tsx";

const ROLES = {
    User: "user",
    Admin: "admin",
};

const Router = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <App />,
            errorElement: <ErrorPage />,
            children: [
                { index: true, element: <Home /> },
                {
                    path: "/login",
                    element: <Login />,
                },
                {
                    path: "/signup",
                    element: <Signup />,
                },
                {
                    path: "/unauthorized",
                    element: <Unauthorized />,
                },
                {
                    path: "/users",
                    element: <Users />,
                },
                {
                    element: <PersistLogin />,
                    children: [
                        {
                            path: "/profile",
                            element: <Profile />,
                        },
                        {
                            path: "/create-post",
                            element: (
                                <RequireAuth allowedRoles={[ROLES.Admin]} />
                            ),
                            children: [
                                { index: true, element: <CreateBlogPost /> },
                            ],
                        },
                    ],
                },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
};

export default Router;

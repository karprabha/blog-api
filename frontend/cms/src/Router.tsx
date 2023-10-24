import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import Home from "./routes/Home.tsx";
import Login from "./routes/Login.tsx";
import Signup from "./routes/Signup.tsx";
import Profile from "./routes/Profile.tsx";
import BlogPost from "./routes/BlogPost.tsx";
import ErrorPage from "./routes/ErrorPage.tsx";
import EditBlogPost from "./routes/EditBlogPost.tsx";
import AllowUnauth from "./components/AllowUnauth.tsx";
import RequireAuth from "./components/RequireAuth.tsx";
import CreateBlogPost from "./routes/CreateBlogPost.tsx";
import Unauthorized from "./routes/UnauthorizedPage.tsx";
import PersistLogin from "./components/PersistLogin.tsx";
import PublicUserProfile from "./routes/PublicUserProfile.tsx";

const Router = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <App />,
            errorElement: <ErrorPage />,
            children: [
                { index: true, element: <Home /> },
                {
                    path: "/unauthorized",
                    element: <Unauthorized />,
                },
                {
                    element: <PersistLogin />,
                    children: [
                        {
                            element: <AllowUnauth />,
                            children: [
                                {
                                    path: "/login",
                                    element: <Login />,
                                },
                                {
                                    path: "/signup",
                                    element: <Signup />,
                                },
                            ],
                        },
                        {
                            path: "/profile",
                            element: <Profile />,
                        },
                        {
                            path: "/blogs/:id",
                            element: <BlogPost />,
                        },
                        {
                            path: "/users/:id",
                            element: <PublicUserProfile />,
                        },
                        {
                            path: "/blogs/:id/edit",
                            element: <RequireAuth />,
                            children: [
                                { index: true, element: <EditBlogPost /> },
                            ],
                        },
                        {
                            path: "/create-post",
                            element: <RequireAuth />,
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

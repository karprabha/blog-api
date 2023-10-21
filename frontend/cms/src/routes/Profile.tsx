import useFetch from "../hooks/useFetch";
import { Link, useLocation } from "react-router-dom";
import useFailedAuth from "../hooks/useFailedAuth";
import { useState, useEffect, useRef } from "react";
import jwt_decode from "jwt-decode";
import useAuth from "../hooks/useAuth";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import CodeBlock from "../components/CodeBlock";

interface User {
    _id: string;
    first_name: string;
    family_name: string;
    username: string;
    role: string;
}

interface Blog {
    _id: string;
    title: string;
}

interface Comment {
    _id: string;
    blogPost: {
        _id: string;
        title: string;
    };
    text: string;
}

interface UserProfileData {
    user: User;
    blogs: Blog[];
    recentComments: Comment[];
}

interface JwtPayload {
    user_id: string;
    iat: number;
    exp: number;
}

const Profile = () => {
    const fetch = useFetch();
    const { auth } = useAuth();
    const failedAuth = useFailedAuth();

    const effectRun = useRef(false);
    const location = useLocation();
    const [user, setUser] = useState<UserProfileData | null>(null);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const decoded: JwtPayload = jwt_decode(auth.accessToken);

        const { user_id } = decoded;

        const getUser = async () => {
            try {
                const response = await fetch(`/api/v1/users/${user_id}`, {
                    method: "GET",
                    signal: controller.signal,
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    isMounted && setUser(data);
                } else if (response.status === 401) {
                    failedAuth(location);
                }
            } catch (err) {
                console.error(err);

                failedAuth(location);
            }
        };

        if (effectRun.current) {
            getUser();
        }

        return () => {
            isMounted = false;
            controller.abort();
            effectRun.current = true;
        };
    }, []);

    return (
        <>
            <div className="bg-white mt-10 shadow-md rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4">
                        {user && (
                            <div className="text-center">
                                <h2 className="text-2xl font-semibold mb-2">
                                    User Profile
                                </h2>
                                <p className="text-gray-500 text-sm mb-2">
                                    <strong>Username:</strong>{" "}
                                    {user.user.username}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    <strong>Role:</strong> {user.user.role}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="p-4">
                        {user && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Profile Information
                                </h3>
                                <p className="text-gray-500 text-sm mb-2">
                                    <strong>First Name:</strong>{" "}
                                    {user.user.first_name}
                                </p>
                                <p className="text-gray-500 text-sm mb-2">
                                    <strong>Family Name:</strong>{" "}
                                    {user.user.family_name}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    <strong>Username:</strong>{" "}
                                    {user.user.username}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mt-4">
                <h2 className="text-2xl font-semibold mb-2">Blogs</h2>
                {user && (
                    <ul>
                        {user.blogs.map((blog) => (
                            <li>
                                <Link to={`/blogs/${blog._id}`} key={blog._id}>
                                    {blog.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="bg-white mb-10 shadow-md rounded-lg p-6 mt-4">
                <h2 className="text-2xl font-semibold mb-2">Recent Comments</h2>
                {user && (
                    <ul>
                        {user.recentComments.map((comment) => (
                            <li key={comment._id}>
                                <p>
                                    <strong>Comment on:</strong>{" "}
                                    <Link to={`/blogs/${comment.blogPost._id}`}>
                                        {comment.blogPost.title}
                                    </Link>
                                </p>
                                <ReactMarkdown
                                    className="text-gray-700 mt-2"
                                    components={{ code: CodeBlock }}
                                    remarkPlugins={[remarkGfm]}
                                >
                                    {comment.text}
                                </ReactMarkdown>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
};

export default Profile;

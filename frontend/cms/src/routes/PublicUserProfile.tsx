import useFetch from "../hooks/useFetch";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import useFailedAuth from "../hooks/useFailedAuth";
import { useState, useEffect, useRef } from "react";
import jwt_decode from "jwt-decode";
import useAuth from "../hooks/useAuth";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import CodeBlock from "../components/CodeBlock";

const API_URI = import.meta.env.VITE_API_URI;

interface User {
    _id: string;
    first_name: string;
    family_name: string;
    username: string;
    role: string;
    avatar_url: string;
}

interface Blog {
    _id: string;
    title: string;
    published: boolean;
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

const PublicUserProfile = () => {
    const fetch = useFetch();
    const { auth } = useAuth();
    const failedAuth = useFailedAuth();

    const effectRun = useRef(false);

    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState<UserProfileData | null>(null);

    if (auth && auth.accessToken) {
        const decoded: JwtPayload = jwt_decode(auth.accessToken);
        const { user_id } = decoded;

        if (params.id === user_id) {
            navigate("/profile");
        }
    }

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUser = async () => {
            try {
                const response = await fetch(
                    `${API_URI}/api/v1/users/${params.id}`,
                    {
                        method: "GET",
                        signal: controller.signal,
                    }
                );

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
                    <div className="flex justify-center items-center">
                        {user && (
                            <img
                                src={user.user.avatar_url}
                                alt={`Avatar for ${user.user.first_name} ${user.user.family_name}`}
                                className="m-auto w-48 h-48 rounded-full avatar-img"
                            />
                        )}
                    </div>
                    <div className="flex justify-center items-center text-center md:justify-start md:text-left">
                        {user && (
                            <div>
                                <h3 className="text-2xl font-semibold mb-2">
                                    Profile Information
                                </h3>
                                <p className="text-gray-500 text-base mb-1">
                                    <strong>First Name:</strong>{" "}
                                    {user.user.first_name}
                                </p>
                                <p className="text-gray-500 text-base mb-1">
                                    <strong>Family Name:</strong>{" "}
                                    {user.user.family_name}
                                </p>
                                <p className="text-gray-500 text-base mb-1">
                                    <strong>Username:</strong>{" "}
                                    {user.user.username}
                                </p>
                                <p className="text-gray-500 text-base">
                                    <strong>Role:</strong> {user.user.role}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-gray-100 py-6 mt-4">
                <h2 className="text-2xl font-semibold mb-4">Blogs</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {user &&
                        user.blogs.map((blog) => (
                            <div
                                key={blog._id}
                                className="flex flex-col justify-between bg-white rounded-lg shadow-lg hover:shadow-xl"
                            >
                                <div className="p-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">
                                        {blog.title}
                                    </h2>
                                    <p className="text-gray-600 mt-2">
                                        {blog.published ? "Published" : "Draft"}
                                    </p>
                                </div>
                                <div className="bg-gray-100 p-4 border-t border-gray-200">
                                    <Link
                                        to={`/blogs/${blog._id}`}
                                        className="mt-auto text-blue-500 font-semibold hover:underline"
                                    >
                                        Read More
                                    </Link>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            <div className="bg-white mb-10 shadow-lg rounded-lg p-6 mt-4">
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                    Recent Comments
                </h2>
                {user && (
                    <ul>
                        {user.recentComments.map((comment) => (
                            <li
                                key={comment._id}
                                className="border-b border-gray-200 py-6"
                            >
                                <div className="mb-2">
                                    <p className="text-gray-600">Comment on:</p>
                                    <Link
                                        to={`/blogs/${comment.blogPost._id}`}
                                        className="text-blue-500 hover:underline text-xl font-semibold"
                                    >
                                        {comment.blogPost.title}
                                    </Link>
                                </div>
                                <ReactMarkdown
                                    className="text-gray-700"
                                    // @ts-ignore
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

export default PublicUserProfile;

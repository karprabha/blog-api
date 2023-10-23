import useFetch from "../hooks/useFetch";
import { Link, useLocation } from "react-router-dom";
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

const Profile = () => {
    const fetch = useFetch();
    const { auth } = useAuth();
    const failedAuth = useFailedAuth();

    const effectRun = useRef(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const location = useLocation();
    const [user, setUser] = useState<UserProfileData | null>(null);

    const [avatarInput, setAvatarInput] = useState("");
    const [avatarFile, setAvatarFile] = useState<File>();
    const [showAvatarUpdateModal, setShowAvatarUpdateModal] = useState(false);

    const decoded: JwtPayload = jwt_decode(auth.accessToken);
    const { user_id } = decoded;

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUser = async () => {
            try {
                const response = await fetch(
                    `${API_URI}/api/v1/users/${user_id}`,
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

    const updateAvatarWithUrl = async (avatar_url: string) => {
        try {
            const response = await fetch(`${API_URI}/api/v1/users/${user_id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ avatar_url }),
            });

            if (response.ok) {
                setUser((prevState) => {
                    if (prevState) {
                        return {
                            ...prevState,
                            user: {
                                ...prevState.user,
                                avatar_url: avatar_url,
                            },
                        };
                    }
                    return prevState;
                });
                return true;
            } else if (response.status === 401) {
                failedAuth(location);
            }
        } catch (err) {
            console.error(err);
            failedAuth(location);
        }
    };

    const updateAvatarWithFile = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("avatar", file);

            const response = await fetch(`${API_URI}/api/v1/upload`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const { url } = await response.json();
                updateAvatarWithUrl(url);
                return true;
            } else if (response.status === 401) {
                failedAuth(location);
            } else {
                const err = await response.json();
                console.log(err);
            }
        } catch (err) {
            console.error(err);
            failedAuth(location);
        }
    };

    const handleAvatarUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (avatarInput) {
            updateAvatarWithUrl(avatarInput);
        } else if (avatarFile) {
            updateAvatarWithFile(avatarFile);
        } else {
            console.log("no option is selected");
        }

        setShowAvatarUpdateModal(false);
    };

    const handleAvatarInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setAvatarInput(e.target.value);
        setAvatarFile(undefined);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const file: File = (target.files as FileList)[0];

        if (file) {
            setAvatarFile(file);
            setAvatarInput("");
        }
    };

    return (
        <>
            {showAvatarUpdateModal && (
                <div
                    className={`fixed top-0 left-0 w-full h-screen bg-black bg-opacity-40 z-50 flex items-center justify-center`}
                >
                    <div className="modal-box p-4 bg-white rounded shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4">
                            Update Your Avatar
                        </h2>
                        <p className="text-gray-700 mb-4">
                            Enter an image URL or upload a new image:
                        </p>

                        <form onSubmit={handleAvatarUpdate}>
                            <input
                                type="text"
                                placeholder="Image URL"
                                className="border p-2 mb-4 w-full"
                                value={avatarInput}
                                onChange={handleAvatarInputChange}
                            />

                            <p className="text-center text-gray-700 mb-4">OR</p>

                            <input
                                type="file"
                                accept="image/*"
                                className="mb-4"
                                ref={fileInputRef}
                                onChange={handleFileInputChange}
                            />

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
                                    onClick={() =>
                                        setShowAvatarUpdateModal(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white mt-10 shadow-md rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-center items-center">
                        {user && (
                            <div className="text-center relative group">
                                <img
                                    src={user.user.avatar_url}
                                    alt={`Avatar for ${user.user.first_name} ${user.user.family_name}`}
                                    className="m-auto w-48 h-48 rounded-full avatar-img"
                                />
                                <div
                                    className="hidden w-48 h-48 rounded-full absolute inset-0  items-center justify-center group-hover:flex bg-black bg-opacity-60 cursor-pointer text-white text-xl"
                                    onClick={() =>
                                        setShowAvatarUpdateModal(true)
                                    }
                                >
                                    Change Avatar
                                </div>
                            </div>
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

            <div className="bg-white shadow-md rounded-lg p-6 mt-4">
                <h2 className="text-2xl font-semibold mb-2">Blogs</h2>
                {user && (
                    <ul>
                        {user.blogs.map((blog) => (
                            <li key={blog._id}>
                                <Link to={`/blogs/${blog._id}`}>
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

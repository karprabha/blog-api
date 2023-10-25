"use client";

import useFetch from "../../hooks/useFetch";
import Link from "next/link";
import useFailedAuth from "../../hooks/useFailedAuth";
import { useState, useEffect, useRef } from "react";
import jwt_decode from "jwt-decode";
import useAuth from "../../hooks/useAuth";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import CodeBlock from "../components/CodeBlock";

const API_URI = process.env.NEXT_PUBLIC_API_URI;

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

    const errRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [user, setUser] = useState<UserProfileData | null>(null);

    const [loading, setLoading] = useState(true);
    const [avatarInput, setAvatarInput] = useState("");
    const [avatarFile, setAvatarFile] = useState<File>();
    const [imageUploading, setImageUploading] = useState(false);
    const [avatarUpdating, setAvatarUpdating] = useState(false);
    const [showAvatarUpdateModal, setShowAvatarUpdateModal] = useState(false);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    useEffect(() => {
        const getUser = async () => {
            const decoded: JwtPayload = jwt_decode(auth.accessToken);
            const { user_id } = decoded;

            try {
                const response = await fetch(
                    `${API_URI}/api/v1/users/${user_id}`,
                    {
                        method: "GET",
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                    setLoading(false);
                } else if (response.status === 401) {
                    failedAuth();
                }
            } catch (err) {
                console.error(err);
                failedAuth();
            }
        };

        getUser();
    }, []);

    useEffect(() => {
        setErrorMessages([]);
    }, [avatarInput, avatarFile]);

    const updateAvatarWithUrl = async (avatar_url: string) => {
        const decoded: JwtPayload = jwt_decode(auth.accessToken);
        const { user_id } = decoded;

        try {
            const response = await fetch(`${API_URI}/api/v1/users/${user_id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ avatar_url }),
            });

            setAvatarUpdating(false);
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

                setImageUploading(false);
                setShowAvatarUpdateModal(false);
                return true;
            } else if (response.status === 401) {
                failedAuth();
            } else {
                const { errors, msg } = await response.json();

                if (errors) {
                    const newErrorMessages = errors.map(
                        (error: { msg: string }) => error.msg
                    );
                    setErrorMessages(newErrorMessages);
                } else if (msg) setErrorMessages([msg]);
                errRef.current?.focus();
            }
        } catch (err) {
            setAvatarUpdating(false);
            console.error(err);
            failedAuth();
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
                failedAuth();
            } else {
                const { errors, msg } = await response.json();

                setImageUploading(false);
                if (errors) {
                    const newErrorMessages = errors.map(
                        (error: { msg: string }) => error.msg
                    );
                    setErrorMessages(newErrorMessages);
                } else if (msg) setErrorMessages([msg]);
                errRef.current?.focus();
            }
        } catch (err) {
            setImageUploading(false);
            console.error(err);
            failedAuth();
        }
    };

    const handleAvatarUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (avatarInput) {
            setAvatarUpdating(true);
            updateAvatarWithUrl(avatarInput);
        } else if (avatarFile) {
            setImageUploading(true);
            updateAvatarWithFile(avatarFile);
        } else {
            setErrorMessages(["No option is selected"]);
            errRef.current?.focus();
        }
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

    if (loading) {
        return (
            <>
                <div className="flex justify-center items-center h-screen bg-gray-100">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </>
        );
    }

    return (
        <>
            {showAvatarUpdateModal && (
                <div
                    className={`fixed top-0 left-0 w-full h-screen bg-black bg-opacity-40 z-50 flex items-center justify-center`}
                >
                    <div className="modal-box p-4 bg-white rounded shadow-lg">
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
                        {imageUploading && (
                            <p
                                className="text-blue-500 bg-blue-100 p-2 rounded mb-4 text-center"
                                aria-live="assertive"
                            >
                                Uploading image... Please wait.
                            </p>
                        )}
                        {avatarUpdating && (
                            <p
                                className="text-blue-500 bg-blue-100 p-2 rounded mb-4 text-center"
                                aria-live="assertive"
                            >
                                Updating avatar... Please wait.
                            </p>
                        )}
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
                                    disabled={imageUploading || avatarUpdating}
                                    className={`${
                                        imageUploading || avatarUpdating
                                            ? "bg-gray-300 text-gray-500 px-4 py-2 rounded-md mr-2 cursor-not-allowed"
                                            : "bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
                                    }`}
                                    onClick={() =>
                                        setShowAvatarUpdateModal(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={imageUploading || avatarUpdating}
                                    className={`${
                                        imageUploading || avatarUpdating
                                            ? "bg-blue-300 text-white px-4 py-2 rounded-md cursor-not-allowed"
                                            : "bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    }`}
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
                                        href={`/blogs/${blog._id}`}
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
                                        href={`/blogs/${comment.blogPost._id}`}
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

export default Profile;

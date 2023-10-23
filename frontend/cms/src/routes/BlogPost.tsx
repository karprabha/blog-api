import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import useFailedAuth from "../hooks/useFailedAuth";
import ReactMarkdown from "react-markdown";
import CodeBlock from "../components/CodeBlock";
import remarkGfm from "remark-gfm";
import CommentSection from "../components/CommentSection";
import format from "date-fns/format";

const API_URI = import.meta.env.VITE_API_URI;

type BlogPostType = {
    _id: string;
    author: {
        _id: string;
        first_name: string;
        family_name: string;
        username: string;
        avatar_url: string;
    };
    title: string;
    content: string;
    published: boolean;
    cover_image_url: string;
    cover_image_credit: string;
    createdAt: string;
    updatedAt: string;
};

const BlogPost = () => {
    const fetch = useFetch();
    const params = useParams();
    const failedAuth = useFailedAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<BlogPostType | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const effectRun = useRef(false);
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getBlog = async () => {
            try {
                const response = await fetch(
                    `${API_URI}/api/v1/blogs/${params.id}`,
                    {
                        method: "GET",
                        signal: controller.signal,
                    }
                );

                if (response.ok) {
                    const { blog } = await response.json();

                    isMounted && setBlog(blog);
                    isMounted && setLoading(false);
                } else if (response.status === 401) {
                    failedAuth(location);
                }
            } catch (err) {
                console.error(err);
                setLoading(false);
                failedAuth(location);
            }
        };

        if (effectRun.current) {
            getBlog();
        }

        return () => {
            isMounted = false;
            controller.abort();
            effectRun.current = true;
        };
    }, []);

    const handlePublishToggle = async () => {
        try {
            const newPublishedStatus = !blog?.published;
            const response = await fetch(
                `${API_URI}/api/v1/blogs/${params.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ published: newPublishedStatus }),
                }
            );

            if (response.ok) {
                setBlog((prevBlog: BlogPostType | null) => ({
                    ...prevBlog!,
                    published: newPublishedStatus,
                }));
            } else {
                console.log("Error toggling published");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(
                `${API_URI}/api/v1/blogs/${params.id}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                navigate("/");
            } else {
                console.log("error deleting blog");
            }
        } catch (err) {
            console.error(err);
        }

        setShowDeleteModal(false);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (!blog) {
        return <div className="text-center">Blog post not found.</div>;
    }

    return (
        <>
            <div className="bg-white rounded-lg shadow-lg p-6 my-10">
                <div className="mb-4 flex justify-end">
                    <button
                        onClick={handlePublishToggle}
                        className={`mr-2 px-4 py-2 rounded ${
                            blog.published
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-gray-500 hover:bg-gray-600"
                        } text-white`}
                    >
                        {blog.published ? "Published" : "Unpublished"}
                    </button>

                    <Link
                        to={`/blogs/${params.id}/edit`}
                        className="mr-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                    >
                        Edit
                    </Link>

                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                        Delete
                    </button>
                </div>

                <ReactMarkdown className="mt-4 mb-2 prose prose-pre:p-0">
                    {"# " + blog.title}
                </ReactMarkdown>

                <div className="prose my-7 flex items-center mb-4">
                    <img
                        src={blog.author.avatar_url}
                        alt={`Avatar for ${blog.author.first_name} ${blog.author.family_name}`}
                        className="my-auto w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                        <p className="prose my-0 text-gray-500">
                            {blog.author.first_name} {blog.author.family_name}{" "}
                            (@
                            {blog.author.username})
                        </p>
                        <p className="prose my-0 text-gray-500">
                            {format(new Date(blog.updatedAt), "MMMM d, yyyy")}
                        </p>
                    </div>
                </div>

                <div className="mt-7 mb-4 prose text-right">
                    <img src={blog.cover_image_url} alt={blog.title} />
                    Image By @{blog.cover_image_credit}
                </div>

                <ReactMarkdown
                    className="mb-10 prose prose-pre:p-0"
                    components={{ code: CodeBlock }}
                    remarkPlugins={[remarkGfm]}
                >
                    {blog.content}
                </ReactMarkdown>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 my-10">
                <CommentSection blogId={params.id} />
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 z-10 flex items-center justify-center">
                    <div className="modal-bg" onClick={cancelDelete}></div>
                    <div className="modal-box p-4 bg-white rounded shadow-lg">
                        <p className="text-xl mb-4">
                            Are you sure you want to delete this post?
                        </p>
                        <div className="flex justify-end">
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 mr-4 bg-red-500 hover:bg-red-600 text-white rounded"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BlogPost;

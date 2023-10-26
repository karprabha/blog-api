import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import useFailedAuth from "../hooks/useFailedAuth";
import useAuth from "../hooks/useAuth";
import jwt_decode from "jwt-decode";

const API_URI = import.meta.env.VITE_API_URI;

type BlogPostType = {
    _id: string;
    author: {
        _id: string;
        first_name: string;
        family_name: string;
        username: string;
    };
    title: string;
    content: string;
    published: boolean;
    cover_image_url: string;
    cover_image_credit: string;
};

interface JwtPayload {
    user_id: string;
    iat: number;
    exp: number;
}

const EditBlogPost = () => {
    const fetch = useFetch();
    const { auth } = useAuth();
    const params = useParams();
    const failedAuth = useFailedAuth();

    const titleRef = useRef<HTMLInputElement>(null);
    const errRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [published, setPublished] = useState(false);
    const [coverImageURL, setCoverImageURL] = useState("");
    const [coverImageCredit, setCoverImageCredit] = useState("");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.focus();
        }
    }, []);

    const setBlog = (blog: BlogPostType) => {
        setTitle(blog.title);
        setContent(blog.content);
        setPublished(blog.published);
        setCoverImageURL(blog.cover_image_url);
        setCoverImageCredit(blog.cover_image_credit);

        if (auth && auth.accessToken) {
            const decoded: JwtPayload = jwt_decode(auth.accessToken);
            const { user_id } = decoded;

            if (user_id !== blog.author._id) {
                navigate(from, { replace: true });
            }
        }
    };

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

        getBlog();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    if (loading) {
        return (
            <>
                <div className="flex justify-center items-center h-screen bg-gray-100">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </>
        );
    }

    const editBlogPost = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await fetch(
                `${API_URI}/api/v1/blogs/${params.id}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title,
                        content,
                        published,
                        cover_image_url: coverImageURL,
                        cover_image_credit: coverImageCredit,
                    }),
                }
            );

            if (response.ok) {
                navigate(`/blogs/${params.id}`);
            } else if (response.status === 401) {
                failedAuth(location);
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
            setErrorMessages([`"Update error:", ${error}`]);
            errRef.current?.focus();
        }
    };

    return (
        <div className="flex my-20 items-center justify-center h-full bg-gray-100 mx-4">
            <div className="bg-white w-full max-w-screen-md p-8 rounded-lg shadow-lg">
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
                <h2 className="text-2xl text-center mb-4">Edit Blog Post</h2>
                <form onSubmit={editBlogPost}>
                    <div className="mb-4">
                        <label
                            htmlFor="title"
                            className="block text-gray-600 text-sm font-medium mb-2"
                        >
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            ref={titleRef}
                            required
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="coverImageURL"
                            className="block text-gray-600 text-sm font-medium mb-2"
                        >
                            Cover Image URL
                        </label>
                        <input
                            type="text"
                            id="coverImageURL"
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none"
                            placeholder="Cover Image URL"
                            value={coverImageURL}
                            onChange={(e) => setCoverImageURL(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="coverImageCredit"
                            className="block text-gray-600 text-sm font-medium mb-2"
                        >
                            Cover Image Credit
                        </label>
                        <input
                            type="text"
                            id="coverImageCredit"
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none"
                            placeholder="Cover Image Credit"
                            value={coverImageCredit}
                            onChange={(e) =>
                                setCoverImageCredit(e.target.value)
                            }
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="content"
                            className="block text-gray-600 text-sm font-medium mb-2"
                        >
                            Content
                        </label>
                        <textarea
                            id="content"
                            required
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none"
                            placeholder="Content in Markdown"
                            rows={16}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-medium mb-2">
                            Published
                        </label>
                        <input
                            type="checkbox"
                            className="form-checkbox text-blue-500 ml-1 h-5 w-5"
                            checked={published}
                            onChange={() => setPublished(!published)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="block w-60 mx-auto bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                    >
                        Update Post
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditBlogPost;

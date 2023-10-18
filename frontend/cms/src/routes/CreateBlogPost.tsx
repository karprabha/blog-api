import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import useFailedAuth from "../hooks/useFailedAuth";

const CreateBlogPost = () => {
    const fetch = useFetch();
    const failedAuth = useFailedAuth();

    const titleRef = useRef<HTMLInputElement>(null);
    const errRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();
    const location = useLocation();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [published, setPublished] = useState(false);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.focus();
        }
    }, []);

    useEffect(() => {
        setErrorMessages([]);
    }, [title, content]);

    const createBlogPost = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await fetch("/api/v1/blogs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content, published }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setTitle("");
                setContent("");
                navigate("/");
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
            setErrorMessages([`"Post error:", ${error}`]);
            errRef.current?.focus();
        }
    };

    return (
        <div className="flex my-20 items-center justify-center h-full bg-gray-100">
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
                <h2 className="text-2xl text-center mb-4">
                    Create a Blog Post
                </h2>
                <form onSubmit={createBlogPost}>
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
                            placeholder="Content"
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
                        Create Post
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateBlogPost;

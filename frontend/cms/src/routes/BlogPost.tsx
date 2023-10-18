import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import useFailedAuth from "../hooks/useFailedAuth";

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
};

const BlogPost = () => {
    const fetch = useFetch();
    const params = useParams();
    const failedAuth = useFailedAuth();

    const [blog, setBlog] = useState<BlogPostType | null>(null);
    const [loading, setLoading] = useState(true);

    const effectRun = useRef(false);
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getBlog = async () => {
            try {
                const response = await fetch(`/api/v1/blogs/${params.id}`, {
                    method: "GET",
                    signal: controller.signal,
                });

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

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (!blog) {
        return <div className="text-center">Blog post not found.</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 m-4">
            <h2 className="text-2xl font-semibold">{blog.title}</h2>
            <p className="text-gray-500 mb-4">
                By {blog.author.first_name} {blog.author.family_name} (@
                {blog.author.username})
            </p>
            <p className="text-gray-700">{blog.content}</p>
        </div>
    );
};

export default BlogPost;

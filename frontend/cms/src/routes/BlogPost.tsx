import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import useFailedAuth from "../hooks/useFailedAuth";
import ReactMarkdown from "react-markdown";
import CodeBlock from "../components/CodeBlock";
import remarkGfm from "remark-gfm";
import CommentSection from "../components/CommentSection";

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
        <>
            <div className="bg-white rounded-lg shadow-lg p-6 my-10">
                <ReactMarkdown className="mt-4 mb-2 prose prose-pre:p-0">
                    {"# " + blog.title}
                </ReactMarkdown>

                <p className="prose text-gray-500 text-right mb-4">
                    By {blog.author.first_name} {blog.author.family_name} (@
                    {blog.author.username})
                </p>

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
        </>
    );
};

export default BlogPost;

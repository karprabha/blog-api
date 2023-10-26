import { useEffect, useState } from "react";
import format from "date-fns/format";
import { Link } from "react-router-dom";

const API_URI = import.meta.env.VITE_API_URI;

interface Blog {
    _id: string;
    author: string;
    title: string;
    content: string;
    published: boolean;
    cover_image_url: string;
    cover_image_credit: string;
    createdAt: string;
    updatedAt: string;
}

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [blogPosts, setBlogPosts] = useState([]);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URI}/api/v1/blogs`, {
                    method: "GET",
                    signal: controller.signal,
                });

                if (response.ok) {
                    const data = await response.json();

                    isMounted && setBlogPosts(data.results);
                    isMounted && setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

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

    return (
        <div className="container mx-auto mt-5 mb-10 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {blogPosts.map((blog: Blog, index) => (
                    <div
                        key={blog._id}
                        className={`bg-white rounded-lg shadow hover:shadow-lg ${
                            index === 0 ? "lg:col-span-3" : "lg:col-span-1"
                        }`}
                    >
                        <Link to={`/blogs/${blog._id}`} className="block">
                            <img
                                src={blog.cover_image_url}
                                alt={blog.title}
                                className={`w-full ${
                                    index === 0 ? "h-96" : "h-60"
                                } object-cover`}
                            />
                        </Link>
                        <div className="p-4">
                            <Link to={`/blogs/${blog._id}`} className="block">
                                <h3
                                    className={`text-xl font-semibold text-blue-700 hover:underline ${
                                        index === 0 ? "text-2xl" : ""
                                    }`}
                                >
                                    {blog.title}
                                </h3>
                            </Link>
                            <p className="text-gray-600 my-2">
                                {format(
                                    new Date(blog.updatedAt),
                                    "MMMM d, yyyy"
                                )}
                            </p>
                            <p className="text-gray-700">
                                {blog.content.slice(0, 150) +
                                    (blog.content.length > 150 ? "..." : "")}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;

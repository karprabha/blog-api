import Link from "next/link";
import blogs from "@/lib/blogs";
import { format } from "date-fns";

const Home = async () => {
    const { GetAllBlogs } = blogs();
    const blogList = await GetAllBlogs();

    return (
        <div className="container mx-auto mt-5 mb-10 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {blogList.map((blog, index) => (
                    <div
                        key={blog._id}
                        className={`bg-white rounded-lg shadow hover:shadow-lg ${
                            index === 0 ? "lg:col-span-3" : "lg:col-span-1"
                        }`}
                    >
                        <Link href={`/blogs/${blog._id}`} className="block">
                            <img
                                src={blog.cover_image_url}
                                alt={blog.title}
                                className={`w-full ${
                                    index === 0 ? "h-96" : "h-60"
                                } object-cover`}
                            />
                        </Link>
                        <div className="p-4">
                            <Link href={`/blogs/${blog._id}`} className="block">
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

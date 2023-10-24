import Link from "next/link";
import blogs from "@/lib/blogs";
import { format } from "date-fns";

const Home = async () => {
    const { GetAllBlogs } = blogs();
    const blogList = await GetAllBlogs();

    return (
        <div className="container mx-auto mt-5 mb-10 px-4">
            <h2 className="text-2xl font-semibold my-4">Latest Blog Posts</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {blogList.map((blog) => (
                    <div
                        key={blog._id}
                        className="bg-white p-4 rounded-lg shadow"
                    >
                        <Link href={`/blogs/${blog._id}`}>
                            <div className="mb-4">
                                <img
                                    src={blog.cover_image_url}
                                    alt={blog.title}
                                    className="w-full h-60 object-fill"
                                />
                            </div>
                            <h3 className="text-xl font-semibold">
                                {blog.title}
                            </h3>
                        </Link>
                        <p className="text-gray-600 my-2">
                            {format(new Date(blog.updatedAt), "MMMM d, yyyy")}
                        </p>
                        <p className="text-gray-700">
                            {blog.content.slice(0, 100) + "..."}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;

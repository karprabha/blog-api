import Link from "next/link";
import blogs from "@/lib/blogs";
import { format } from "date-fns";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./components/CodeBlock";

const Home = async () => {
    const { GetAllBlogs } = blogs();
    const blogList = await GetAllBlogs();

    return (
        <div className="space-y-4 my-10">
            {blogList.map((blog) => (
                <div
                    key={blog._id}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg"
                >
                    <Link
                        href={`/blogs/${blog._id}`}
                        className="hover:underline"
                    >
                        <ReactMarkdown className="mb-2 prose prose-pre:p-0">
                            {"# " + blog.title}
                        </ReactMarkdown>
                    </Link>
                    <p className="prose text-right text-gray-600 mb-4">
                        {format(new Date(blog.createdAt), "MMMM d, yyyy")}
                    </p>

                    <ReactMarkdown
                        className="mb-10 prose prose-pre:p-0"
                        components={{ code: CodeBlock }}
                        remarkPlugins={[remarkGfm]}
                    >
                        {blog.content.slice(0, 100)}
                    </ReactMarkdown>
                </div>
            ))}
        </div>
    );
};

export default Home;

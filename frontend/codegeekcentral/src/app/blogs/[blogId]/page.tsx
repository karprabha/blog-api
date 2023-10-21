import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import CodeBlock from "../../components/CodeBlock";
import blogs from "@/lib/blogs";
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
    createdAt: string;
};

export async function getStaticPaths() {
    const { GetAllBlogIds } = blogs();
    const paths = await GetAllBlogIds();

    return {
        paths,
        fallback: false,
    };
}

const BlogPost = async ({ params }) => {
    const { GetBlogData } = blogs();
    const blog: BlogPostType = await GetBlogData(params.blogId);

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
                <CommentSection blogId={params.blogId} />
            </div>
        </>
    );
};

export default BlogPost;

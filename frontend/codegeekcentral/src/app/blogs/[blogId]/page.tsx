import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import CodeBlock from "../../components/CodeBlock";
import blogs from "@/lib/blogs";
import CommentSection from "../components/CommentSection";
import format from "date-fns/format";

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
    cover_image_url: string;
    cover_image_credit: string;
    createdAt: string;
    updatedAt: string;
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

                <div>
                    <p className="prose text-gray-500">
                        By {blog.author.first_name} {blog.author.family_name} (@
                        {blog.author.username})
                    </p>

                    <p className="prose text-gray-500 mb-4">
                        {format(new Date(blog.updatedAt), "MMMM d, yyyy")}
                    </p>
                </div>

                <div className="mt-4 mb-4 prose text-right">
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
                <CommentSection blogId={params.blogId} />
            </div>
        </>
    );
};

export default BlogPost;

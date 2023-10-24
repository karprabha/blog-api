import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import CodeBlock from "../../components/CodeBlock";
import blogs from "@/lib/blogs";
import CommentSection from "../components/CommentSection";
import format from "date-fns/format";
import Link from "next/link";

type BlogPostType = {
    _id: string;
    author: {
        _id: string;
        first_name: string;
        family_name: string;
        username: string;
        avatar_url: string;
    };
    title: string;
    content: string;
    published: boolean;
    cover_image_url: string;
    cover_image_credit: string;
    createdAt: string;
    updatedAt: string;
};

export async function generateStaticParams() {
    const { GetAllBlogIds } = blogs();
    const paths = await GetAllBlogIds();

    return paths;
}

type BlogParam = {
    params: {
        blogId: string;
    };
};

const BlogPost: React.FC<BlogParam> = async ({ params }) => {
    const { GetBlogData } = blogs();
    const blog: BlogPostType = (await GetBlogData(
        params.blogId
    )) as BlogPostType;

    return (
        <>
            <div className="bg-white rounded-lg shadow-lg p-6 my-10">
                <ReactMarkdown className="mt-4 mb-2 prose prose-pre:p-0">
                    {"# " + blog.title}
                </ReactMarkdown>

                <div className="prose my-7 flex items-center mb-4">
                    <img
                        src={blog.author.avatar_url}
                        alt={`Avatar for ${blog.author.first_name} ${blog.author.family_name}`}
                        className="my-auto w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                        <Link
                            href={`/users/${blog.author._id}`}
                            className="prose my-0 text-gray-500 no-underline"
                        >
                            {blog.author.first_name} {blog.author.family_name}{" "}
                            (@
                            {blog.author.username})
                        </Link>
                        <p className="prose my-0 text-gray-500">
                            {format(new Date(blog.updatedAt), "MMMM d, yyyy")}
                        </p>
                    </div>
                </div>

                <div className="mt-4 mb-4 prose text-right">
                    <img src={blog.cover_image_url} alt={blog.title} />
                    Image By @{blog.cover_image_credit}
                </div>

                <ReactMarkdown
                    className="mb-10 prose prose-pre:p-0"
                    // @ts-ignore
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

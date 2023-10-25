const API_URI = process.env.NEXT_PUBLIC_API_URI;

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

const Blogs = () => {
    const GetAllBlogIds = async () => {
        let blogList: Blog[] = [];

        try {
            const response = await fetch(
                `${API_URI}/api/v1/blogs?limit=10000000`,
                {
                    next: { revalidate: 60 },
                    method: "GET",
                }
            );

            if (response.ok) {
                const { results } = await response.json();
                blogList = [...blogList, ...results];
            }
        } catch (err) {
            console.error(err);
        }

        return blogList.map((blog) => ({
            blogId: blog._id,
        }));
    };

    const GetBlogData = async (id: string) => {
        let blogData = {};
        try {
            const response = await fetch(`${API_URI}/api/v1/blogs/${id}`, {
                next: { revalidate: 3600 },
                method: "GET",
            });

            if (response.ok) {
                const { blog } = await response.json();

                blogData = blog;
            }
        } catch (err) {
            console.log("error");

            console.error(err);
        }

        return blogData;
    };

    const GetAllBlogs = async () => {
        let blogList: Blog[] = [];

        try {
            const response = await fetch(
                `${API_URI}/api/v1/blogs?limit=10000000`,
                {
                    next: { revalidate: 60 },
                    method: "GET",
                }
            );

            if (response.ok) {
                const { results } = await response.json();
                blogList = results;
            }
        } catch (err) {
            console.error(err);
        }

        return blogList;
    };

    return { GetAllBlogIds, GetAllBlogs, GetBlogData };
};

export default Blogs;

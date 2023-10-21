interface Blog {
    _id: string;
    author: string;
    title: string;
    content: string;
    published: boolean;
    createdAt: string;
}

const Blogs = () => {
    const GetAllBlogIds = async () => {
        let blogList: Blog[] = [];

        try {
            const response = await fetch(
                `http://localhost:3000/api/v1/blogs?limit=10000000`,
                {
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

        return blogList.map((blog) => {
            return {
                params: {
                    blogId: blog._id,
                },
            };
        });
    };

    const GetBlogData = async (id: string) => {
        let blogData = {};
        try {
            const response = await fetch(
                `http://localhost:3000/api/v1/blogs/${id}`,
                {
                    method: "GET",
                }
            );

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
                "http://localhost:3000/api/v1/blogs?limit=10000000",
                {
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

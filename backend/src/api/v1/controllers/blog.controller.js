import expressAsyncHandler from "express-async-handler";

import Blog from "../models/blog.js";
import Comment from "../models/comment.js";

const getAllBlogs = expressAsyncHandler(async (req, res, next) => {
    const allBlogs = await Blog.find({}, "title content").exec();
    res.json(allBlogs);
});

const getBlogDetail = expressAsyncHandler(async (req, res, next) => {
    const [blog, comments] = await Promise.all([
        Blog.findById(req.params.id, "title content").exec(),
        Comment.find({ blog: req.params.id }).exec(),
    ]);

    if (!blog) {
        const err = new Error("Book not found");
        err.status = 404;
        return next(err);
    }

    res.json({ blog, comments });
});

export default { getAllBlogs, getBlogDetail };

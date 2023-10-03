import expressAsyncHandler from "express-async-handler";

import Blog from "../models/blog.js";
import Comment from "../models/comment.js";

const getAllBlogPosts = expressAsyncHandler(async (req, res, next) => {
    const allBlogs = await Blog.find({}, "title content").exec();
    return res.status(200).json(allBlogs);
});

const getBlogPostById = expressAsyncHandler(async (req, res, next) => {
    const [blog, comments] = await Promise.all([
        Blog.findById(req.params.id, "title content").exec(),
        Comment.find({ blog: req.params.id }).exec(),
    ]);

    if (!blog) {
        const err = new Error("Book not found");
        err.status = 404;
        return next(err);
    }

    return res.status(200).json({ blog, comments });
});

const createBlogPost = expressAsyncHandler(async (req, res, next) => {
    const { user, title, content, published } = req.body;

    const createdBlog = await Blog.create({
        user,
        title,
        content,
        published,
    });

    res.status(201).json(createdBlog);
});

const updateBlogPostById = expressAsyncHandler(async (req, res, next) => {
    const { user, title, content, published } = req.body;

    const blogData = {
        user,
        title,
        content,
        published,
    };

    const updatedBlogPost = await Blog.findByIdAndUpdate(
        req.params.id,
        blogData,
        { new: true }
    );

    if (!updatedBlogPost) {
        res.status(404).json({ message: "Blog post not found" });
    }

    res.status(200).json(updatedBlogPost);
});

const partiallyUpdateBlogPostById = expressAsyncHandler(
    async (req, res, next) => {
        const { user, title, content, published } = req.body;

        const blogData = {
            ...(user !== undefined && { user }),
            ...(title !== undefined && { title }),
            ...(content !== undefined && { content }),
            ...(published !== undefined && { published }),
        };

        const partiallyUpdatedBlogPost = await Blog.findByIdAndUpdate(
            req.params.id,
            blogData,
            { new: true }
        );

        if (!partiallyUpdatedBlogPost) {
            res.status(404).json({ message: "Blog post not found" });
        }

        res.status(200).json(partiallyUpdatedBlogPost);
    }
);

export default {
    getAllBlogPosts,
    getBlogPostById,
    createBlogPost,
    updateBlogPostById,
    partiallyUpdateBlogPostById,
};

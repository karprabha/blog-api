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
        return res.status(404).json({ message: "Blog post not found" });
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

    return res.status(201).json(createdBlog);
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
        return res.status(404).json({ message: "Blog post not found" });
    }

    return res.status(200).json(updatedBlogPost);
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
            return res.status(404).json({ message: "Blog post not found" });
        }

        return res.status(200).json(partiallyUpdatedBlogPost);
    }
);

const deleteBlogPostById = expressAsyncHandler(async (req, res, next) => {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);

    if (!deletedBlog) {
        return res.status(404).json({ message: "Blog post not found" });
    }

    return res.status(204).send();
});

export default {
    getAllBlogPosts,
    getBlogPostById,
    createBlogPost,
    updateBlogPostById,
    partiallyUpdateBlogPostById,
    deleteBlogPostById,
};

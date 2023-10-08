import expressAsyncHandler from "express-async-handler";

import Blog from "../models/blog.js";
import Comment from "../models/comment.js";

const getAllComments = expressAsyncHandler(async (req, res, next) => {
    const allComments = await Comment.find({ blogPost: req.params.blogId })
        .populate("author", "username")
        .exec();
    return res.status(200).json(allComments);
});

const getCommentById = expressAsyncHandler(async (req, res, next) => {
    const comment = await Comment.find({
        blogPost: req.params.blogId,
        _id: req.params.id,
    })
        .populate("author", "first_name family_name username")
        .exec();

    if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json(comment);
});

const createComment = expressAsyncHandler(async (req, res, next) => {
    const { author, text } = req.body;

    // Handle this in validation
    const existingBlog = await Blog.findById(req.params.blogId);

    if (!existingBlog) {
        return res.status(404).json({ message: "Blog for comment not found" });
    }

    const blogPost = req.params.blogId;
    const createdComment = await Comment.create({
        author,
        blogPost,
        text,
    });

    return res.status(201).json(createdComment);
});

const updateCommentById = expressAsyncHandler(async (req, res, next) => {
    const { author, text } = req.body;

    const existingBlog = await Blog.findById(req.params.blogId);

    if (!existingBlog) {
        return res.status(404).json({ message: "Blog for comment not found" });
    }

    const blogPost = req.params.blogId;
    const commentData = {
        author,
        blogPost,
        text,
    };

    const updatedComment = await Comment.findByIdAndUpdate(
        req.params.id,
        commentData,
        { new: true }
    );

    if (!updatedComment) {
        return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json(updatedComment);
});

const partiallyUpdateCommentById = expressAsyncHandler(
    async (req, res, next) => {
        const { author, text } = req.body;

        const existingBlog = await Blog.findById(req.params.blogId);

        if (!existingBlog) {
            return res
                .status(404)
                .json({ message: "Blog for comment not found" });
        }

        const blogPost = req.params.blogId;
        const commentData = {
            ...(author !== undefined && { author }),
            ...(blogPost !== undefined && { blogPost }),
            ...(text !== undefined && { text }),
        };

        const partiallyUpdatedComment = await Comment.findByIdAndUpdate(
            req.params.id,
            commentData,
            { new: true }
        );

        if (!partiallyUpdatedComment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        return res.status(200).json(partiallyUpdatedComment);
    }
);

const deleteCommentById = expressAsyncHandler(async (req, res, next) => {
    const deletedComment = await Comment.findOneAndDelete({
        blogPost: req.params.blogId,
        _id: req.params.id,
    });

    if (!deletedComment) {
        return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(204).send();
});

export default {
    getAllComments,
    getCommentById,
    createComment,
    updateCommentById,
    partiallyUpdateCommentById,
    deleteCommentById,
};

import expressAsyncHandler from "express-async-handler";

import Blog from "../models/blog.js";
import Comment from "../models/comment.js";

const getAllComments = expressAsyncHandler(async (req, res, next) => {
    const allComments = await Comment.find({ blog: req.params.blogId })
        .populate("user", "username")
        .exec();
    return res.status(200).json(allComments);
});

const getCommentById = expressAsyncHandler(async (req, res, next) => {
    const comment = await Comment.find({
        blog: req.params.blogId,
        _id: req.params.id,
    })
        .populate("user", "first_name family_name username")
        .exec();

    if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(comment);
});

const createComment = expressAsyncHandler(async (req, res, next) => {
    const { user, text } = req.body;

    // Handle this in validation
    const existingBlog = await Blog.findById(req.params.blogId);

    if (!existingBlog) {
        return res.status(404).json({ message: "Blog for comment not found" });
    }

    const blog = req.params.blogId;
    const createdComment = await Comment.create({
        user,
        blog,
        text,
    });

    return res.status(201).json(createdComment);
});

const updateCommentById = expressAsyncHandler(async (req, res, next) => {
    const { user, text } = req.body;

    const existingBlog = await Blog.findById(req.params.blogId);

    if (!existingBlog) {
        return res.status(404).json({ message: "Blog for comment not found" });
    }

    const blog = req.params.blogId;
    const commentData = {
        user,
        blog,
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
        const { user, text } = req.body;

        const existingBlog = await Blog.findById(req.params.blogId);

        if (!existingBlog) {
            return res
                .status(404)
                .json({ message: "Blog for comment not found" });
        }

        const blog = req.params.blogId;
        const commentData = {
            ...(user !== undefined && { user }),
            ...(blog !== undefined && { blog }),
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
        blog: req.params.blogId,
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

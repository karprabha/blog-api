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

export default { getAllComments, getCommentById, createComment };

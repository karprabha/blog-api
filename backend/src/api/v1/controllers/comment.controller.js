import expressAsyncHandler from "express-async-handler";

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

export default { getAllComments, getCommentById };

import expressAsyncHandler from "express-async-handler";

import Comment from "../models/comment.js";

const getAllComments = expressAsyncHandler(async (req, res, next) => {
    const allComments = await Comment.find({ blog: req.params.blogId })
        .populate("user", "username")
        .exec();
    return res.status(200).json(allComments);
});

export default { getAllComments };

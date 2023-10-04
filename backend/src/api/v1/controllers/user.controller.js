import expressAsyncHandler from "express-async-handler";

import User from "../models/user.js";
import Blog from "../models/blog.js";
import Comment from "../models/comment.js";

const getAllUsers = expressAsyncHandler(async (req, res, next) => {
    const allUsers = await User.find(
        {},
        "first_name family_name username membership_status"
    ).exec();

    res.status(200).json(allUsers);
});

const getUserById = expressAsyncHandler(async (req, res, next) => {
    const [user, blogs, comments] = await Promise.all([
        User.findById(
            req.params.id,
            "first_name family_name username membership_status"
        ),
        Blog.find({ user: req.params.id }, "title content"),
        Comment.find({ user: req.params.id }, "text")
            .populate("blog", "title")
            .exec(),
    ]);

    if (!user) {
        const err = new Error("Book not found");
        err.status = 404;
        return next(err);
    }

    return res.status(200).json({ user, blogs, comments });
});

export default {
    getAllUsers,
    getUserById,
};

import bcrypt from "bcryptjs";
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

const createUser = expressAsyncHandler(async (req, res, next) => {
    const { first_name, family_name, username } = req.body;
    const password = await bcrypt.hash(req.body.password, 10);

    const createdUser = await User.create({
        first_name,
        family_name,
        username,
        password,
    });

    return res.status(201).json(createdUser);
});

const updateUserById = expressAsyncHandler(async (req, res, next) => {
    const { first_name, family_name, username } = req.body;
    const password = await bcrypt.hash(req.body.password, 10);

    const userData = {
        first_name,
        family_name,
        username,
        password,
    };

    const updatedUser = await User.findByIdAndUpdate(req.params.id, userData, {
        new: true,
    });

    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
});

const partiallyUpdateUserById = expressAsyncHandler(async (req, res, next) => {
    const { first_name, family_name, username } = req.body;
    const password = req.body.password
        ? await bcrypt.hash(req.body.password, 10)
        : undefined;

    const userData = {
        ...(first_name !== undefined && { first_name }),
        ...(family_name !== undefined && { family_name }),
        ...(username !== undefined && { username }),
        ...(password !== undefined && { password }),
    };

    const partiallyUpdatedUser = await User.findByIdAndUpdate(
        req.params.id,
        userData,
        {
            new: true,
        }
    );

    if (!partiallyUpdatedUser) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(partiallyUpdatedUser);
});

export default {
    getAllUsers,
    getUserById,
    createUser,
    updateUserById,
    partiallyUpdateUserById,
};

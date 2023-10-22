import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";

import User from "../models/user.js";
import Blog from "../models/blog.js";
import Comment from "../models/comment.js";

const getAllUsers = expressAsyncHandler(async (req, res, next) => {
    const users = req.paginatedResults.results;

    const usersWithoutPasswordAndRole = users.map((user) => {
        const { password, role, ...userWithoutSensitiveInfo } = user.toObject();
        return userWithoutSensitiveInfo;
    });

    req.paginatedResults.results = usersWithoutPasswordAndRole;

    res.status(200).json(req.paginatedResults);
});

const getUserById = expressAsyncHandler(async (req, res, next) => {
    const filter = req.isAuthorized ? {} : { published: true };

    const [user, blogs, recentComments] = await Promise.all([
        User.findById(req.params.id, "first_name family_name username role"),
        Blog.find({ author: req.params.id, ...filter }, "title published").sort(
            {
                createdAt: -1,
            }
        ),
        Comment.find({ author: req.params.id }, "text")
            .populate("blogPost", "title")
            .sort({ createdAt: -1 })
            .limit(10)
            .exec(),
    ]);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user, blogs, recentComments });
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

const deleteUserById = expressAsyncHandler(async (req, res, next) => {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(204).send();
});

export default {
    getAllUsers,
    getUserById,
    createUser,
    updateUserById,
    partiallyUpdateUserById,
    deleteUserById,
};

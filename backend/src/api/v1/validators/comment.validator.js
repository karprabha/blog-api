import mongoose from "mongoose";
import { body, param } from "express-validator";

import Blog from "../models/blog.js";

const getAllCommentsValidator = [
    param("blogId").custom(async (value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new Error("Blog not found");
        }
        const existingBlog = await Blog.findById(value);
        if (!existingBlog) {
            throw new Error("Blog not found");
        }
    }),
];

const getCommentByIdValidator = [
    param("blogId").custom(async (value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new Error("Blog not found");
        }
        const existingBlog = await Blog.findById(value);
        if (!existingBlog) {
            throw new Error("Blog not found");
        }
    }),
];

const createCommentValidator = [
    body("text")
        .notEmpty()
        .withMessage("Text is required")
        .isLength({ min: 1, max: 2000 })
        .withMessage("Text must be between 1 and 2000 characters"),
    param("blogId").custom(async (value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new Error("Blog not found");
        }
        const existingBlog = await Blog.findById(value);
        if (!existingBlog) {
            throw new Error("Blog not found");
        }
    }),
];

const updateCommentValidator = [
    param("id").notEmpty().withMessage("Comment ID is required"),
    body("text")
        .notEmpty()
        .withMessage("Text is required")
        .isLength({ min: 1, max: 2000 })
        .withMessage("Text must be between 1 and 2000 characters"),
    param("blogId").custom(async (value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new Error("Blog not found");
        }
        const existingBlog = await Blog.findById(value);
        if (!existingBlog) {
            throw new Error("Blog not found");
        }
    }),
];

const partiallyUpdateCommentValidator = [
    param("id").notEmpty().withMessage("Comment ID is required"),
    body("text")
        .optional()
        .notEmpty()
        .withMessage("Text is required")
        .isLength({ min: 1, max: 2000 })
        .withMessage("Text must be between 1 and 2000 characters"),
    param("blogId").custom(async (value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new Error("Blog not found");
        }
        const existingBlog = await Blog.findById(value);
        if (!existingBlog) {
            throw new Error("Blog not found");
        }
    }),
];

const deleteCommentValidator = [
    param("id").notEmpty().withMessage("Comment ID is required"),
    param("blogId").custom(async (value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new Error("Blog not found");
        }
        const existingBlog = await Blog.findById(value);
        if (!existingBlog) {
            throw new Error("Blog not found");
        }
    }),
];

export default {
    getAllCommentsValidator,
    getCommentByIdValidator,
    createCommentValidator,
    updateCommentValidator,
    partiallyUpdateCommentValidator,
    deleteCommentValidator,
};

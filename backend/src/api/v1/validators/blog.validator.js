import { body, param } from "express-validator";

const createBlogPostValidator = [
    body("title")
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 1, max: 255 })
        .withMessage("Title must be between 1 and 255 characters"),
    body("content")
        .notEmpty()
        .withMessage("Content is required")
        .isLength({ min: 1, max: 30000 })
        .withMessage("Content must be between 1 and 30000 characters"),
    body("published").isBoolean().withMessage("Published must be a boolean"),
];

const updateBlogPostValidator = [
    param("id").notEmpty().withMessage("Blog post ID is required"),
    body("title")
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 1, max: 255 })
        .withMessage("Title must be between 1 and 255 characters"),
    body("content")
        .notEmpty()
        .withMessage("Content is required")
        .isLength({ min: 1, max: 30000 })
        .withMessage("Content must be between 1 and 30000 characters"),
    body("published").isBoolean().withMessage("Published must be a boolean"),
];

const partiallyUpdateBlogPostValidator = [
    param("id").notEmpty().withMessage("Blog post ID is required"),
    body("title")
        .optional()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 1, max: 255 })
        .withMessage("Title must be between 1 and 255 characters"),
    body("content")
        .optional()
        .notEmpty()
        .withMessage("Content is required")
        .isLength({ min: 1, max: 30000 })
        .withMessage("Content must be between 1 and 30000 characters"),
    body("published")
        .optional()
        .isBoolean()
        .withMessage("Published must be a boolean"),
];

const deleteBlogPostValidator = [
    param("id").notEmpty().withMessage("Blog post ID is required"),
];

export default {
    createBlogPostValidator,
    updateBlogPostValidator,
    partiallyUpdateBlogPostValidator,
    deleteBlogPostValidator,
};

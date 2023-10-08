import { body } from "express-validator";

const loginValidator = [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
];

const refreshAccessTokenValidator = [
    body("refreshToken").notEmpty().withMessage("Refresh token is required"),
];

const logoutValidator = [
    body("refreshToken").notEmpty().withMessage("Refresh token is required"),
];

export default {
    loginValidator,
    refreshAccessTokenValidator,
    logoutValidator,
};

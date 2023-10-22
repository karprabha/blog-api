import jwt from "../../../../utils/jwt.util.js";

import User from "../models/user.js";
import Blog from "../models/blog.js";
import Comment from "../models/comment.js";

const models = {
    user: User,
    blog: Blog,
    comment: Comment,
};

const checkVisibility =
    (allowedRoles, resourceType) => async (req, res, next) => {
        const token = req.header("Authorization");

        if (!token) {
            return next();
        }

        try {
            const decoded = jwt.verifyAccessToken(token);

            if (!decoded) {
                return next();
            }

            const user = await User.findById(
                decoded.user_id,
                "first_name family_name username role"
            );

            if (!user) {
                return next();
            }

            const { role } = user;
            req.user = user;

            if (!allowedRoles.includes(role)) {
                return next();
            }

            const resourceId = req.params.id;
            const userIdFromToken = req.user.id;
            const Model = models[resourceType];

            if (!Model) {
                return next();
            }

            const resource = await Model.findById(resourceId);

            if (!resource) {
                return next();
            }

            const isAuthorNotMatching = resource.author
                ? resource.author.toString() !== userIdFromToken
                : true;

            const isUserIdNotMatching =
                resource._id.toString() !== userIdFromToken;

            if (isAuthorNotMatching && isUserIdNotMatching) {
                return next();
            }
            req.isAuthorized = true;
        } catch (error) {
            return res.status(500).json({ message: "Internal server error." });
        }

        return next();
    };

export default { checkVisibility };

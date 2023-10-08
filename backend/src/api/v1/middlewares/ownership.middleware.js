import User from "../models/user.js";
import Blog from "../models/blog.js";
import Comment from "../models/comment.js";

const models = {
    user: User,
    blog: Blog,
    comment: Comment,
};

const checkOwnership = (resourceType) => async (req, res, next) => {
    try {
        const resourceId = req.params.id;
        const userIdFromToken = req.user._id;

        const Model = models[resourceType];

        if (!Model) {
            return res.status(404).json({ message: "Invalid resource type" });
        }

        const resource = await Model.findById(resourceId);

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        const isAuthorNotMatching = resource.author
            ? resource.author.toString() !== userIdFromToken.toString()
            : true;

        const isUserIdNotMatching =
            resource._id.toString() !== userIdFromToken.toString();

        if (isAuthorNotMatching && isUserIdNotMatching) {
            return res
                .status(403)
                .json({ message: "Access denied. Insufficient permissions." });
        }
        return next();
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
};

export default checkOwnership;

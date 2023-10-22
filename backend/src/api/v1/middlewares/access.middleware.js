import Blog from "../models/blog.js";
import authMiddleware from "./auth.middleware.js";

const checkBlogAccess = async (req, res, next) => {
    const { blogId } = req.params;

    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        if (!blog.published) {
            return authMiddleware.authenticateToken(req, res, () => {
                authMiddleware.authorizeRoles(["admin"])(req, res, () => {
                    const userIdFromToken = req.user.id;

                    const isAuthorNotMatching = blog.author
                        ? blog.author.toString() !== userIdFromToken
                        : true;

                    const isUserIdNotMatching =
                        blog._id.toString() !== userIdFromToken;

                    if (isAuthorNotMatching && isUserIdNotMatching) {
                        return res.status(403).json({
                            message: "Access denied. Insufficient permissions.",
                        });
                    }
                    return next();
                });
            });
        }
        return next();
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default { checkBlogAccess };

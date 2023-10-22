import Blog from "../models/blog.js";
import authMiddleware from "./auth.middleware.js";
import checkOwnership from "./ownership.middleware.js";

const checkBlogAccess = async (req, res, next) => {
    const { blogId } = req.params;

    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        if (!blog.published) {
            authMiddleware.authenticateToken(req, res, () => {
                authMiddleware.authorizeRoles(["admin"])(req, res, () => {
                    checkOwnership("blog")(req, res, () => {
                        next();
                    });
                });
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }

    return next();
};

export default { checkBlogAccess };

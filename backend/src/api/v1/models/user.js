import { Schema, model } from "mongoose";

import Blog from "./blog.js";
import Comment from "./comment.js";
import RefreshToken from "./refreshToken.js";

const UserSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 100 },
    family_name: { type: String, required: true, maxLength: 100 },
    username: { type: String, required: true, maxLength: 50, unique: true },
    password: { type: String, required: true, maxLength: 128 },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    avatar_url: {
        type: String,
        default:
            "https://res.cloudinary.com/dn3rb7yf5/image/upload/v1698059883/blank_avatar_wdye0t.png",
        minlength: 10,
        maxlength: 255,
    },
});

UserSchema.pre("findOneAndDelete", async function (next) {
    const userId = this.getQuery()._id;
    try {
        await Blog.deleteMany({ author: userId });
        await Comment.deleteMany({ author: userId });
        await RefreshToken.deleteOne({ user: userId });
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.index({ username: 1 });

const User = model("User", UserSchema);

export default User;

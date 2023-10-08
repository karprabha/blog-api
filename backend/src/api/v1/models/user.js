import { Schema, model } from "mongoose";

import Blog from "./blog.js";
import Comment from "./comment.js";

const UserSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 100 },
    family_name: { type: String, required: true, maxLength: 100 },
    username: { type: String, required: true, maxLength: 50 },
    password: { type: String, required: true, maxLength: 128 },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
});

UserSchema.virtual("name").get(function () {
    let fullname = "";
    if (this.first_name && this.family_name) {
        fullname = `${this.first_name} ${this.family_name}`;
    }

    return fullname;
});

UserSchema.virtual("url").get(function () {
    return `/api/v1/users/${this._id}`;
});

UserSchema.pre("findOneAndDelete", async function (next) {
    const userId = this.getQuery()._id;
    try {
        await Blog.deleteMany({ author: userId });
        await Comment.deleteMany({ author: userId });
        next();
    } catch (error) {
        next(error);
    }
});

const User = model("User", UserSchema);

export default User;

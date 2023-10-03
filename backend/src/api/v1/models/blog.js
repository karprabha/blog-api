import { Schema, model } from "mongoose";

const BlogSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, minLength: 1, maxLength: 255 },
    content: { type: String, required: true, minLength: 1, maxLength: 30000 },
    added: { type: Date, default: Date.now },
    published: { type: Boolean, required: true, default: false },
});

BlogSchema.virtual("url").get(function () {
    return `/api/v1/blogs/${this._id}`;
});

const Blog = model("Blog", BlogSchema);

export default Blog;

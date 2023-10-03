import { Schema, model } from "mongoose";

const BlogSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        title: { type: String, required: true, minLength: 1, maxLength: 255 },
        content: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 30000,
        },
        published: { type: Boolean, required: true, default: false },
    },
    { timestamps: true }
);

BlogSchema.virtual("url").get(function () {
    return `/api/v1/blogs/${this._id}`;
});

const Blog = model("Blog", BlogSchema);

export default Blog;

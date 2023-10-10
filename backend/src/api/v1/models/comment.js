import { Schema, model } from "mongoose";

const CommentSchema = new Schema(
    {
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
        blogPost: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
        text: { type: String, required: true, minLength: 1, maxLength: 2000 },
    },
    { timestamps: true }
);

CommentSchema.index({ author: 1 });
CommentSchema.index({ blogPost: 1 });
CommentSchema.index({ createdAt: -1 });

const Comment = model("Comment", CommentSchema);

export default Comment;

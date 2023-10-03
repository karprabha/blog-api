import { Schema, model } from "mongoose";

const CommentSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        blog: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
        text: { type: String, required: true, minLength: 1, maxLength: 2000 },
    },
    { timestamps: true }
);

const Comment = model("Comment", CommentSchema);

export default Comment;

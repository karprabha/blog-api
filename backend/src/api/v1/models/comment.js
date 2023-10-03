import { Schema, model } from "mongoose";

const CommentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    blog: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
    title: { type: String, required: true, minLength: 1, maxLength: 255 },
    content: { type: String, required: true, minLength: 1, maxLength: 30000 },
    added: { type: Date, default: Date.now },
    published: { type: Boolean, required: true, default: false },
});

const Comment = model("Comment", CommentSchema);

export default Comment;

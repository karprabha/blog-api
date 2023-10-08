import { Schema, model } from "mongoose";

const refreshTokenSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, default: Date.now, expires: 7 * 86400 },
});

const RefreshToken = model("RefreshToken", refreshTokenSchema);

export default RefreshToken;

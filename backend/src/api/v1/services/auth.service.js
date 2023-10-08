import bcrypt from "bcryptjs";

import User from "../models/user.js";

const authenticateUser = async ({ username, password }) => {
    try {
        const user = await User.findOne({ username });

        if (!user) {
            return null;
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return null;
        }

        return { user_id: user._id };
    } catch (error) {
        console.error("Authentication error:", error);
        return null;
    }
};

export default { authenticateUser };

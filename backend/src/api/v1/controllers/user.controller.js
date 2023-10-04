import expressAsyncHandler from "express-async-handler";

import User from "../models/user.js";

const getAllUsers = expressAsyncHandler(async (req, res, next) => {
    const allUsers = await User.find(
        {},
        "first_name family_name username membership_status"
    ).exec();

    res.status(200).json(allUsers);
});

export default {
    getAllUsers,
};

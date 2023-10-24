import fs from "fs";

const uploadImageValidator = (req, res, next) => {
    try {
        if (!req.file || !req.body) {
            return res
                .status(400)
                .json({ msg: "Issue with uploading this image." });
        }

        const { mimetype, size, path } = req.file;

        if (
            !mimetype.includes("jpeg") &&
            !mimetype.includes("jpg") &&
            !mimetype.includes("png")
        ) {
            fs.unlinkSync(path);
            return res.status(400).json({ msg: "This file is not supported." });
        }

        if (size > 1024 * 1024) {
            fs.unlinkSync(path);
            return res
                .status(400)
                .json({ msg: "This file is too large (Max: 1MB)" });
        }

        return next();
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

export default { uploadImageValidator };

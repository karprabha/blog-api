import uploadService from "../services/upload.service.js";

const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ msg: "Issue with uploading this image." });
        }

        const { file } = req;

        const result = await uploadService.processUploadedImage(file);

        if (result.error) {
            return res.status(500).json({ msg: result.error });
        }

        return res.status(200).json({
            msg: "Uploaded successfully.",
            url: result.secure_url,
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

export default { uploadImage };

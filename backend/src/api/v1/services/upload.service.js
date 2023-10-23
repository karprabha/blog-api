import fs from "fs";
import multer from "multer";
import cloudinary from "../../../../config/cloudinary.config.js";

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./src/api/v1/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    cb(null, true);
};

const processUploadedImage = (file) =>
    new Promise((resolve) => {
        cloudinary.uploader.upload(
            file.path,
            {
                folder: "avatar",
                width: 500,
                height: 500,
                crop: "fill",
            },
            (err, result) => {
                fs.unlinkSync(file.path);
                if (err) {
                    resolve({ error: err.message });
                }
                resolve(result);
            }
        );
    });

export default { multerStorage, fileFilter, processUploadedImage };

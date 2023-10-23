import multer from "multer";
import uploadService from "../services/upload.service.js";

const uploadImage = multer({
    storage: uploadService.multerStorage,
    fileFilter: uploadService.fileFilter,
}).single("avatar");

export default { uploadImage };

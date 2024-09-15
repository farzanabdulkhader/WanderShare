import multer from "multer";
import { v1 as uuidv1 } from "uuid";

const MIME_TYPE_MAP = {
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/png": "png",
};

// Utility function to create a multer configuration
const createFileUpload = (destination) => {
  return multer({
    limits: 500000,
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, destination);
      },
      filename: (req, file, cb) => {
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, uuidv1() + "." + ext);
      },
    }),
    fileFilter: (req, file, cb) => {
      const isValid = !!MIME_TYPE_MAP[file.mimetype];
      const error = isValid ? null : new Error("Invalid mime type!");
      cb(error, isValid);
    },
  });
};

// Separate middlewares for user and place images
export const userImageUpload = createFileUpload("uploads/user-images");
export const placeImageUpload = createFileUpload("uploads/place-images");

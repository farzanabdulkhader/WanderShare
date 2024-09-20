import multer from "multer";

const imageUpload = () => {
  return multer({
    storage: multer.memoryStorage(),
  });
};

export default imageUpload().single("image");

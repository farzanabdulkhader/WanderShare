import path from "path";
import mime from "mime-types";
import DataUriParser from "datauri/parser.js";

const getDataUrl = (file) => {
  const parser = new DataUriParser();
  const extName = path.extname(file.originalname).toLowerCase(); // Get the file extension
  const mimeType = mime.lookup(extName); // Determine the MIME type from the extension

  if (!mimeType) {
    throw new Error(`Unable to determine MIME type for extension ${extName}`);
  }

  return parser.format(mimeType, file.buffer); // Correctly pass MIME type and buffer
};

export default getDataUrl;

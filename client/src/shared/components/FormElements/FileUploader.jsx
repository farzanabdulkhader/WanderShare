import Button from "./Button";
import { LuImagePlus } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import "./FileUploader.css";

function FileUploader({ onInput, id, uploadField = "" }) {
  const [file, setFile] = useState();
  const filePickerRef = useRef();
  const [isValid, setIsValid] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const handlePickImage = (e) => {
    e.preventDefault();
    filePickerRef.current.click();
  };

  const handlePickedFile = (e) => {
    let fileIsValid = isValid;
    let pickedFile;
    if (e.target.files && e.target.files.length === 1) {
      pickedFile = e.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    onInput(id, pickedFile, fileIsValid);
  };

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();

    // Define what happens when the file is successfully read
    fileReader.onload = () => {
      setImagePreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file); // Read the file as a Data URL (Base64)
  }, [file]);

  return (
    <div className={`preview-img ${uploadField}`}>
      <label>Upload image</label>
      <img src={imagePreviewUrl} alt="Preview" />
      <input
        style={{ display: "none" }}
        type="file"
        ref={filePickerRef}
        onChange={(e) => handlePickedFile(e)}
      />
      <Button
        size="small"
        type="button"
        style="inverse"
        onClick={(e) => handlePickImage(e)}
      >
        <LuImagePlus />
      </Button>
    </div>
  );
}

export default FileUploader;

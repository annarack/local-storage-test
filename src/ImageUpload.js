import "./App.css";
import useLocalStorage from "react-use-localstorage";
import { useEffect, useRef, useState } from "react";

export default function ImageUpload(props) {
  const [localImg, setLocalImg] = useLocalStorage(props.imgID, null);
  const [imageURI, setImageURI] = useState();

  let fileInput = useRef();

  // on app start load base64 image string from local storage
  useEffect(() => {
    if (localImg) {
      setImageURI(localImg);
    }
  }, []);

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fileInput.current.files && fileInput.current.files[0]) {
      getBase64(fileInput.current.files[0]).then((base64) => {
        setLocalImg(base64);
      });
    }
  };

  const showImage = (e) => {
    e.preventDefault();
    if (fileInput.current.files && fileInput.current.files[0]) {
      let reader = new FileReader();
      reader.onload = function (ev) {
        setImageURI(ev.target.result);
      };
      reader.readAsDataURL(fileInput.current.files[0]);
    }
  };

  const deleteImage = () => {
    localStorage.removeItem(props.imgID);
    setImageURI();
  };

  return (
    <div className="ImgUploadContainer">
      {imageURI && (
        <div className="ImageContainer">
          <img className="Image" src={imageURI} alt=""></img>
        </div>
      )}
      <form className="ImgUpload" onSubmit={handleSubmit}>
        <label>
          Choose image:
          <input type="file" ref={fileInput} onChange={showImage} />
        </label>
        <br />
        <br />
        <button type="submit">Save to local storage</button>
        <br />
        <br />
        <button onClick={deleteImage}>Delete image</button>
      </form>
    </div>
  );
}

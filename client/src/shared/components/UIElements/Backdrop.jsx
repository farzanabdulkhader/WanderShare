import ReactDOM from "react-dom";
import "./Backdrop.css";

function Backdrop({ onClickBackdrop }) {
  const content = <div className="backdrop" onClick={onClickBackdrop}></div>;
  return ReactDOM.createPortal(
    content,
    document.getElementById("backdrop-hook")
  );
}

export default Backdrop;

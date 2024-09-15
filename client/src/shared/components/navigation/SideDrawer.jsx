import NavLinks from "./NavLinks";
import ReactDOM from "react-dom";
import "./SideDrawer.css";

function SideDrawer({ children, onClickSideDrawer, isOpenSideDrawer }) {
  const content = (
    <div
      className={`side-drawer ${isOpenSideDrawer ? "show" : ""}`}
      onClick={onClickSideDrawer}
    >
      {children}
    </div>
  );

  return ReactDOM.createPortal(content, document.getElementById("drawer-hook"));
}

export default SideDrawer;

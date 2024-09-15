import React from "react";
import ReactDOM from "react-dom";

import Backdrop from "./Backdrop";
import "./Modal.css";

const ModalOverlay = (props) => {
  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClass}`}>
        <h3>{props.header}</h3>
      </header>
      {/* Conditionally render a form only if an onSubmit prop is provided */}
      {props.onSubmit ? (
        <form onSubmit={props.onSubmit}>
          <div className={`modal__content ${props.contentClass}`}>
            {props.children}
          </div>
          <footer className={`modal__footer ${props.footerClass}`}>
            {props.footer}
          </footer>
        </form>
      ) : (
        <div>
          <div className={`modal__content ${props.contentClass}`}>
            {props.children}
          </div>
          <footer className={`modal__footer ${props.footerClass}`}>
            {props.footer}
          </footer>
        </div>
      )}
    </div>
  );
  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
};

const Modal = (props) => {
  return (
    <React.Fragment>
      {props.show && <Backdrop onClick={props.onCancel} />}
      {props.show && <ModalOverlay {...props} />}
    </React.Fragment>
  );
};

export default Modal;

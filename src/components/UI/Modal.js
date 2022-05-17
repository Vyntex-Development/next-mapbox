import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import classes from "./Modal.module.css";

const Modal = ({ show, onClose, children, title }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  const modalWrapperRef = useRef();

  const backDropHandler = (e) => {
    if (!modalWrapperRef?.current?.contains(e.target) && !e.target.id) {
      onClose();
    }
  };

  useEffect(() => {
    setIsBrowser(true);
    window.addEventListener("click", backDropHandler);
    return () => window.removeEventListener("click", backDropHandler);
  }, []);

  const handleCloseClick = (e) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = show ? (
    <div className={classes.modalOverlay}>
      <div className={classes.modalWrapper} ref={modalWrapperRef}>
        <div className={classes.modal}>
          <span className={classes.header}>
            <a href="#" onClick={handleCloseClick}>
              x
            </a>
          </span>
          {title && <h2>{title}</h2>}
          <div className={classes.modalBody}>{children}</div>
        </div>
      </div>
    </div>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")
    );
  } else {
    return null;
  }
};

export default Modal;

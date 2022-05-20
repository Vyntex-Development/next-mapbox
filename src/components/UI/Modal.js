import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import classes from "./Modal.module.css";

const Modal = ({ show, onClose, children, title }) => {
  console.log(show);
  const [isBrowser, setIsBrowser] = useState(false);
  const modalWrapperRef = useRef();

  const backDropHandler = (e) => {
    if (!modalWrapperRef?.current?.contains(e.target) && !e.target.id) {
      onClose();
    }
  };

  useEffect(() => {
    window.ethereum?.on("accountsChanged", (accounts) => {
      if (!accounts.length) {
        onClose();
      }
    });
    setIsBrowser(true);
    window.addEventListener("click", backDropHandler);
    return () => window.removeEventListener("click", backDropHandler);
  }, []);

  const modalContent = show ? (
    <div className={classes.modalOverlay}>
      <div className={classes.modalWrapper} ref={modalWrapperRef}>
        <div className={classes.modal}>
          <div className={classes.header}>{title && <h3>{title}</h3>}</div>

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

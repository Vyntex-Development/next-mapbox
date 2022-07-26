import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import classes from "./SuccessNotificationBar.module.css";

const SuccessNotificationBar = ({ children, verified }) => {
  const [domReady, setDomReady] = useState(false);
  //   const [show, setShow] = useState(false);
  console.log(domReady);
  console.log(verified);

  useEffect(() => {
    setDomReady(true);
  }, []);

  //   useEffect(() => {
  //     setShow(true);
  //   }, [verified]);

  const notificationBarContent = verified ? (
    <section className={`${classes.NotificationBar} ${classes.Open}`}>
      {children}
    </section>
  ) : null;

  if (domReady) {
    return ReactDOM.createPortal(
      notificationBarContent,
      document.getElementById("notifications")
    );
  } else {
    return null;
  }
};

export default SuccessNotificationBar;

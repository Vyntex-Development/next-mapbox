import classes from "./Button.module.css";

const Button = ({ children, type, onClick, id }) => {
  let className;

  if (type === "blue") {
    className = classes.blue;
  }

  if (type === "transparent") {
    className = classes.transparent;
  }

  if (type === "metamask") {
    className = classes.metamask;
  }

  if (type === "disabled") {
    className = classes.disabled;
  }

  if (type === "disabled-submit") {
    className = classes.disabledSubmit;
  }

  if (type === "white") {
    className = classes.white;
  }

  if (type === "yellow") {
    className = classes.yellow;
  }

  if (type === "submit") {
    className = classes.submit;
  }

  return (
    <button
      type={type === "submit" ? "submit" : "button"}
      onClick={onClick}
      id={id}
      className={className}
    >
      {children}
    </button>
  );
};

export default Button;

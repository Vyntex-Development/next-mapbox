import classes from "./Button.module.css";

const Button = ({ children, type, onClick, id }) => {
  let className;

  if (type === "blue") {
    className = classes.blue;
  }

  if (type === "transparent") {
    className = classes.transparent;
  }

  if (type === "disabled") {
    className = classes.disabled;
  }

  return (
    <button onClick={onClick} id={id} className={className}>
      {children}
    </button>
  );
};

export default Button;

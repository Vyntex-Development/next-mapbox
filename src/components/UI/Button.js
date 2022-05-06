import classes from "./Button.module.css";

const Button = ({ children, type, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={type === "blue" ? classes.blue : classes.transparent}
    >
      {children}
    </button>
  );
};

export default Button;

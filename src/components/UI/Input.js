import classes from "./Input.module.css";

const Input = (props) => {
  const { inputConfig } = props.config;
  const { name, inputType, errorMsg, value } = inputConfig;

  return (
    <div className={classes.InputWrapper}>
      <label htmlFor={inputConfig.name}>{inputConfig.labelName}</label>
      <input
        id={name}
        name={name}
        type={inputType}
        onChange={(ev) => props.onChange(ev, name)}
        value={value}
        placeholder={name === "email" ? "ex. name@example.com " : ""}
      />
      <p>{errorMsg}</p>
    </div>
  );
};

export default Input;

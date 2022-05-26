import classes from "./Input.module.css";

const Input = (props) => {
  const { inputConfig } = props.config;
  const { name, inputType, errorMsg, value, placeHolder, description } =
    inputConfig;

  return (
    <div className={classes.InputWrapper}>
      <p>{description}</p>
      <input
        id={name}
        name={name}
        type={inputType}
        onChange={(ev) => props.onChange(ev, name)}
        value={value}
        placeholder={placeHolder}
      />
      <span>{errorMsg}</span>
    </div>
  );
};

export default Input;

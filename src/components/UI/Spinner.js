import classes from "./Spinner.module.css";

const Spinner = () => {
  return (
    <div className={classes.spinnerWrapper}>
      <div className={classes["lds-roller"]}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Spinner;

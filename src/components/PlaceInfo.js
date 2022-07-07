import classes from "./PlaceInfo.module.css";

const PlaceInfo = ({ description, value }) => {
  return (
    <div className={classes.descriptionWrapper}>
      <span className={classes.description}>{description}</span>
      <span className={classes.descriptionValue}>{value}</span>
    </div>
  );
};

export default PlaceInfo;

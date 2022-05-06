import Autocomplete from "../components/Autocomplete";
import classes from "./HomePage.module.css";

const HomePage = () => {
  return (
    <div className="main-container">
      <div className={classes.homePage}>
        <h1>
          DISCOVER THE NEAREST
          <br /> DAO COMMUNITIES
        </h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <Autocomplete />
        <div className="map-image"></div>
      </div>
    </div>
  );
};

export default HomePage;

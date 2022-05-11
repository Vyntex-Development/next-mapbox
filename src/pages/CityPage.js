import CustomMap from "../components/CustomMap";
import { useState, useEffect } from "react";
import classes from "./CityPage.module.css";
import Button from "../components/UI/Button";
import LinkButton from "../components/UI/Link";
import FavouriteIcon from "../assets/images/FavouriteIcon";

const CityPage = ({ cityDetails, countryDetails }) => {
  console.log(cityDetails);
  const [isInitial, setIsInitial] = useState(false);

  useEffect(() => {
    setIsInitial(true);
  }, []);

  return (
    <div className={classes.cityPageWrapper}>
      <div>
        <h1>{cityDetails?.fields["city"] || ""}</h1>
        <Button type="blue">
          <FavouriteIcon />
          ADD TO FAVORITE
        </Button>
        <div className={classes.countryDetails}>
          <div className={classes.row}>
            <div className={classes.descriptionWrapper}>
              <span className={classes.description}>Country:</span>
              <span className={classes.descriptionValue}>
                <LinkButton href={`/${countryDetails.id}`} type="cities-link">
                  {countryDetails.fields["Name"]}
                </LinkButton>
              </span>
            </div>
            <div className={classes.descriptionWrapper}>
              <span className={classes.description}>ISO Alpha-2:</span>
              <span className={classes.descriptionValue}>
                {cityDetails?.fields["iso2"] || ""}
              </span>
            </div>
            <div className={classes.descriptionWrapper}>
              <span className={classes.description}>ISO Alpha-3:</span>
              <span className={classes.descriptionValue}>
                {cityDetails?.fields["iso3"] || ""}
              </span>
            </div>
          </div>
          <div className={classes.row}>
            <div className={classes.descriptionWrapper}>
              <span className={classes.description}>Population:</span>
              <span className={classes.descriptionValue}>
                {cityDetails?.fields["population"] || ""}
              </span>
            </div>
            <div className={classes.descriptionWrapper}>
              <span className={classes.description}>Admin:</span>
              <span className={classes.descriptionValue}>
                {cityDetails?.fields["admin_name"] || ""}
              </span>
            </div>
            <div className={classes.descriptionWrapper}>
              <span className={classes.description}>ID:</span>
              <span className={classes.descriptionValue}>
                {cityDetails?.id || ""}
              </span>
            </div>
          </div>
        </div>
      </div>
      {isInitial && (
        <CustomMap
          zoom={12}
          height="480"
          coordinates={{
            lng: cityDetails.fields.lng,
            lat: cityDetails.fields.lat,
          }}
        />
      )}
    </div>
  );
};

export default CityPage;

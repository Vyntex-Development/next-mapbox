import CustomMap from "../components/CustomMap";
import { useState, useEffect, useContext } from "react";
import classes from "./CityPage.module.css";
import Button from "../components/UI/Button";
import LinkButton from "../components/UI/Link";
import FavouriteIcon from "../assets/images/FavouriteIcon";
import AuthContext from "../../context-store/auth-context";
import { getUserId } from "../utils/utils";

const CityPage = ({ cityDetails, countryDetails }) => {
  const [isInitial, setIsInitial] = useState(false);
  const [text, setText] = useState("");
  const { user, isAuth, favourites, updateFavorite } = useContext(AuthContext);
  useEffect(() => {
    setIsInitial(true);
  }, []);

  useEffect(() => {
    if (!cityIsInFavorites()) {
      setText("ADD TO FAVORITES");
      return;
    }
    setText("REMOVE FROM FAVORITES");
  }, []);

  const cityIsInFavorites = () => {
    return favourites.some(
      (favorite) => favorite.city_name === cityDetails?.fields["city"]
    );
  };

  const favoritesHandler = () => {
    if (cityIsInFavorites()) {
      let data = {
        city_name: cityDetails?.fields["city"],
        user_id: getUserId(),
      };
      updateFavorite("remove", "/api/favorites/removeFavorite", data, "POST");
      setText("ADD TO FAVORITES");
      return;
    }

    let data = {
      city_name: cityDetails?.fields["city"],
      url: `${countryDetails.id}/${cityDetails?.id}`,
      user_id: getUserId(),
    };
    setText("REMOVE FROM FAVORITES");
    updateFavorite("add", "/api/favorites/favorite", data, "POST");
  };

  return (
    <div className={classes.cityPageWrapper}>
      <div>
        <h1>{cityDetails?.fields["city"] || ""}</h1>

        {isAuth && (
          <Button type="blue" onClick={favoritesHandler}>
            <FavouriteIcon />
            {text}
          </Button>
        )}

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

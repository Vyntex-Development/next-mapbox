import CustomMap from "../components/CustomMap";
import { useState, useEffect, useContext } from "react";
import classes from "./CityPage.module.css";
import Button from "../components/UI/Button";
import LinkButton from "../components/UI/Link";
import FavouriteIcon from "../assets/images/FavouriteIcon";
import AuthContext from "../../context-store/auth-context";
import { getFavorites, getAllFavorites, removeFavorite } from "../utils/utils";

const CityPage = ({ cityDetails, countryDetails }) => {
  const [isInitial, setIsInitial] = useState(false);
  const [allFavorites, setAllFavorites] = useState([]);
  const [update, setUpdate] = useState(false);

  const { user, isAuth } = useContext(AuthContext);
  useEffect(() => {
    setIsInitial(true);
  }, []);

  const addToFavourites = async () => {
    if (!isAuth) return;
    let data = {
      city_name: cityDetails?.fields["city"],
      url: `${countryDetails.id}/${cityDetails?.id}`,
      user_id: user?.id,
    };
    setUpdate(true);
    await getFavorites("/api/favorites/favorite", data, "POST");
  };

  const removeFromFavoritesHandler = async () => {
    if (!isAuth) return;
    setUpdate(true);
    await removeFavorite(
      "/api/favorites/removeFavorite",
      { city_name: cityDetails?.fields["city"], user_id: user?.id },
      "POST"
    );
  };

  useEffect(() => {
    const getAll = async () => {
      if (!isAuth) return;
      const { favorites } = await getAllFavorites(
        `/api/favorites/getAllFavorites`,
        { user_id: user?.id },
        "POST"
      );
      setAllFavorites(favorites);
    };
    getAll();
    setUpdate(false);
  }, [isAuth, update]);

  return (
    <div className={classes.cityPageWrapper}>
      <div>
        <h1>{cityDetails?.fields["city"] || ""}</h1>
        {allFavorites.some(
          (favorite) => favorite.city_name === cityDetails?.fields["city"]
        ) ? (
          <Button type="blue" onClick={removeFromFavoritesHandler}>
            <FavouriteIcon />
            REMOVE FROM FAVORITE
          </Button>
        ) : (
          <Button type="blue" onClick={addToFavourites}>
            <FavouriteIcon />
            ADD TO FAVORITE
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

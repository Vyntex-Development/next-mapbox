import CustomMap from "../components/CustomMap";
import { useState, useEffect, useContext } from "react";
import { getAllFavorites } from "../utils/utils";
import classes from "./CityPage.module.css";
import Button from "../components/UI/Button";
import LinkButton from "../components/UI/Link";
import FavouriteIcon from "../assets/images/FavouriteIcon";
import AuthContext from "../../context-store/auth-context";
import FavoritesContext from "../../context-store/favorites-context";
import jwt from "jsonwebtoken";

const CityPage = ({ cityDetails, countryDetails }) => {
  const [isInitial, setIsInitial] = useState(false);
  const [text, setText] = useState("");
  const { favorites, allFavorites, updateFavorites, userId } =
    useContext(FavoritesContext);
  const { isAuth } = useContext(AuthContext);
  useEffect(() => {
    setIsInitial(true);
  }, []);

  const cityIsInFavorites = async () => {
    const jwtToken = JSON.parse(localStorage.getItem("token"));
    const { user_metadata } = jwt.decode(jwtToken);
    const { favorites } = await getAllFavorites(
      `/api/favorites/getAllFavorites`,
      { user_id: user_metadata.user.id },
      "POST"
    );

    return favorites.some(
      (favorite) => favorite.place === cityDetails?.fields["city"]
    );
  };

  useEffect(() => {
    if (userId) {
      const updateFavorites = async () => {
        if (!(await cityIsInFavorites())) {
          setText("ADD TO FAVORITES");
          return;
        }
        setText("REMOVE FROM FAVORITES");
      };

      updateFavorites();
    }
  }, [userId]);

  const favoritesHandler = async () => {
    if (await cityIsInFavorites()) {
      let data = {
        place: cityDetails?.fields["city"],
        user_id: userId,
      };
      updateFavorites("remove", "/api/favorites/removeFavorite", data, "POST");
      setText("ADD TO FAVORITES");
      return;
    }

    let data = {
      place: cityDetails?.fields["city"],
      url: `${countryDetails.id}/${cityDetails?.id}`,
      user_id: userId,
    };
    setText("REMOVE FROM FAVORITES");
    updateFavorites("add", "/api/favorites/favorite", data, "POST");
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

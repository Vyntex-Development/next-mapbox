import CustomMap from "../components/CustomMap";
import { useState, useEffect, useContext } from "react";
import { getDestinationCoordinates } from "../utils/utils";
import classes from "./CityPage.module.css";
import Button from "../components/UI/Button";
import LinkButton from "../components/UI/Link";
import FavouriteIcon from "../assets/images/FavouriteIcon";
import AuthContext from "../../context-store/auth-context";
import FavoritesContext from "../../context-store/favorites-context";
import PlaceInfo from "../components/PlaceInfo";
import useDeploy from "../hooks/useDeploy";

const CityPage = ({ cityDetails, countryDetails }) => {
  console.log(cityDetails);
  const [isInitial, setIsInitial] = useState(false);
  const [text, setText] = useState("");
  const [coordinates, setCoordinates] = useState({});
  const { allFavorites, updateFavorites, userId } =
    useContext(FavoritesContext);
  const { isAuth, user } = useContext(AuthContext);
  const { userCandDeploy } = useDeploy(user, countryDetails, "cityID");
  useEffect(() => {
    setIsInitial(true);
    let cityName = cityDetails.fields["city"].toLowerCase();
    const getCoordinates = async () => {
      let coordinates = await getDestinationCoordinates(cityName);
      setCoordinates({
        lat: coordinates[1],
        lng: coordinates[0],
      });
    };
    getCoordinates();
  }, []);

  const cityIsInFavorites = () => {
    return allFavorites.some(
      (favorite) => favorite.place === cityDetails?.fields["city"]
    );
  };

  useEffect(() => {
    if (userId) {
      if (!cityIsInFavorites()) {
        setText("ADD TO FAVORITES");
        return;
      }
      setText("REMOVE FROM FAVORITES");
    }
  }, [userId]);

  const favoritesHandler = () => {
    if (cityIsInFavorites()) {
      updateFavorites(
        "remove",
        "/api/favorites/removeFavorite",
        { place: cityDetails?.fields["city"], user_id: userId },
        "POST"
      );
      setText("ADD TO FAVORITES");
      return;
    }

    setText("REMOVE FROM FAVORITES");
    updateFavorites(
      "add",
      "/api/favorites/favorite",
      {
        place: cityDetails?.fields["city"],
        url: `${countryDetails.id}/${cityDetails?.id}`,
        user_id: userId,
      },
      "POST"
    );
  };

  return (
    <div className={classes.cityPageWrapper}>
      <div>
        <h1>{cityDetails?.fields["city"] || ""}</h1>

        {isAuth && (
          <Button
            type={`${userCandDeploy ? "disabled" : "blue"}`}
            onClick={favoritesHandler}
          >
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
            <PlaceInfo
              description="ISO Alpha-2:"
              value={cityDetails?.fields["iso2"] || ""}
            />
            <PlaceInfo
              description="ISO Alpha-3:"
              value={cityDetails?.fields["iso3"] || ""}
            />
          </div>
          <div className={classes.row}>
            <PlaceInfo
              description="Population:"
              value={cityDetails?.fields["population"] || ""}
            />
            <PlaceInfo
              description="Admin:"
              value={cityDetails?.fields["admin_name"] || ""}
            />
            <PlaceInfo description="ID:" value={cityDetails?.id || ""} />
          </div>
        </div>
      </div>
      {isInitial && (
        <CustomMap zoom={12} height="480" coordinates={coordinates} />
      )}
    </div>
  );
};

export default CityPage;

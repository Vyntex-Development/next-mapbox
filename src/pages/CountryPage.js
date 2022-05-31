import { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/router";
import { getCountryCoordinates } from "../utils/utils";
import classes from "./CountryPage.module.css";
import Button from "../components/UI/Button";
import LinkButton from "../components/UI/Link";
import DiscordIcon from "../assets/images/DiscordIcon";
import TwitterIcon from "../assets/images/TwitterIcon";
import TelegramIcon from "../assets/images/TelegramIcon";
import Image from "next/image";
import FavouriteIcon from "../assets/images/FavouriteIcon";
import CustomMap from "../components/CustomMap";
import AuthContext from "../../context-store/auth-context";
import FavoritesContext from "../../context-store/favorites-context";

const CountryPage = ({ countryDetails, listOfCities }) => {
  const [isInitial, setIsInitial] = useState(false);
  const [containerHeight, setContainerHeight] = useState({});
  const [coordinates, setCoordinates] = useState({});
  const [text, setText] = useState("");
  const { allFavorites, updateFavorites, userId } =
    useContext(FavoritesContext);
  const countryRef = useRef();
  const router = useRouter();
  const { isAuth } = useContext(AuthContext);

  const countryIsInFavorites = () => {
    return allFavorites.some(
      (favorite) => favorite.place === countryDetails.fields["Name"]
    );
  };

  useEffect(() => {
    if (userId) {
      if (!countryIsInFavorites()) {
        setText("ADD TO FAVORITES");
        return;
      }
      setText("REMOVE FROM FAVORITES");
    }
  }, [userId]);

  const favoritesHandler = () => {
    console.log(countryIsInFavorites());
    if (countryIsInFavorites()) {
      let data = {
        place: countryDetails.fields["Name"],
        user_id: userId,
      };
      updateFavorites("remove", "/api/favorites/removeFavorite", data, "POST");
      setText("ADD TO FAVORITES");
      return;
    }

    let data = {
      place: countryDetails.fields["Name"],
      url: `${countryDetails.id}`,
      user_id: userId,
    };
    setText("REMOVE FROM FAVORITES");
    updateFavorites("add", "/api/favorites/favorite", data, "POST");
  };

  useEffect(() => {
    setIsInitial(true);
    setContainerHeight(countryRef.current.clientHeight);
    let countryName = countryDetails.fields["Name"].split(" ")[0].toLowerCase();
    const getCoordinates = async () => {
      let coordinates = await getCountryCoordinates(countryName);
      setCoordinates({
        lat: coordinates[1],
        lng: coordinates[0],
      });
    };
    getCoordinates();
  }, []);

  return (
    <div className={classes.countryPageWrapper}>
      <div ref={countryRef}>
        <h1>{countryDetails.fields["Name"]}</h1>
        {isAuth && (
          <Button type="blue" onClick={favoritesHandler}>
            <FavouriteIcon />
            {text}
          </Button>
        )}
        <div className={classes.countryDetails}>
          <div className={classes.row}>
            <div className={classes.descriptionWrapper}>
              <span className={classes.description}>Flag:</span>
              <span
                className={classes.descriptionValue}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {countryDetails.fields["Flag"] && (
                  <Image
                    src={countryDetails.fields["Flag"]}
                    width="25"
                    height="16"
                    alt="flag"
                  />
                )}
              </span>
            </div>
            <div className={classes.descriptionWrapper}>
              <span className={classes.description}>Capital City:</span>
              <span className={classes.descriptionValue}>
                {countryDetails.fields["Capital City"]}
              </span>
            </div>
            <div className={classes.descriptionWrapper}>
              <span className={classes.description}>GDP ($ Billion):</span>
              <span className={classes.descriptionValue}>
                {countryDetails.fields["GDP ($ Billion)"]}
              </span>
            </div>
            <div className={classes.descriptionWrapper}>
              <span className={classes.description}>GDP/Capita:</span>
              <span className={classes.descriptionValue}>
                {countryDetails.fields["GDP/Capita"]}
              </span>
            </div>
          </div>
          <div className={classes.row}>
            <div className={classes.descriptionWrapper}>
              <span className={classes.description}>
                Population (Millions):
              </span>
              <span className={classes.descriptionValue}>
                {countryDetails.fields["Population"]}
              </span>
            </div>
            <div className={classes.descriptionWrapper}>
              <span className={classes.description}>ISO Alpha-2:</span>
              <span className={classes.descriptionValue}>
                {countryDetails.fields["ISO Alpha-2"]}
              </span>
            </div>
            <div className={classes.descriptionWrapper}>
              <span className={classes.description}>ISO Alpha-3:</span>
              <span className={classes.descriptionValue}>
                {countryDetails.fields["ISO Alpha-3"]}
              </span>
            </div>
            <div className={classes.descriptionWrapper}>
              <span className={classes.description}>Dialing Code:</span>
              <span className={classes.descriptionValue}>
                {countryDetails.fields["Dialing Code"]}
              </span>
            </div>
          </div>
        </div>
        <div className={classes.linksWrapper}>
          <div className={classes.socialLinks}>
            <h2>JOIN THE COMMUNITY</h2>
            <div>
              {countryDetails.fields["Twitter"] && (
                <a
                  className={classes.comunityLink}
                  href={`https://${countryDetails.fields["Twitter"]}`}
                >
                  <TwitterIcon />
                  Twitter
                </a>
              )}
              {countryDetails.fields["Discord"] && (
                <a
                  className={classes.comunityLink}
                  href={`https://${countryDetails.fields["Discord"]}`}
                >
                  <DiscordIcon />
                  Discord
                </a>
              )}
              {countryDetails.fields["Telegram"] && (
                <a
                  className={classes.comunityLink}
                  href={`https://${countryDetails.fields["Telegram"]}`}
                >
                  <TelegramIcon />
                  Telegram
                </a>
              )}
            </div>
          </div>
          <div className={classes.cityLinks}>
            <h2>CITIES</h2>
            <div>
              {listOfCities &&
                listOfCities.map((city, index) => {
                  return (
                    <LinkButton
                      key={index}
                      href={`/${router.query.countryID}/${city?.id}`}
                      type="cities-link"
                    >
                      {city?.fields?.city || city?.fields?.city_ascii}
                    </LinkButton>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      {isInitial && (
        <CustomMap
          height={containerHeight}
          coordinates={coordinates}
          zoom={6}
        />
      )}
    </div>
  );
};

export default CountryPage;

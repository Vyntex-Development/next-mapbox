import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useEffect, useRef } from "react";
import classes from "./CountryPage.module.css";
import Button from "../components/UI/Button";
import LinkButton from "../components/UI/Link";
import DiscordIcon from "../assets/images/DiscordIcon";
import TwitterIcon from "../assets/images/TwitterIcon";
import TelegramIcon from "../assets/images/TelegramIcon";
import Image from "next/image";

const CountryPage = ({ countryDetails, cityDetails }) => {
  const [isInitial, setIsInitial] = useState(false);
  const [coordinates, setCoordinates] = useState({});
  const [containerHeight, setContainerHeight] = useState({});

  const countryRef = useRef();

  useEffect(() => {
    setIsInitial(true);
    setCoordinates(JSON.parse(localStorage.getItem("place")));
    setContainerHeight(countryRef.current.clientHeight);
    console.log(countryRef.current.clientHeight);
  }, []);

  return (
    <div className={classes.countryPageWrapper}>
      <div ref={countryRef}>
        <h1>{countryDetails.fields["Name"]}</h1>
        <Button type="blue">
          <svg
            width="1.25rem"
            height="1.125rem"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.94668e-08 5.40093C-0.000248434 3.95126 0.582385 2.56238 1.61681 1.54676C2.65124 0.531135 4.05058 -0.0259184 5.5 0.000927231C7.21732 -0.00819277 8.85599 0.720102 10 2.00093C11.144 0.720102 12.7827 -0.00819277 14.5 0.000927231C15.9494 -0.0259184 17.3488 0.531135 18.3832 1.54676C19.4176 2.56238 20.0002 3.95126 20 5.40093C20 10.7569 13.621 14.8009 10 18.0009C6.387 14.7739 7.94668e-08 10.7609 7.94668e-08 5.40093Z"
              fill="white"
            />
          </svg>
          ADD TO FAVORITE
        </Button>
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
                <Image
                  src={countryDetails.fields["Flag"]}
                  width="25"
                  height="16"
                />
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
                  target="_blank"
                  rel="noreferrer"
                  className={classes.comunityLink}
                  href={`https://${countryDetails.fields["Twitter"]}`}
                >
                  <TwitterIcon />
                  Twitter
                </a>
              )}
              {countryDetails.fields["Discord"] && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  className={classes.comunityLink}
                  href={`https://${countryDetails.fields["Discord"]}`}
                >
                  <DiscordIcon />
                  Discord
                </a>
              )}
              {countryDetails.fields["Telegram"] && (
                <a
                  target="_blank"
                  rel="noreferrer"
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
              {cityDetails.map((city, index) => {
                console.log(city);
                return (
                  <LinkButton key={index} href="/" type="cities-link">
                    {city.fields.city_ascii}
                  </LinkButton>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          height: `${containerHeight}px`,
          width: "100%",
          maxWidth: "34rem",
          overflow: "hidden",
          borderRadius: "1rem",
          position: "relative",
        }}
      >
        {isInitial && (
          <Map
            initialViewState={{
              longitude: coordinates.lng,
              latitude: coordinates.lat,
              zoom: 6,
            }}
            style={{ width: 600, height: 400 }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken="pk.eyJ1IjoiYWRhbW92aWM2NjY2IiwiYSI6ImNsMHdpY3E4YTB2YmUzanBlcDhqdWd6YnoifQ.Ig2Am8BZiQE9tDlM_vC8-g"
          />
        )}
      </div>
    </div>
  );
};

export default CountryPage;

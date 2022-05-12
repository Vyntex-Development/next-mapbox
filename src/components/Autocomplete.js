const MAPBOX_TOKEN_LOCAL = process.env.MAPBOX_TOKEN_LOCAL;
const MAPBOX_TOKEN_PRODUCTION = process.env.MAPBOX_TOKEN_PRODUCTION;
const AIRTABLE_ACCESS_KEY = process.env.AIRTABLE_ACCESS_KEY;
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import classes from "./Autocomplete.module.css";
import Button from "./UI/Button";
import Spinner from "./UI/Spinner";
import { capitalizeFirstLetter } from "../utils/utils";
import { getMapboxSearchResults } from "../utils/utils";
import { getCountrID } from "../utils/utils";
import { getSingleDestiantion } from "../utils/utils";

const Autocomplete = () => {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [airtableData, setAirtableData] = useState(null);
  const [results, setResults] = useState([]);
  const [place, setPlace] = useState(null);
  const [error, setError] = useState(false);
  const [isVisible, setIsVisble] = useState(false);
  const [searchResult, setSearchResult] = useState(false);
  const [timer, setTimer] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (searchResult) {
      if (airtableData.length === 2) {
        setError(true);
        return;
      }
      place.place_type[0] === "country"
        ? router.push(`/${airtableData.records[0].id}`)
        : router.push(
            `${
              airtableData[1].id
            }/${airtableData[0].records[0].fields.city_ascii
              .replace("`", "")
              .toLowerCase()
              .split(" ")
              .join("-")}&lat=${airtableData[0].records[0].fields.lat}&lng=${
              airtableData[0].records[0].fields.lng
            }`
          );
      setSearchResult(false);
    }
    setError(false);

    setSearchResult(false);
  }, [searchResult]);

  //   const handleSearchChangeHandler = (searchValue) => {};
  const destinationChangeHadler = (e) => {
    setSearch(capitalizeFirstLetter(e.target.value));
    if (e.target.value.trim() === "") {
      setIsVisble(false);
      return;
    }

    setError(false);
    // Stop the previous setTimeout if there is one in progress
    clearTimeout(timer);

    // Launch a new request in 1000ms
    let timeoutId = setTimeout(() => {
      performMapboxSearch();
    }, 1000);
    setTimer(timeoutId);
  };

  const performMapboxSearch = async () => {
    if (search === "") {
      setResults([]);
      return;
    }

    const features = await getMapboxSearchResults(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?types=country&types=place&access_token=${MAPBOX_TOKEN_PRODUCTION}`,
      null,
      "GET"
    );
    setResults(features);
    setIsVisble(true);
    features.length === 0 && setIsVisble(false);
  };

  const handleItemClickedHandler = async (place) => {
    setSearch(place.place_name);
    setPlace(place);
    setIsVisble(false);
  };

  const searchHandler = async () => {
    let countryId;
    let searchData;
    setIsLoading(true);
    if (place.place_type[0] === "country") {
      const response = await getCountrID(
        `https://api.airtable.com/v0/appEQgGYRpKWhBUQj/Countries?api_key=${AIRTABLE_ACCESS_KEY}&filterByFormula=Name="${place.place_name} DAO"`,
        null,
        "GET"
      );
      setAirtableData(response);
      countryId = response.records[0].id;
    } else {
      let response = await getCountrID(
        `https://nearestdao.herokuapp.com`,
        {
          lng: place.geometry.coordinates[0],
          lat: place.geometry.coordinates[1],
          name: place.matching_text || place.text,
          type: place.place_type[0],
        },
        "POST"
      );
      setAirtableData(response);
      countryId = response[1]?.id;
    }

    if (results.length === 0 && search !== "") {
      searchData = {
        lng: null,
        lat: null,
        name: search,
        type: "place",
      };
    } else {
      searchData = {
        lng: place.geometry.coordinates[0],
        lat: place.geometry.coordinates[1],
        [place.place_type[0] === "country" ? "id" : "name"]:
          place.place_type[0] === "country" ? countryId : place.place_name,
        type: place.place_type[0],
      };
    }

    try {
      const response = await getSingleDestiantion(
        `https://nearestdao.herokuapp.com`,
        searchData,
        "POST"
      );
      response && setSearchResult(true);
      setIsLoading(false);
      if (results.length === 0 && search !== "") {
        setAirtableData(response);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.AutocompleteWrapper}>
      <input
        className={classes.input}
        type="text"
        value={search}
        onChange={destinationChangeHadler}
        placeholder="Search by country, region or City...
        "
      />
      <Button onClick={searchHandler} type="blue">
        SEARCH
      </Button>
      {isVisible && (
        <ul className={classes.results}>
          {results.map((place) => {
            let splittedResult = place.place_name.split(",");
            if (splittedResult.length > 1) {
              return (
                <li
                  className={classes.cities}
                  key={place.id}
                  onClick={() => handleItemClickedHandler(place)}
                >
                  <span>{splittedResult[0]}</span>
                  <span>
                    {splittedResult.filter((_, index) => index !== 0).join(",")}
                  </span>
                </li>
              );
            } else {
              return (
                <li
                  key={place.id}
                  className={classes.countries}
                  onClick={() => handleItemClickedHandler(place)}
                >
                  {place.place_name}
                </li>
              );
            }
          })}
        </ul>
      )}
      {error && (
        <span className={classes.error}>
          For this destination we dont have coresponding DAO
        </span>
      )}
      {isLoading && <Spinner />}
    </div>
  );
};

export default Autocomplete;

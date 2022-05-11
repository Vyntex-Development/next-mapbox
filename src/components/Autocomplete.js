const MAPBOX_TOKEN_LOCAL = process.env.MAPBOX_TOKEN_LOCAL;
const MAPBOX_TOKEN_PRODUCTION = process.env.MAPBOX_TOKEN_PRODUCTION;
const AIRTABLE_ACCESS_KEY = process.env.AIRTABLE_ACCESS_KEY;
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import classes from "./Autocomplete.module.css";
import { getSingleDestiantion } from "../utils/utils";
import Button from "./UI/Button";
import { capitalizeFirstLetter } from "../utils/utils";

const Autocomplete = () => {
  const [search, setSearch] = useState("");
  const [countryID, setCountryID] = useState(null);
  const [airtableData, setAirtableData] = useState(null);
  const [results, setResults] = useState([]);
  const [place, setPlace] = useState(null);
  const [error, setError] = useState(false);
  const [isVisible, setIsVisble] = useState(false);
  const [searchResult, setSearchResult] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (searchResult) {
      console.log(airtableData);
      if (airtableData.length === 2) {
        setError(true);
        return;
      }
      place.place_type[0] === "country"
        ? router.push(`/${airtableData[0].id}`)
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
      setError(false);
    }
    setSearchResult(false);
  }, [searchResult]);

  //   const handleSearchChangeHandler = (searchValue) => {};
  const handleSearchChangeHandler = (e) => {
    setSearch(capitalizeFirstLetter(e.target.value));
    if (e.target.value.trim() === "") {
      setIsVisble(false);
      return;
    }
    setIsVisble(true);
    setError(false);

    // setIsLoading(true);

    // Stop the previous setTimeout if there is one in progress
    clearTimeout(timeoutId);

    // Launch a new request in 1000ms
    let timeoutId = setTimeout(() => {
      performSearch();
    }, 1000);
  };

  const performSearch = async () => {
    if (search === "") {
      setResults([]);
      return;
    }

    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?types=country&types=place&access_token=${MAPBOX_TOKEN_PRODUCTION}`
    );
    const { features } = await response.json();
    setResults(features);
    features.length === 0 && setIsVisble(false);
  };

  const handleItemClickedHandler = async (place) => {
    if (place.place_type[0] === "country") {
      const response = await getSingleDestiantion(
        `https://api.airtable.com/v0/appEQgGYRpKWhBUQj/Countries?api_key=${AIRTABLE_ACCESS_KEY}&filterByFormula=Name="${place.place_name} DAO"`,
        null,
        "GET"
      );
      setCountryID(response.records[0].id);
      setAirtableData(response);
      setIsVisble(false);
    } else {
      let searchData = {
        lng: place.geometry.coordinates[0],
        lat: place.geometry.coordinates[1],
        name: place.matching_text || place.text,
        type: place.place_type[0],
      };
      const response = await getSingleDestiantion(
        `https://nearestdao.herokuapp.com`,
        searchData,
        "POST"
      );
      setCountryID(response[1]?.id);
      setAirtableData(response);
    }
    setSearch(place.place_name);
    setResults([]);
    setPlace(place);
  };

  const searchHandler = async () => {
    let searchData;
    if (!isVisible && search !== "") {
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
          place.place_type[0] === "country" ? countryID : place.place_name,
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
      if (results.length === 0 && search !== "") {
        setAirtableData(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes.AutocompleteWrapper}>
      <input
        className={classes.input}
        type="text"
        value={search}
        onChange={handleSearchChangeHandler}
        placeholder="Search by country, region or City...
        "
      />
      <Button onClick={searchHandler} type="blue">
        SEARCH
      </Button>
      {results.length !== 0 && isVisible && (
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
    </div>
  );
};

export default Autocomplete;

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYWRhbW92aWM2NjY2IiwiYSI6ImNsMnVlaG1hdTAxYWYzanBodWZqZXl6aGwifQ.tdvOdH7JOqVZbI5PMdzNJg";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import classes from "./Autocomplete.module.css";
import Button from "./UI/Button";

const Autocomplete = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [place, setPlace] = useState(null);
  const [isVisible, setIsVisble] = useState(false);
  const [searchResult, setSearchResult] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (searchResult) {
      router.push(`/${place.text.toLowerCase()}`);
    }
  }, [searchResult]);

  //   const handleSearchChangeHandler = (searchValue) => {};
  const handleSearchChangeHandler = (e) => {
    setSearch(e.target.value);
    if (e.target.value.trim() === "") {
      setIsVisble(false);
      return;
    }
    setIsVisble(true);

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

    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?types=country&types=place&access_token=${MAPBOX_TOKEN}`
      )
      .then((response) => {
        setResults(response.data.features);
      });
  };

  const handleItemClickedHandler = (place) => {
    setSearch(place.place_name);
    setResults([]);
    setPlace(place);
    localStorage.setItem(
      "place",
      JSON.stringify({
        lng: place.geometry.coordinates[0],
        lat: place.geometry.coordinates[1],
      })
    );
  };

  const searchHandler = async () => {
    let data = {
      lng: place.geometry.coordinates[0],
      lat: place.geometry.coordinates[1],
      name: place.place_name,
      type: place.place_type[0],
    };

    try {
      const response = await fetch(`https://nearestdao.herokuapp.com`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(response.message || "Something went wrong...");
      }
      setSearchResult(true);
      const responseData = await response.json();
      console.log(responseData);
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
          {/* {isLoading && <li className="AutocompletePlace-items">Loading...</li>} */}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;

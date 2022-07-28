import { useState } from "react";
import { capitalizeFirstLetter } from "../utils/utils";
import { getMapboxSearchResults } from "../utils/utils";
const MAPBOX_TOKEN_PRODUCTION = process.env.MAPBOX_TOKEN_PRODUCTION;

const useMapbox = (endpoint) => {
  const URL = "https://api.mapbox.com/geocoding/v5/mapbox.places/";

  const [results, setResults] = useState([]);
  const [enabled, setEnabled] = useState(false);
  const [search, setSearch] = useState("");
  const [timer, setTimer] = useState(null);
  const [isVisible, setIsVisble] = useState(false);
  const [place, setPlace] = useState(null);
  const [reset, setReset] = useState(null);
  const [destinationType, setDestinationType] = useState(null);
  const [city, setCity] = useState(null);

  const destinationChangeHadler = (e) => {
    setSearch(capitalizeFirstLetter(e.target.value));
    setReset(true);
    setPlace(null);
    if (e.target.value.trim() === "") {
      setIsVisble(false);
      setEnabled(false);
      return;
    }

    clearTimeout(timer);

    let timeoutId = setTimeout(() => {
      performMapboxSearch(e.target.value);
    }, 1000);
    setTimer(timeoutId);
  };

  const performMapboxSearch = async (value) => {
    if (search === "") {
      setResults([]);
      setEnabled(false);
      return;
    }

    const features = await getMapboxSearchResults(
      URL + value + endpoint + MAPBOX_TOKEN_PRODUCTION,
      null,
      "GET"
    );
    setResults(features);
    setIsVisble(true);
    features.length === 0 && setIsVisble(false);
  };

  const handleItemClickedHandler = async (place) => {
    setCity(place);
    setSearch(place.place_name);
    setIsVisble(false);
    setEnabled(true);
    setPlace(place);
    setDestinationType(place.place_type[0]);
  };

  const updateReset = () => {
    setReset(false);
  };

  const setMapboxSearch = () => {
    setSearch("");
  };

  return {
    destinationChangeHadler,
    handleItemClickedHandler,
    updateReset,
    setMapboxSearch,
    results,
    enabled,
    search,
    isVisible,
    place,
    reset,
    destinationType,
    city,
  };
};

export default useMapbox;

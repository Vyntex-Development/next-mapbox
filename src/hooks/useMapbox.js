import { useState } from "react";
import { capitalizeFirstLetter } from "../utils/utils";
import { getMapboxSearchResults } from "../utils/utils";
const MAPBOX_TOKEN_PRODUCTION = process.env.MAPBOX_TOKEN_PRODUCTION;

const useMapbox = () => {
  const [results, setResults] = useState([]);
  const [enabled, setEnabled] = useState(false);
  const [search, setSearch] = useState("");
  const [timer, setTimer] = useState(null);
  const [isVisible, setIsVisble] = useState(false);
  const [place, setPlace] = useState(null);
  const [reset, setReset] = useState(null);

  const destinationChangeHadler = (e) => {
    setSearch(capitalizeFirstLetter(e.target.value));
    setReset(true);
    setPlace(null);
    // setSearch("");
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
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?types=country&types=place&access_token=${MAPBOX_TOKEN_PRODUCTION}`,
      null,
      "GET"
    );
    setResults(features);
    setIsVisble(true);
    features.length === 0 && setIsVisble(false);
  };

  const handleItemClickedHandler = async (place) => {
    setSearch(place.place_name);
    setIsVisble(false);
    setEnabled(true);
    setPlace(place);
    // setReset(false);
    // setChosen(true)
  };

  const updateReset = () => {
    setReset(false);
  };

  return {
    destinationChangeHadler,
    handleItemClickedHandler,
    updateReset,
    results,
    enabled,
    search,
    isVisible,
    place,
    reset,
    // chosen,
  };
};

export default useMapbox;

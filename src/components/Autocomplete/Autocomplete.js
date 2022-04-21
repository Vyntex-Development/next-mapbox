const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYWRhbW92aWM2NjY2IiwiYSI6ImNsMjkxbmJvZzBmMTUzbnQzYXdwdnB3OHYifQ.LTT2pJ0amuVHLeDB1yjHDQ";
import { useState } from "react";
import axios from "axios";

const Autocomplete = ({ onSelect }) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //   const handleSearchChangeHandler = (searchValue) => {};
  const handleSearchChangeHandler = (e) => {
    setSearch(e.target.value);
    setIsLoading(true);

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
      setIsLoading(false);
      return;
    }

    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?types=country&types=place&access_token=${MAPBOX_TOKEN}`
      )
      .then((response) => {
        setResults(response.data.features);
        setIsLoading(false);
      });
  };

  const handleItemClickedHandler = (place) => {
    setSearch(place.place_name);
    setResults([]);
    onSelect(place);
  };

  return (
    <div className="AutocompletePlace">
      <input
        className="AutocompletePlace-input"
        type="text"
        value={search}
        onChange={handleSearchChangeHandler}
        placeholder="Type an address"
      />
      <ul className="AutocompletePlace-results">
        {results.map((place) => (
          <li
            key={place.id}
            className="AutocompletePlace-items"
            onClick={() => handleItemClickedHandler(place)}
          >
            {place.place_name}
          </li>
        ))}
        {isLoading && <li className="AutocompletePlace-items">Loading...</li>}
      </ul>
    </div>
  );
};

export default Autocomplete;

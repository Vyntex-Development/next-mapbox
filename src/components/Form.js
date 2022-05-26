const MAPBOX_TOKEN_PRODUCTION = process.env.MAPBOX_TOKEN_PRODUCTION;
import useForm from "../hooks/useForm";
import Input from "../components/UI/Input";
import classes from "./Form.module.css";
import { useState, useEffect, useRef } from "react";
import Button from "./UI/Button";
import { capitalizeFirstLetter, getMapboxSearchResults } from "../utils/utils";

const Form = ({ searchValue, formConfig: config, loading, children }) => {
  const [search, setSearch] = useState(searchValue);
  const [enabled, setEnabled] = useState(false);
  const [isVisible, setIsVisble] = useState(false);
  const [timer, setTimer] = useState(null);
  const [results, setResults] = useState([]);
  const [place, setPlace] = useState(null);

  let content;

  const {
    onChangeHandler,
    data,
    formConfig,
    validateInputFields,
    formIsValid,
  } = useForm(config);

  const formRef = useRef();

  useEffect(() => {
    setEnabled(true);
  }, []);

  const destinationChangeHadler = (e) => {
    setSearch(capitalizeFirstLetter(e.target.value));
    if (e.target.value.trim() === "") {
      setIsVisble(false);
      setEnabled(false);

      return;
    }
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
      setEnabled(false);
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
    setEnabled(true);
  };

  const submitFormHandler = (ev) => {
    ev.preventDefault();
    validateInputFields();
    if (!formIsValid()) return;
    props.onSubmit(data);
  };

  const searchHandler = async () => {
    let countryId;
    let searchData;
    setIsLoading(true);
    if (place) {
      if (place.place_type[0] === "country") {
        const response = await getCountrID(
          `https://api.airtable.com/v0/appEQgGYRpKWhBUQj/Countries?api_key=${AIRTABLE_ACCESS_KEY}&filterByFormula=Name="${place.place_name} DAO"`,
          null,
          "GET"
        );
        setAirtableData(response);
        if (response.records.length === 0) {
          setIsLoading(false);
          return;
        }
        countryId = response.records[0].id;
        if (!countryId) {
          setIsLoading(false);
          return;
        }
      } else {
        let response = await getCountrID(
          `https://nearestdao.herokuapp.com`,
          {
            name: place.text,
            type: place.place_type[0],
          },
          "POST"
        );
        setAirtableData(response);
        countryId = response[1]?.id;
      }
    }

    console.log(place);

    if (results.length === 0 && search !== "") {
      searchData = {
        name: search,
        type: "place",
      };
    } else {
      searchData = {
        [place.place_type[0] === "country" ? "id" : "name"]:
          place.place_type[0] === "country" ? countryId : place.text,

        // : place.matching_text || place.text,
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

  if (loading) {
    content = <p>Loading....</p>;
  } else {
    content = (
      <div>
        <form onSubmit={submitFormHandler} ref={formRef} noValidate>
          <div className="wrapper">
            <h2>Deploy DAO!</h2>
            <p>
              Sumbit your DAO’s address below. You can only deploy a DAO in your
              local area.
            </p>
            <div className={classes.AutocompleteWrapper}>
              <input
                className={classes.input}
                type="text"
                value={search}
                onChange={destinationChangeHadler}
                placeholder="Address"
                id="input"
              />
              <Button
                onClick={searchHandler}
                type={enabled ? "blue" : "disabled"}
                id="submit"
              >
                SUBMIT
              </Button>
              {isVisible && (
                <ul className={classes.results} id="list">
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
                            {splittedResult
                              .filter((_, index) => index !== 0)
                              .join(",")}
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
            </div>
          </div>
          {/* {formConfig.map((c) => {
            return <Input key={c.id} config={c} onChange={onChangeHandler} />;
          })} */}
          {children}
        </form>
      </div>
    );
  }

  return content;
};

export default Form;

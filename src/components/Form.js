const MAPBOX_TOKEN_PRODUCTION = process.env.MAPBOX_TOKEN_PRODUCTION;
import useForm from "../hooks/useForm";
import Input from "../components/UI/Input";
import classes from "./Form.module.css";
import { useState, useEffect, useRef, useContext } from "react";
import AuthContext from "../../context-store/auth-context";
import Button from "./UI/Button";
import { capitalizeFirstLetter, getMapboxSearchResults } from "../utils/utils";

const Form = ({
  searchValue,
  formConfig: config,
  loading,
  children,
  close,
}) => {
  const [search, setSearch] = useState(searchValue);
  const [enabled, setEnabled] = useState(false);
  const [isVisible, setIsVisble] = useState(false);
  const [timer, setTimer] = useState(null);
  const [results, setResults] = useState([]);
  const [place, setPlace] = useState(null);
  const [error, setError] = useState(false);
  const [deploymentStage, setDeploymentStage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);

  let content;

  let { onChangeHandler, data, formConfig, validateInputFields, formIsValid } =
    useForm(config);

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
    close();
    //   if (!formIsValid()) return;
    //   props.onSubmit(data);
  };

  const splittedArray = (arr) => {
    const splittedArray = arr.split(",");
    return splittedArray[splittedArray.length - 1];
  };

  const submitHandler = async () => {
    const deplymentCountry = splittedArray(search);
    const userCountry = splittedArray(user?.address);
    if (deplymentCountry !== userCountry) {
      setError(true);
      return;
    }
    setError(false);
    setDeploymentStage(1);
  };

  if (isLoading) {
    content = <p>Loading....</p>;
  } else {
    content = (
      <div>
        <form onSubmit={submitFormHandler} ref={formRef} noValidate>
          {deploymentStage === 0 && (
            <div className="wrapper">
              <h2>Deploy DAO!</h2>
              <p>
                Sumbit your DAO’s address below. You can only deploy a DAO in
                your local area.
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
                  onClick={submitHandler}
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
              {error && (
                <div className={classes.importantNote}>
                  The local DAO your are trying to deploy is not in your local
                  area. Please try again.
                </div>
              )}
            </div>
          )}

          {deploymentStage === 1 && (
            <div className="wrapper">
              <h2>DAO Details!</h2>
              <p>
                Sumbit your DAO’s details below. At least one of the following
                fields must be set.
              </p>
              <div className={`wrapper ${classes.detailsWrapper}`}>
                {formConfig.map((c) => {
                  return (
                    <Input key={c.id} config={c} onChange={onChangeHandler} />
                  );
                })}
              </div>
              <Button
                onClick={submitHandler}
                type={formIsValid() ? "submit" : "disabled-submit"}
                id="submit"
              >
                SUBMIT
              </Button>
            </div>
          )}

          {children}
        </form>
      </div>
    );
  }

  return content;
};

export default Form;

const MAPBOX_TOKEN_PRODUCTION = process.env.MAPBOX_TOKEN_PRODUCTION;
const AIRTABLE_ACCESS_KEY = process.env.AIRTABLE_ACCESS_KEY;
import { useState, useEffect, useContext } from "react";
import classes from "./Autocomplete.module.css";
import Button from "./UI/Button";
import Spinner from "./UI/Spinner";
import { capitalizeFirstLetter, connectMetamaskHandler } from "../utils/utils";
import { getMapboxSearchResults } from "../utils/utils";
import { getCountrID } from "../utils/utils";
import { getSingleDestiantion } from "../utils/utils";
import LinkButton from "./UI/Link";
import SildeModal from "./UI/SlideModal";
import Modal from "./UI/Modal";
import AuthContext from "../../context-store/auth-context";
import MetamaskIcon from "../assets/images/MetamaskIcon";

const Autocomplete = () => {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [airtableData, setAirtableData] = useState(null);
  const [results, setResults] = useState([]);
  const [enabled, setEnabled] = useState(false);
  const [place, setPlace] = useState(null);
  const [isVisible, setIsVisble] = useState(false);
  const [searchResult, setSearchResult] = useState(false);
  const [timer, setTimer] = useState(null);
  const [countryOption, setCountryOption] = useState(null);
  const [cityOption, setCityOption] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deploy, setDeploy] = useState(false);
  const { login, isAuth } = useContext(AuthContext);
  const [address, setAddress] = useState(null);
  const [userData, setUserData] = useState(null);

  const deployHandler = () => {
    !isAuth ? setShowModal(true) : setShowAddressModal(true);
    !isAuth ? setDeploy(true) : setDeploy(true);
  };

  useEffect(() => {
    address && setShowAddressModal(true) && setShowModal(false);
    !userData || (!address && setIsSubmitted(false));
  }, [address, userData]);

  useEffect(() => {
    if (searchResult) {
      console.log(airtableData);
      if (place && place.place_type[0] === "country") {
        setCountryOption({
          name: airtableData.records[0].fields["Name"],
          flag: airtableData.records[0].fields["Flag"],
          txt: "view",
          link: airtableData.records[0].id,
        });
      }

      if (airtableData && airtableData.value === false) {
        setCityOption({
          name: `${place.matching_text || place.text} - ${
            airtableData.country
          }`,
          // flag: response[0].fields["Flag"],
          txt: "deploy",
        });
        setCountryOption({
          name: airtableData.country_data.records[0].fields["Name"],
          flag: airtableData.country_data.records[0].fields["Flag"],
          txt: "view",
          link: airtableData.country_data.records[0].id,
        });
        setSearchResult(false);
        return;
      }

      if (place && place.place_type[0] !== "country") {
        if (airtableData && airtableData.value === false) return;
        setCityOption({
          name: `${airtableData[0].records[0].fields["city"]} - ${airtableData[1].fields["Name"]}`,
          txt: "view",
          link: `${
            airtableData[1].id
          }/${airtableData[0].records[0].fields.city_ascii
            .replace("`", "")
            .toLowerCase()
            .replace(" ", "-")}`,
        });
        setCountryOption({
          name: airtableData[1].fields["Name"],
          flag: airtableData[1].fields["Flag"],
          txt: "view",
          link: airtableData[1].id,
        });
      }

      setSearchResult(false);
    }
    setSearchResult(false);
    setPlace(null);
  }, [searchResult]);

  //   const handleSearchChangeHandler = (searchValue) => {};
  const destinationChangeHadler = (e) => {
    setSearch(capitalizeFirstLetter(e.target.value));
    setCityOption(null);
    setCountryOption(null);
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
          setCountryOption({
            name: response.records[0].fields["Name"],
            flag: response.records[0].fields["Flag"],
            txt: "deploy",
            id: null,
          });
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

  const connectToMetamask = async () => {
    const { walletAddress, token, userData } = await connectMetamaskHandler();
    setAddress(walletAddress);
    login(token);
    userData && setUserData(userData);
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
      <Button onClick={searchHandler} type={enabled ? "blue" : "disabled"}>
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
      <ul className={classes.SearchResults}>
        {countryOption && (
          <li
            style={{
              borderBottom: `${
                !cityOption ? "0px" : "1px solid rgba(32, 32, 32, 0.1)"
              }`,
            }}
          >
            <span>
              <img src={countryOption.flag} />
              {countryOption.name}
            </span>
            {countryOption.txt !== "view" ? (
              <Button id="deploy2" onClick={deployHandler} type="white">
                {countryOption.txt.toUpperCase()}
              </Button>
            ) : (
              <LinkButton href={`/${countryOption.link}`} type="white">
                {countryOption.txt.toUpperCase()}
              </LinkButton>
            )}
          </li>
        )}
        {cityOption && (
          <li>
            <span>{cityOption?.name.toUpperCase()}</span>
            {/* <Button type="yellow">{cityOption?.txt.toUpperCase()}</Button> */}

            {cityOption.txt !== "view" ? (
              <Button id="deploy" onClick={deployHandler} type="yellow">
                {cityOption.txt.toUpperCase()}
              </Button>
            ) : (
              <LinkButton href={`/${cityOption.link}`} type="white">
                {cityOption.txt.toUpperCase()}
              </LinkButton>
            )}
          </li>
        )}
      </ul>
      <SildeModal
        onClose={() => setShowAddressModal(false)}
        show={showAddressModal}
        deploy={deploy}
        searchValue={search}
      />
      <Modal
        onClose={() => setShowModal(false)}
        show={showModal}
        title="Connect Wallet"
      >
        <Button type="metamask" onClick={connectToMetamask}>
          <MetamaskIcon />
          Meta Mask
        </Button>
      </Modal>

      {isLoading && <Spinner />}
    </div>
  );
};

export default Autocomplete;

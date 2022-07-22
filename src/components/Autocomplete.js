const AIRTABLE_ACCESS_KEY = process.env.AIRTABLE_ACCESS_KEY;
import { useState, useEffect, useContext } from "react";
import classes from "./Autocomplete.module.css";
import Button from "./UI/Button";
import Spinner from "./UI/Spinner";
import { connectMetamaskHandler } from "../utils/utils";
import { getID } from "../utils/utils";
import { getSingleDestiantion } from "../utils/utils";
import LinkButton from "./UI/Link";
import SildeModal from "./UI/SlideModal";
import Modal from "./UI/Modal";
import AuthContext from "../../context-store/auth-context";
import MetamaskIcon from "../assets/images/MetamaskIcon";
import useMapbox from "../hooks/useMapbox";

const Autocomplete = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [airtableData, setAirtableData] = useState(null);
  const [options, setOptions] = useState(false);
  const [searchResult, setSearchResult] = useState(false);
  const [countryOption, setCountryOption] = useState(null);
  const [cityOption, setCityOption] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deploy, setDeploy] = useState(false);
  const {
    login,
    isAuth,
    recommendation,
    onRecommendation,
    user,
    enableDeploy,
  } = useContext(AuthContext);
  const [address, setAddress] = useState(null);
  const [userData, setUserData] = useState(null);
  const {
    destinationChangeHadler,
    handleItemClickedHandler,
    updateReset,
    results,
    enabled,
    search,
    isVisible,
    place,
    reset,
    destinationType,
    setMapboxSearch,
  } = useMapbox(".json?types=country&types=place&access_token=");

  const deployHandler = () => {
    !isAuth ? setShowModal(true) : setShowAddressModal(true);
    !isAuth ? setDeploy(true) : setDeploy(true);
  };

  const getRecommendedCity = (rec) => {
    let city = rec.context.find((text) => {
      return text.id.includes("place");
    });
    return city.text;
  };

  useEffect(() => {
    address && setShowAddressModal(true) && setShowModal(false);
    !userData || (!address && setIsSubmitted(false));
    options && updateReset();
    reset && setOptions(false);
  }, [address, userData, options]);

  useEffect(() => {
    if (recommendation) {
      searchViaReccomendation(getRecommendedCity(recommendation));
    }
  }, [recommendation]);

  useEffect(() => {
    console.log(user);
    // if (searchResult && (user?.path === "/" || !user?.path)) {
    if (searchResult) {
      setOptions(true);
      let { city, country } = airtableData;

      if (place && place.place_type[0] === "country") {
        setCountryOption({
          name: country.fields["Name"],
          flag: country.fields["Flag"],
          txt: "view",
          link: country.id,
        });
      }

      if (airtableData && airtableData.value === false) {
        setCityOption({
          name: recommendation
            ? `${getRecommendedCity(recommendation)} - ${
                airtableData.country_name
              }`
            : `${place?.text} - ${airtableData.country_name}`,
          flag: airtableData.country.records?.[0].fields["Flag"],
          txt: "deploy",
        });
        setCountryOption({
          name: airtableData.country.records[0].fields["Name"],
          flag: airtableData.country.records?.[0].fields["Flag"],
          txt: "view",
          link: airtableData.country.records[0].id,
        });
        setSearchResult(false);
        onRecommendation("");
        return;
      }

      if (
        (place && place.place_type[0] !== "country") ||
        (!place && recommendation)
      ) {
        if (airtableData.value === false) return;
        setCityOption({
          name: recommendation
            ? `${getRecommendedCity(recommendation)} - ${
                country.fields["Name"]
              }`
            : `${city.fields.city} - ${country.fields["Name"]}`,
          txt: "view",
          flag: country.fields["Flag"],
          link: `${country.id}/${city.id}`,
        });
        setCountryOption({
          name: country.fields["Name"],
          flag: country.fields["Flag"],
          txt: "view",
          link: country.id,
        });
        onRecommendation("");
      }

      setSearchResult(false);

      onRecommendation("");
    }
    setSearchResult(false);
    updateReset();
  }, [searchResult]);

  const searchViaReccomendation = async (reccomentdation) => {
    let cityExist;
    let id;
    const response = await getID(
      `https://api.airtable.com/v0/appEQgGYRpKWhBUQj/Cities?api_key=${AIRTABLE_ACCESS_KEY}&filterByFormula=city="${reccomentdation}"`,
      null,
      "GET"
    );
    cityExist = true;
    if (response.records.length === 0) {
      cityExist = false;
      const response = await getSingleDestiantion(
        `https://nearestdao.herokuapp.com`,
        {
          name: reccomentdation,
          type: "place",
        },
        "POST"
      );
      setAirtableData(response);
    } else {
      setAirtableData(response);
      id = response.records[0]?.id;
    }

    let searchData = {
      [!cityExist ? "name" : "id"]: !cityExist ? reccomentdation : id,
      type: "place",
    };

    try {
      const response = await getSingleDestiantion(
        `https://nearestdao.herokuapp.com`,
        searchData,
        "POST"
      );

      response && setSearchResult(true);
      setAirtableData(response);
      setIsLoading(false);
      setMapboxSearch("");
      updateReset();
      if (results.length === 0 && search !== "") {
        setAirtableData(response);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const searchHandler = async () => {
    let id;
    let searchData;
    let cityExist;
    setIsLoading(true);
    if (place) {
      if (place.place_type[0] === "country") {
        cityExist = true;
        const response = await getID(
          `https://api.airtable.com/v0/appEQgGYRpKWhBUQj/Countries?api_key=${AIRTABLE_ACCESS_KEY}&filterByFormula=Name="${place.place_name} DAO"`,
          null,
          "GET"
        );
        setAirtableData(response);

        if (response.records.length !== 0) {
          id = response.records[0].id;
        }

        if (!id || response.records.length === 0) {
          setOptions(true);
          setCountryOption({
            name:
              response.records.length !== 0
                ? response.records[0].fields["Name"]
                : place.text,
            flag:
              response.records.length !== 0
                ? response.records[0].fields["Flag"]
                : "",
            txt: "deploy",
            id: null,
          });
          setIsLoading(false);
          return;
        }
      } else {
        const response = await getID(
          `https://api.airtable.com/v0/appEQgGYRpKWhBUQj/Cities?api_key=${AIRTABLE_ACCESS_KEY}&filterByFormula=city="${place.text}"`,
          null,
          "GET"
        );
        cityExist = true;
        if (response.records.length === 0) {
          cityExist = false;
          const response = await getSingleDestiantion(
            `https://nearestdao.herokuapp.com`,
            {
              name: place.matching_text || place.text,
              type: "place",
            },
            "POST"
          );
          setAirtableData(response);
        } else {
          setAirtableData(response);
          id = response.records[0]?.id;
        }
      }
    }

    if (results.length === 0 && search !== "") {
      searchData = {
        name: search,
        type: "place",
      };
    } else {
      searchData = {
        [!cityExist ? "name" : "id"]: !cityExist
          ? place.matching_text || place.text
          : id,
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
      setAirtableData(response);
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
      {isAuth && (
        <ul className={classes.SearchResults}>
          {countryOption && !reset && (
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
          {cityOption && !reset && (
            <li>
              <div>
                <span>
                  <img src={countryOption.flag} />
                </span>
                <span>{cityOption?.name.toUpperCase()}</span>
              </div>

              {cityOption.txt !== "view" ? (
                <Button
                  id="deploy"
                  onClick={deployHandler}
                  type={`${
                    (user && user?.verified) || enableDeploy
                      ? "yellow"
                      : "disabled"
                  }`}
                >
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
      )}
      <SildeModal
        onClose={() => {
          setShowAddressModal(false);
          setUserData(null);
        }}
        show={showAddressModal}
        deploy={deploy}
        searchValue={search}
        desType={destinationType}
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

const MAPBOX_TOKEN_PRODUCTION = process.env.MAPBOX_TOKEN_PRODUCTION;
import ReactDOM from "react-dom";
import LinkButton from "./Link";
import { useState, useEffect, useRef, useContext } from "react";
import AuthContext from "../../../context-store/auth-context";
import classes from "./SlideModal.module.css";
import AvatarIcon from "../../assets/images/AvatarIcon";
import Button from "./Button";
import {
  shorten,
  setNewAddress,
  capitalizeFirstLetter,
  getMapboxSearchResults,
} from "../../utils/utils";
import { infoConfig } from "../../config/formConfig";
import Form from "../Form";

const SildeModal = ({
  show,
  address: walletAddress,
  onClose,
  onSubmit,
  isSubmitted,
  userData,
  deploy,
  searchValue,
  allFavorites,
  destinationType,
}) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const [isVisible, setIsVisble] = useState(false);
  const [timer, setTimer] = useState(null);
  const [results, setResults] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [city, setCity] = useState(null);
  const [search, setSearch] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [notcheckedError, setNotCheckedError] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [changeAddress, setChangeAddress] = useState(false);
  const [error, setError] = useState(false);
  const {
    logout,
    isAuth,
    user,
    submitAddress,
    hasAddress,
    minutesDiff,
    updateAddress,
    onRecommendation,
  } = useContext(AuthContext);

  const modalWrapperRef = useRef();

  const destinationChangeHadler = (e) => {
    setSearch(capitalizeFirstLetter(e.target.value));
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

  const closeModalHandler = () => {
    onClose();
  };

  const changeAddressHandler = async () => {
    let sixMonths = 262974;
    if (minutesDiff < sixMonths) {
      setError(true);
      return;
    }
    setChangeAddress(true);
    setError(false);
    setSearch("");
  };

  const checkboxHandler = (ev) => {
    setIsChecked(ev.target.checked);
    setNotCheckedError(false);
  };

  const performMapboxSearch = async (value) => {
    if (search === "") {
      setResults([]);
      setEnabled(false);
      return;
    }

    const features = await getMapboxSearchResults(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?types=address&access_token=${MAPBOX_TOKEN_PRODUCTION}`,
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
  };

  const backDropHandler = (e) => {
    if (
      !modalWrapperRef?.current?.contains(e.target) &&
      !e.target.id &&
      !e.target.closest("#wrapper") &&
      !e.target.closest("#address-wrapper") &&
      !e.target.closest("#list")
    ) {
      onClose();
      setError(false);
    }
  };

  useEffect(() => {
    setIsBrowser(true);
    window.addEventListener("click", backDropHandler);
    return () => window.removeEventListener("click", backDropHandler);
  }, []);

  const searchHandler = async () => {
    if (!isChecked) {
      setNotCheckedError(true);
      return;
    }

    onRecommendation(city);

    if (user.address) {
      updateAddress(true);
    }

    const userAddress = await setNewAddress(search, walletAddress, user);
    setUserAddress(userAddress || search);

    onClose();
    setNotCheckedError(false);
    onSubmit(true);
    submitAddress(true);
    setChangeAddress(false);
  };

  const onSubmitHandler = (formData) => {
    let userDetails = {
      user_name: formData.user_name,
      password: formData.password,
    };
    httpClient.sendRequest("POST", "/token/", null, userDetails);
  };

  const modalContent =
    show && isAuth ? (
      <div className={classes.modalOverlay}>
        <div
          id="wrapper"
          ref={modalWrapperRef}
          className={`${show ? classes.open : classes.close} ${
            classes.modalWrapper
          }`}
        >
          <div className={classes.header}>
            <div>
              <AvatarIcon />
            </div>
            <div className={classes.accountWrapper}>
              <p>
                delocal.xyz/{shorten(user?.walletAddress || walletAddress, 20)}
              </p>
              <Button onClick={() => logout()} type="transparent">
                Logout
              </Button>
            </div>
          </div>
          <div
            className={`${
              (userData?.address ||
                userAddress ||
                hasAddress ||
                // !changeAddress ||
                (user?.address && !deploy)) &&
              !changeAddress
                ? classes.dashboardBody
                : classes.body
            }`}
          >
            {deploy ? (
              <Form
                formConfig={infoConfig}
                onSubmit={onSubmitHandler}
                searchValue={searchValue}
                close={() => onClose()}
                destinationType={destinationType}
              />
            ) : (isSubmitted ||
                userData?.address ||
                userAddress ||
                hasAddress ||
                user?.address) &&
              !changeAddress ? (
              <div className={classes.dashboardLastStage}>
                <div className={classes.dashboardInfoWrapper}>
                  <h4>User ID:</h4>
                  <span>{walletAddress || user?.walletAddress}</span>
                </div>
                <div className={classes.dashboardInfoWrapper}>
                  <h4>Address:</h4>
                  <span>
                    {userAddress || userData?.address || user?.address}
                  </span>
                  <Button
                    id="change address"
                    onClick={changeAddressHandler}
                    type="transparent"
                  >
                    Change Address
                  </Button>
                  {error && (
                    <div className={classes.importantNote}>
                      Adress can be changed only six months after registration.
                    </div>
                  )}
                </div>
                <div>
                  <h4>Saved DAOs:</h4>
                  {allFavorites.length > 0 &&
                    allFavorites.map((fav) => {
                      return (
                        <LinkButton
                          key={fav.id}
                          href={fav.url}
                          type="cities-link"
                          onClick={closeModalHandler}
                        >
                          {fav.place}
                        </LinkButton>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div className="wrapper">
                <h2>You’re almost done!</h2>
                <p>
                  Sumbit your physical address and start engaging your local
                  DAOs communities!
                </p>
                <div className={classes.AutocompleteWrapper}>
                  <input
                    className={classes.input}
                    type="text"
                    value={search}
                    onChange={destinationChangeHadler}
                    placeholder="Address"
                  />
                  <Button
                    onClick={searchHandler}
                    type={enabled ? "blue" : "disabled"}
                  >
                    SUBMIT
                  </Button>
                  {isVisible && (
                    <ul className={classes.results} id="address-wrapper">
                      {results.map((place) => {
                        let splittedResult = place.place_name.split(",");
                        if (splittedResult.length > 1) {
                          return (
                            <li
                              className={classes.address}
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
                <div className={`${classes.importantNote} ${classes.Yellow}`}>
                  Please note! You won’t be able to change your address in the
                  next
                  <span> 6 months.</span>
                </div>
                <div className={classes.radioButtonWrapper}>
                  <label className={classes.checkboxContainer}>
                    <input type="checkbox" onChange={checkboxHandler} />
                    <span className={classes.checkmark}></span>
                  </label>
                  <p>I understand</p>
                  {notcheckedError && (
                    <span className={classes.error}>
                      This field is required!!!
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("address-modal-root")
    );
  } else {
    return null;
  }
};

export default SildeModal;

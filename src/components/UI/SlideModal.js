const MAPBOX_TOKEN_PRODUCTION = process.env.MAPBOX_TOKEN_PRODUCTION;
import ReactDOM from "react-dom";
import LinkButton from "./Link";
import { useState, useEffect, useRef, useContext } from "react";
import AuthContext from "../../../context-store/auth-context";
import { capitalizeFirstLetter } from "../../utils/utils";
import { getMapboxSearchResults } from "../../utils/utils";
import classes from "./SlideModal.module.css";
import AvatarIcon from "../../assets/images/AvatarIcon";
import Button from "./Button";
import { shorten } from "../../utils/utils";
import { infoConfig } from "../../config/formConfig";
import Form from "../Form";

const SildeModal = ({
  show,
  address,
  onClose,
  onSubmit,
  isSubmitted,
  userData,
  deploy,
  searchValue,
}) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const [isVisible, setIsVisble] = useState(false);
  const [timer, setTimer] = useState(null);
  const [results, setResults] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [search, setSearch] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [notcheckedError, setNotCheckedError] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const { logout, isAuth, user } = useContext(AuthContext);

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

    const response = await fetch("/api/auth/address", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ address: search, walletAddress: address }),
    });
    const { address: userAddress } = await response.json();
    setUserAddress(userAddress);
    onClose();
    setNotCheckedError(false);
    onSubmit(true);
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
              <p>delocal.xyz/{shorten(user?.walletAddress || address, 20)}</p>
              <Button onClick={() => logout()} type="transparent">
                Logout
              </Button>
            </div>
          </div>
          <div
            className={`${
              userData?.address || userAddress || (user?.address && !deploy)
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
              />
            ) : isSubmitted ||
              userData?.address ||
              userAddress ||
              user?.address ? (
              <div className={classes.dashboardLastStage}>
                <div className={classes.dashboardInfoWrapper}>
                  <h4>User ID:</h4>
                  <span>{address || user?.walletAddress}</span>
                </div>
                <div className={classes.dashboardInfoWrapper}>
                  <h4>Address:</h4>
                  <span>
                    {userData?.address || userAddress || user?.address}
                  </span>
                  <Button type="transparent">Change Address</Button>
                </div>
                <div>
                  <h4>Saved DAOs:</h4>
                  <LinkButton href="/" type="cities-link">
                    Manchester
                  </LinkButton>
                  <LinkButton href="/" type="cities-link">
                    London
                  </LinkButton>
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
                <div className={classes.importantNote}>
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

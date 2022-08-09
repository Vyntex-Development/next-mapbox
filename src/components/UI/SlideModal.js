import ReactDOM from "react-dom";
import LinkButton from "./Link";
import { useState, useEffect, useRef, useContext } from "react";
import supabase from "../../supabase/supabase";
import AuthContext from "../../../context-store/auth-context";
import classes from "./SlideModal.module.css";
import AvatarIcon from "../../assets/images/AvatarIcon";
import Button from "./Button";
import TwitterVerification from "./TwitterVerification";
import {
  shorten,
  setNewAddress,
  connectMetamaskHandler,
  setTwitterHandle,
  setIpUserdetails,
} from "../../utils/utils";
import { infoConfig } from "../../config/formConfig";
import Form from "../Form";
import useMapbox from "../../hooks/useMapbox";

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
  desType,
}) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [notcheckedError, setNotCheckedError] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [changeAddress, setChangeAddress] = useState(false);
  const [error, setError] = useState(false);
  const [navigate, setNavigate] = useState(false);
  const [usernameIsValid, setUsernameIsValid] = useState(false);
  const [twitterInputError, setTwitterInputError] = useState("");
  const [twitterUsername, setTwitterUsername] = useState("");
  const [verified, setVerified] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [updatedSignature, setUpdatedSignature] = useState("");
  const [enablePostStep, setEnablePostStep] = useState(false);

  const {
    destinationChangeHadler,
    handleItemClickedHandler,
    results,
    enabled,
    search,
    isVisible,
    city,
    setMapboxSearch,
  } = useMapbox(".json?types=place&access_token=");
  const {
    logout,
    isAuth,
    user,
    submitAddress,
    hasAddress,
    timeInfo,
    updateAddress,
    onRecommendation,
    onDeploy,
    ipData,
  } = useContext(AuthContext);

  useEffect(() => {
    if (verified) closeModalHandler();
    // if (search) setError(false);
  }, [verified]);

  useEffect(() => {
    if (search) setError(false);
  }, [search]);

  const modalWrapperRef = useRef();

  const closeModalHandler = () => {
    onClose();
  };

  const changeAddressHandler = async () => {
    let sixMonths = 262974;
    if (timeInfo.timeDifference < sixMonths) {
      setError(true);
      return;
    }
    setChangeAddress(true);
    setError(false);
    setMapboxSearch("");
  };

  const checkboxHandler = (ev) => {
    setIsChecked(ev.target.checked);
    setNotCheckedError(false);
  };

  const onChangeHandler = (ev) => {
    setTwitterUsername(ev.target.value);
    setTwitterInputError("");
  };

  const onLinkTwitterHandle = async () => {
    setEnablePostStep(false);
    if (twitterUsername.trim() === "") {
      setTwitterInputError("This field is required");
      return;
    }

    if (
      twitterUsername.trim() !== "" &&
      twitterUsername.trim().charAt(0) !== "@"
    ) {
      setTwitterInputError("Username must begines with @ symbol");
      return;
    }

    // connectMetamaskHandler;

    // check if handle exists in base

    let { data: users } = await supabase.from("users").select("*");

    if (
      users.some((user) => {
        return user.twitterHandle === twitterUsername && user.verified;
      })
    ) {
      setUsernameError("User with this account already exists");
      return;
    }
    setUsernameError(false);
    setTwitterHandle(twitterUsername, user.walletAddress);

    setEnablePostStep(true);
    const { userData, signature } =
      await connectMetamaskHandler(`Hi there from DELOCAL.XZY! Sign this message to prove you have access to this wallet and we'll log you in. This won't cost you any Ether.
    To stop hackers using your wallet, here's a unique message ID they can't guess: ${twitterUsername}`);
    userData && setNavigate(true);
    userData && setUsernameIsValid(true);
    setUpdatedSignature(signature);
  };

  const backDropHandler = (e) => {
    if (
      !modalWrapperRef?.current?.contains(e.target) &&
      !e.target.id &&
      !e.target.closest("#wrapper") &&
      !e.target.closest("#address-wrapper") &&
      !e.target.closest("#list") &&
      !e.target.closest("#twitter-link") &&
      !e.target.closest("#twitter-link") &&
      !e.target.closest("#verify-button") &&
      !e.target.closest("#post-button")
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

  const setVerifyHandler = (verified) => {
    setVerified(verified);
    if (verified) {
      onDeploy(true);
    }
  };

  const searchHandler = async () => {
    const countryOfUser = search
      .split(",")
      [search.split(",").length - 1].trim();

    if (!isChecked) {
      setNotCheckedError(true);
      return;
    }

    if (countryOfUser !== ipData.country_name) {
      setError(true);
      return;
    }

    onRecommendation(city);

    if (user.address) {
      updateAddress({ address: search });
    }

    const userAddress = await setNewAddress(search, walletAddress, user);
    await setIpUserdetails(user.id, ipData.country_name, ipData.short_code);
    setUserAddress(userAddress || search);

    setError(false);
    updateAddress({ address: userAddress || search });
    setNotCheckedError(false);
    onSubmit(true);
    submitAddress(true);
    setChangeAddress(false);
    setIsChecked(false);
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
                // hasAddress ||
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
                destinationType={desType}
              />
            ) : (isSubmitted ||
                userData?.address ||
                userAddress ||
                hasAddress ||
                user?.address) &&
              !changeAddress ? (
              <div className={classes.dashboardLastStage}>
                <div className={classes.dashboardInfoWrapper}>
                  <h4>Account status:</h4>
                  <span
                    className={`${
                      verified || user?.verified ? classes.Verified : ""
                    }`}
                  >
                    {verified || user?.verified ? "Verified" : "Not verified"}
                  </span>
                </div>
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
                      Your address can only be changed every 6 months. The next
                      time you can change your address is on{" "}
                      {timeInfo.dateOfNextAvailableAddressChange}
                    </div>
                  )}
                </div>
                {!verified && !user?.verified && (
                  <div className={classes.LinkWrapper}>
                    <div className={classes.dashboardInfoWrapper}>
                      <h4>Tweeter account:</h4>
                      <TwitterVerification
                        onChange={onChangeHandler}
                        username={twitterUsername}
                        onClick={onLinkTwitterHandle}
                        twitterInputError={twitterInputError}
                        usernameIsValid={usernameIsValid}
                        navigate={navigate}
                        setVerify={setVerifyHandler}
                        updatedSignature={updatedSignature}
                        usernameError={usernameError}
                        enablePostStep={enablePostStep}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="wrapper">
                <h2>You&apos;re almost done!</h2>
                <p>
                  Sumbit a name of your city and start engaging your local DAOs
                  communities!
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
                  Please note! You won&apos;t be able to change your address in
                  the next
                  <span> 6 months.</span>
                </div>
                {error && (
                  <div className={`${classes.importantNote} ${classes.Red}`}>
                    Country doesn&apos;t match the IP address
                  </div>
                )}
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

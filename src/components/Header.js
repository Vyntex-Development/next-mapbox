import Logo from "../assets/images/Logo";
import classes from "./Header.module.css";
import FacebookIcon from "../assets/images/FacebookIcon";
import LinkedinIcon from "../assets/images/LinkedinIcon";
import TwitterIcon from "../assets/images/TwitterIcon";
import RedditIcon from "../assets/images/RedditIcon";
import Button from "./UI/Button";
import Modal from "./UI/Modal";
import { useState, useEffect, useContext } from "react";
import MetamaskIcon from "../assets/images/MetamaskIcon";
import AuthContext from "../../context-store/auth-context";
import FavoritesContext from "../../context-store/favorites-context";
import { connectMetamaskHandler } from "../utils/utils";
import SildeModal from "./UI/SlideModal";

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [address, setAddress] = useState(null);
  const [userSignature, setSignature] = useState(null);
  const [userData, setUserData] = useState(null);
  const { login, isAuth, user } = useContext(AuthContext);
  const { allFavorites } = useContext(FavoritesContext);

  useEffect(() => {
    address && setShowAddressModal(true);
    !userData || (!address && setIsSubmitted(false));
    !user?.address && setIsSubmitted(false);
  }, [address, userData]);

  const linkButtonHandler = async () => {
    isAuth ? setShowModal(false) : setShowModal(true);
    isAuth && setShowAddressModal(true);
  };

  const onSubmitHandler = () => {
    setIsSubmitted(true);
  };

  const connectToMetamask = async () => {
    const { walletAddress, token, userData, signature } =
      await connectMetamaskHandler(`Hi there from DELOCAL.XZY! Sign this message to prove you have access to this wallet and we'll log you in. This won't cost you any Ether.
    To stop hackers using your wallet, here's a unique message ID they can't guess:`);
    setAddress(walletAddress || "");
    setSignature(signature || "");
    login(token);
    userData && setUserData(userData);
  };

  return (
    <header className={classes.header}>
      <div className="container">
        <div className={classes.iconsContainer}>
          <span>SHARE:</span>
          <div className={classes.icons}>
            <TwitterIcon />
            <FacebookIcon />
            <LinkedinIcon />
            <RedditIcon />
          </div>
        </div>
        <div>
          <Logo />
        </div>
        <div className={classes.linksContainer}>
          <Button onClick={linkButtonHandler} type="blue" id="connect">
            {!isAuth ? "CONNECT WALLET" : "DASHBOARD"}
          </Button>
        </div>
      </div>
      {!isAuth && (
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
      )}
      {isAuth && (
        <SildeModal
          onClose={() => setShowAddressModal(false)}
          userSignature={userSignature}
          show={showAddressModal}
          address={address}
          onSubmit={onSubmitHandler}
          isSubmitted={isSubmitted}
          userData={userData}
          allFavorites={allFavorites}
        ></SildeModal>
      )}
    </header>
  );
};

export default Header;

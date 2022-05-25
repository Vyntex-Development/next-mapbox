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
import { ethers } from "ethers";
import SildeModal from "./UI/SlideModal";

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [address, setAddress] = useState(null);
  const [userData, setUserData] = useState(null);

  const { login, isAuth } = useContext(AuthContext);

  useEffect(() => {
    address && setShowAddressModal(true);
    !userData || (!address && setIsSubmitted(false));
  }, [address, userData]);

  const connectMetamaskHandler = async () => {
    if (!window.ethereum) {
      window.open(
        "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
        "_blank"
      );
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();
    console.log(walletAddress);
    setAddress(walletAddress);
    // const signature = await signer.signMessage("Hello world");
    // console.log(signature, "signature");

    let response = await fetch("/api/auth/nonce", {
      method: "POST",
      body: JSON.stringify({ walletAddress }),
      headers: {
        "Content-type": "application/json",
      },
    });

    const { nonce } = await response.json();
    const signature = await signer.signMessage(nonce);

    let walletResponse = await fetch("/api/auth/wallet", {
      method: "POST",
      body: JSON.stringify({ walletAddress, nonce, signature }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const { data: userData, token } = await walletResponse.json();
    login(token);
    userData && setUserData(userData);
  };

  const linkButtonHandler = () => {
    isAuth ? setShowModal(false) : setShowModal(true);
    isAuth && setShowAddressModal(true);
  };

  const onSubmitHandler = () => {
    setIsSubmitted(true);
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
          <Button type="metamask" onClick={connectMetamaskHandler}>
            <MetamaskIcon />
            Meta Mask
          </Button>
        </Modal>
      )}
      {isAuth && (
        <SildeModal
          onClose={() => setShowAddressModal(false)}
          show={showAddressModal}
          address={address}
          onSubmit={onSubmitHandler}
          isSubmitted={isSubmitted}
          userData={userData}
        ></SildeModal>
      )}
    </header>
  );
};

export default Header;

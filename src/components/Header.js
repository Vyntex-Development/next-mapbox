import Logo from "../assets/images/Logo";
import classes from "./Header.module.css";
import FacebookIcon from "../assets/images/FacebookIcon";
import LinkedinIcon from "../assets/images/LinkedinIcon";
import TwitterIcon from "../assets/images/TwitterIcon";
import RedditIcon from "../assets/images/RedditIcon";
import Button from "./UI/Button";
import Modal from "./UI/Modal";
import Link from "./UI/Link";
import { useMetaMask } from "metamask-react";
import { useState } from "react";

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState("");

  const { status, connect, account, chainId, ethereum } = useMetaMask();

  const metamaskHandler = () => {
    if (status === "unavailable") setShowModal(true);
    if (status === "notConnected") connect();
  };

  const addAddressHandler = async () => {
    let data = {
      eht_address: account,
      phy_address: address,
      tweeter_handle: false,
    };

    const response = await fetch(
      "https://nearestdao.herokuapp.com/create/user",
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    const responseData = await response.json();
    console.log(responseData);
  };

  const setAddressHandler = (ev) => {
    setAddress(ev.target.value);
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
          <Button onClick={metamaskHandler} type="blue" id="connect">
            {status === "connected" ? "Connected" : "Connect Metamask"}
          </Button>
          {status === "connected" && (
            <div className={classes.InputWrapper}>
              <input
                className={classes.input}
                type="text"
                placeholder="Add your address"
                onChange={setAddressHandler}
              />
              <Button onClick={addAddressHandler} type="blue">
                ADD
              </Button>
            </div>
          )}
        </div>
      </div>
      <Modal
        onClose={() => setShowModal(false)}
        show={showModal}
        title="Plase install Metamask wallet on your computer!"
      >
        Got to &nbsp; <Link href="https://metamask.io/"> Metamask.IO</Link>{" "}
        &nbsp; and install wallter or install extension on your browser
      </Modal>
    </header>
  );
};

export default Header;

const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
import classes from "./TwitterVerification.module.css";
import Button from "./Button";
import { useState } from "react";

const TwitterVerification = ({
  onChange,
  user,
  usernameIsValid,
  username,
  onClick,
  twitterInputError,
  navigate,
}) => {
  const [verifyButton, setVerifyButton] = useState(false);
  const openTwitter = async () => {
    navigate &&
      window.open(
        `https://twitter.com/intent/tweet?hashtags=delocalize&original_referer=https%3A%2F%2Fsaurabhnemade.github.io%2F&ref_src=twsrc%5Etfw%7Ctwcamp%5Ebuttonembed%7Ctwterm%5Eshare%7Ctwgr%5Edelocalize&text=Verifying%20my%20identity%20for%20%40delocalize%20with%20sig%3A%20%20${user.walletAddress}%20&url=https%3A%2F%2Fb92.rs%20`,
        "popup",
        "width=600,height=600"
      );
    setVerifyButton(true);
  };

  const verifyAccountHandler = async () => {
    const reponse = await fetch(
      `/api/twitter/twitter-verification?walletAddress=${user.walletAddress}`
    );
    const { mention } = await reponse.json();
    if (mention) {
      console.log("verify");
    }
  };

  return (
    <div className={classes.InputWrapper}>
      <input
        id="twitter"
        name="twitter"
        onChange={onChange}
        value={username}
        placeholder="@Username"
      />
      <span>{twitterInputError}</span>
      {/* <span>{errorMsg}</span> */}
      {!usernameIsValid && (
        <Button onClick={onClick} id="twitter-link" type="blue">
          Link Twitter
        </Button>
      )}
      {usernameIsValid && !verifyButton && (
        <a
          onClick={openTwitter}
          id="post-button"
          // onClick={() => {

          // }}
          // target="_blank"
          // href={`https://twitter.com/intent/tweet?hashtags=delocalize&original_referer=https%3A%2F%2Fsaurabhnemade.github.io%2F&ref_src=twsrc%5Etfw%7Ctwcamp%5Ebuttonembed%7Ctwterm%5Eshare%7Ctwgr%5Edelocalize&text=Verifying%20my%20identity%20for%20%40delocalize%20with%20sig%3A%20%20${user.walletAddress}%20&url=https%3A%2F%2Fb92.rs%20`}
        >
          Post to Tweeter
        </a>
      )}
      {verifyButton && (
        <Button onClick={verifyAccountHandler} id="verify-button" type="blue">
          Verify account
        </Button>
      )}
    </div>
  );
};

export default TwitterVerification;

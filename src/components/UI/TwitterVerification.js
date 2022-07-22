const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
import classes from "./TwitterVerification.module.css";
import Button from "./Button";
import { useState, useContext } from "react";
import { setVerifyUser } from "../../utils/utils";
import AuthContext from "../../../context-store/auth-context";
import Spinner from "./Spinner";
import supabase from "../../supabase/supabase";

const TwitterVerification = ({
  onChange,
  usernameIsValid,
  username,
  onClick,
  twitterInputError,
  navigate,
  setVerify,
  updatedSignature,
  usernameError,
}) => {
  const [verifyButton, setVerifyButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const [posted, setPosted] = useState(false);
  const [error, setError] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const openTwitter = async () => {
    navigate &&
      window.open(
        `https://twitter.com/intent/tweet?hashtags=vyntex_&original_referer=https%3A%2F%2Fsaurabhnemade.github.io%2F&ref_src=twsrc%5Etfw%7Ctwcamp%5Ebuttonembed%7Ctwterm%5Eshare%7Ctwgr%5Evyntex_&text=Verifying%20my%20identity%20for%20%40vyntex_%20with%20sig%3A%20%20${
          updatedSignature || user.signature
        }%20`,
        "popup",
        "width=600,height=600"
      );
    setVerifyButton(true);
  };

  const verifyAccountHandler = async () => {
    let userMention;
    setLoading(true);
    const getMentionAndUser = async () => {
      setError("");
      setVerificationError("");
      const reponse = await fetch(
        `/api/twitter/twitter-verification?signature=${
          updatedSignature || user.signature
        }`
      );
      const { mention } = await reponse.json();
      userMention = mention;

      if (!userMention) {
        setVerify(false);
        setError("Something went wrong, verify again");
        setPosted(false);
        setLoading(false);
        setVerifyButton(false);
        return;
      }

      const userResponse = await fetch(
        `/api/twitter/twitter-user?id=${userMention.author_id}`
      );
      let { user: twitterUser } = await userResponse.json();
      const { username: twitterUsername } = twitterUser;

      if (username.toLowerCase() !== "@" + twitterUsername.toLowerCase()) {
        setError("Username is not correct");
        setLoading(false);
        return;
      }

      let { data: supabseUser } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id);

      if (username !== supabseUser[0].twitterHandle) {
        setVerificationError("Please provide correct twitter handle");
        setLoading(false);
        return;
      }

      setError("");
      setVerificationError("");
      setLoading(false);
      setPosted(true);
      const data = await setVerifyUser(user.walletAddress);
      let parsedToken = JSON.stringify(data);
      localStorage.setItem("token", parsedToken);
      setVerify(true);
    };

    setTimeout(getMentionAndUser, 6000);
  };

  return (
    <div className={classes.InputWrapper}>
      {loading && <Spinner />}
      <input
        id="twitter"
        name="twitter"
        onChange={onChange}
        value={username}
        placeholder="@Username"
      />
      <span>{twitterInputError}</span>
      {!usernameIsValid && (
        <>
          <Button onClick={onClick} id="twitter-link" type="blue">
            Link Twitter
          </Button>
          {usernameError && <span>{usernameError}</span>}
        </>
      )}
      {usernameIsValid && !verifyButton && !posted && (
        <a onClick={openTwitter} id="post-button">
          Post to Tweeter
        </a>
      )}
      {verifyButton && (
        <>
          <Button onClick={verifyAccountHandler} id="verify-button" type="blue">
            Verify account
          </Button>
          {verificationError && <span>{verificationError}</span>}
        </>
      )}
      {error && <span>{error}</span>}
    </div>
  );
};

export default TwitterVerification;

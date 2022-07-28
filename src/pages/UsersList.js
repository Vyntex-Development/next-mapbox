import classes from "./UsersList.module.css";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../context-store/auth-context";
import supabase from "../supabase/supabase";
import Link from "../components/UI/Link";

const UsersList = ({ users }) => {
  const [appUsers, setUsers] = useState(users);
  const { address, enableDeploy } = useContext(AuthContext);

  useEffect(() => {
    const resetUsers = async () => {
      let { data: users } = await supabase.from("users").select("*");
      console.log(users);
      setUsers(users);
    };

    if (address || enableDeploy) {
      resetUsers();
    }
  }, [address, enableDeploy]);

  return (
    <>
      <div className={`${classes.UserListWrapper}`}>
        <ul className={`${classes.UsersList} container`}>
          <li>
            <span>Twitter handle</span>
            <span>Wallet address</span>
            <span>User city</span>
            <span>Created at</span>
            <span>Tweet ID</span>
            <span>Status</span>
          </li>
        </ul>
        <ul className={`${classes.UsersList} container`}>
          {appUsers.map(
            ({
              id,
              address,
              twitterHandle,
              verified,
              walletAddress,
              verified_timestamp,
              tweet_id,
            }) => {
              const date = new Date(verified_timestamp?.replace(" ", "T"))
                .toString()
                .split("(");
              const modifiedDate = date[0];
              return (
                <li key={id}>
                  <Link href={`https://twitter.com/${twitterHandle}`}>
                    {twitterHandle ? twitterHandle : ""}
                  </Link>

                  <span>{walletAddress}</span>
                  <span>{address}</span>
                  <span>{verified_timestamp ? modifiedDate : ""}</span>

                  <Link
                    href={`https://twitter.com/${twitterHandle}/status/${tweet_id}`}
                  >
                    {tweet_id || ""}
                  </Link>

                  <span
                    className={`${
                      verified ? classes.Verified : classes.NotVerified
                    }`}
                  >
                    {verified ? "Verified" : "Not verified"}
                  </span>
                </li>
              );
            }
          )}
        </ul>
      </div>
    </>
  );
};

export default UsersList;

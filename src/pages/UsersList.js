import classes from "./UsersList.module.css";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../context-store/auth-context";
import supabase from "../supabase/supabase";

const UsersList = ({ users }) => {
  const [appUsers, setUsers] = useState(users);

  const { address, enableDeploy } = useContext(AuthContext);

  useEffect(() => {
    const resetUsers = async () => {
      let { data: users } = await supabase.from("users").select("*");
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
            <span>User address</span>
            <span>Status</span>
          </li>
        </ul>
        <ul className={`${classes.UsersList} container`}>
          {appUsers.map(
            ({ id, address, twitterHandle, verified, walletAddress }) => {
              return (
                <li key={id}>
                  <span>{twitterHandle}</span>
                  <span>{walletAddress}</span>
                  <span>{address}</span>
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

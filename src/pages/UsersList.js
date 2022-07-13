import classes from "./UsersList.module.css";

const UsersList = ({ users }) => {
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
          {users.map(
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

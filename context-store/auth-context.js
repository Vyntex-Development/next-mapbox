import { createContext, useEffect, useState } from "react";
// import { getAllFavorites } from "../src/utils/utils";
import jwt from "jsonwebtoken";
import {
  getFavorites,
  getAllFavorites,
  removeFavorite,
  getUserId,
} from "../src/utils/utils";

const AuthContext = createContext({
  token: "",
  isAuth: false,
  user: null,
  favourites: [],
  updateFavorite: () => {},
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favourites, setAllFavorites] = useState([]);
  const isAuth = !!token;

  useEffect(() => {
    window.ethereum?.on("accountsChanged", (accounts) => {
      if (!accounts.length) {
        logoutHandler();
      }
    });
  }, []);

  useEffect(() => {
    if (update) {
      const getAll = async () => {
        const { favorites } = await getAllFavorites(
          `/api/favorites/getAllFavorites`,
          { user_id: getUserId() },
          "POST"
        );
        setAllFavorites(favorites);
      };
      getAll();
    }
    setUpdate(false);
  }, [update]);

  const loginHandler = async (token) => {
    let parsedToken = JSON.stringify(token);
    localStorage.setItem("token", parsedToken);
    setToken(token);
    const getAll = async () => {
      const { favorites } = await getAllFavorites(
        `/api/favorites/getAllFavorites`,
        { user_id: getUserId() },
        "POST"
      );
      console.log(favorites);
      setAllFavorites(favorites);
    };
    getAll();
  };

  const logoutHandler = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const updateFavorite = async (updateType, url, data, method) => {
    if (updateType === "add") {
      await getFavorites(url, data, method);
      setUpdate(true);
      return;
    }
    await removeFavorite(url, data, method);
    setUpdate(true);
  };

  const authValue = {
    login: loginHandler,
    logout: logoutHandler,
    updateFavorite: updateFavorite,
    token: token,
    isAuth: isAuth,
    user: user,
    favourites: favourites,
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      const jwtToken = JSON.parse(localStorage.getItem("token"));
      const { user_metadata } = jwt.decode(jwtToken);
      setUser({
        walletAddress: user_metadata?.user?.walletAddress,
        address: user_metadata?.user?.address,
        id: user_metadata?.user?.id,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={authValue}>
      {loading ? null : children}
    </AuthContext.Provider>
    // <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;

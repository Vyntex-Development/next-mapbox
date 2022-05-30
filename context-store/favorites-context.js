import { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import AuthContext from "./auth-context";
import jwt from "jsonwebtoken";

import {
  getFavorites,
  getAllFavorites,
  removeFavorite,
  getUserId,
} from "../src/utils/utils";

const FavoritesContext = createContext({
  allFavorites: [],
  favorites: false,
  userId: null,
  updateFavorites: () => {},
});

export const FavoritesContextProvider = ({ children }) => {
  const [update, setUpdate] = useState(false);
  const [favorites, setFavorites] = useState(false);
  const [userId, setUserId] = useState(null);
  const [allFavorites, setAllFavorites] = useState([]);
  const { isAuth } = useContext(AuthContext);

  const fetchFavorites = async () => {
    const jwtToken = JSON.parse(localStorage.getItem("token"));
    const { user_metadata } = jwt.decode(jwtToken);
    setUserId(user_metadata.user.id);
    const { favorites } = await getAllFavorites(
      `/api/favorites/getAllFavorites`,
      { user_id: user_metadata.user.id },
      "POST"
    );
    setAllFavorites(favorites);
  };

  useEffect(() => {
    if (update) {
      fetchFavorites();
      setUpdate(false);
    }
  }, [update]);

  useEffect(() => {
    if (isAuth) {
      fetchFavorites();
    } else {
      setUserId(null);
    }
  }, [isAuth]);

  const updateFavorites = async (updateType, url, data, method) => {
    if (updateType === "add") {
      await getFavorites(url, data, method);
      setUpdate(true);
      return;
    }
    await removeFavorite(url, data, method);
    setUpdate(true);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchFavorites();
      setFavorites(true);
    }
  }, []);

  const favoritesValue = {
    updateFavorites: updateFavorites,
    favorites: favorites,
    allFavorites: allFavorites,
    userId: userId,
  };

  return (
    <FavoritesContext.Provider value={favoritesValue}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext;

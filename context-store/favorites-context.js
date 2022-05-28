import { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import AuthContext from "./auth-context";
import {
  getFavorites,
  getAllFavorites,
  removeFavorite,
  getUserId,
} from "../src/utils/utils";

const FavoritesContext = createContext({
  allFavorites: [],
  favorites: false,
  updateFavorites: () => {},
});

export const FavoritesContextProvider = ({ children }) => {
  const [update, setUpdate] = useState(false);
  const [favorites, setFavorites] = useState(false);
  const [allFavorites, setAllFavorites] = useState([]);
  const { isAuth } = useContext(AuthContext);

  const fetchFavorites = async () => {
    const { favorites } = await getAllFavorites(
      `/api/favorites/getAllFavorites`,
      { user_id: getUserId() },
      "POST"
    );
    setAllFavorites(favorites);
  };

  useEffect(() => {
    if (update) fetchFavorites();
    setUpdate(false);
  }, [update]);

  useEffect(() => {
    if (isAuth) {
      fetchFavorites();
    }
  }, []);

  const updateFavorites = async (updateType, url, data, method) => {
    if (updateType === "add") {
      await getFavorites(url, data, method);
      setUpdate(true);
      return;
    }
    await removeFavorite(url, data, method);
    setUpdate(true);
  };

  const favoritesValue = {
    updateFavorites: updateFavorites,
    favorites: favorites,
    allFavorites: allFavorites,
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchFavorites();
      setFavorites(true);
    }
  }, []);

  return (
    <FavoritesContext.Provider value={favoritesValue}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext;

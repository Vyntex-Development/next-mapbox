import { createContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";

const AuthContext = createContext({
  token: "",
  isAuth: false,
  user: null,
  userId: null,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const isAuth = !!token;

  useEffect(() => {
    window.ethereum?.on("accountsChanged", (accounts) => {
      if (!accounts.length) {
        logoutHandler();
      }
    });
  }, []);

  const loginHandler = async (token) => {
    let parsedToken = JSON.stringify(token);
    localStorage.setItem("token", parsedToken);
    setToken(token);
    const jwtToken = JSON.parse(localStorage.getItem("token"));
    const { user_metadata } = jwt.decode(jwtToken);
    setUser({
      walletAddress: user_metadata?.user?.walletAddress,
      address: user_metadata?.user?.address,
      id: user_metadata?.user?.id,
    });
  };

  const logoutHandler = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setUserId(null);
  };

  const authValue = {
    login: loginHandler,
    logout: logoutHandler,
    token: token,
    isAuth: isAuth,
    user: user,
    userId: userId,
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLoading(true);
      setToken(localStorage.getItem("token"));
      const jwtToken = JSON.parse(localStorage.getItem("token"));
      const { user_metadata } = jwt.decode(jwtToken);
      setUserId(user_metadata?.user?.id);
      setUser({
        walletAddress: user_metadata?.user?.walletAddress,
        address: user_metadata?.user?.address,
        id: user_metadata?.user?.id,
      });
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={authValue}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

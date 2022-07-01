import { createContext, useEffect, useState } from "react";
import { getUserAddress } from "../src/utils/utils";
import jwt from "jsonwebtoken";

const AuthContext = createContext({
  token: "",
  address: false,
  isAuth: false,
  user: null,
  userId: null,
  recommendation: "",
  minutesDiff: 0,
  hasRecommendation: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(false);
  const [hasRecommendation, setHasRecommendation] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const [minutesDiff, setMinutesDiff] = useState(0);
  const isAuth = !!token;
  const hasAddress = !!address;

  useEffect(() => {
    window.ethereum?.on("accountsChanged", (accounts) => {
      if (!accounts.length) {
        logoutHandler();
      }
    });
  }, []);

  // useEffect(() => {
  //   setHasRecommendation(false);
  // }, [recommendation]);

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
    localStorage.removeItem("address");
    localStorage.removeItem("update");
    setToken(null);
    setUser(null);
    setUserId(null);
    setAddress(false);
  };

  const submitAddressHandler = () => {
    localStorage.setItem("address", true);
    setAddress(true);
  };

  const onRecommendationHandler = (city) => {
    setHasRecommendation(true);
    setRecommendation(city);
  };

  const updateAddressHandler = () => {
    localStorage.setItem("update", true);
  };

  const authValue = {
    login: loginHandler,
    logout: logoutHandler,
    submitAddress: submitAddressHandler,
    updateAddress: updateAddressHandler,
    onRecommendation: onRecommendationHandler,
    recommendation: recommendation,
    token: token,
    isAuth: isAuth,
    user: user,
    userId: userId,
    hasAddress: hasAddress,
    minutesDiff: minutesDiff,
    hasRecommendation: hasRecommendation,
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLoading(true);
      setToken(localStorage.getItem("token"));
      setAddress(localStorage.getItem("address"));
      setHasRecommendation(false);
      const jwtToken = JSON.parse(localStorage.getItem("token"));
      const { user_metadata } = jwt.decode(jwtToken);
      const { user } = user_metadata;

      let timeOfUserRegistration = new Date(user.created_at) / 1000;
      let currentTime = new Date().getTime() / 1000; //1440516958
      let minutes = Math.floor((currentTime - timeOfUserRegistration) / 60);
      setMinutesDiff(minutes);

      let userData = {
        walletAddress: user?.walletAddress,
        id: user?.id,
        created_at: user.created_at,
      };
      setUserId(user?.id);
      if (
        !user?.address ||
        (user?.address && JSON.parse(localStorage.getItem("update")))
      ) {
        const getAddress = async () => {
          const userAddress = await getUserAddress(user?.walletAddress);

          setUser({
            ...userData,
            address: userAddress,
          });
        };
        getAddress();
      } else {
        setUser({
          ...userData,
          address: user?.address,
        });
      }

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

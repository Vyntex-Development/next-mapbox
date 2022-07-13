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
  enableDeploy: false,
  login: (token) => {},
  logout: () => {},
  onDeploy: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(false);
  const [enableDeploy, setEnableDeploy] = useState(false);
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
      verified: user_metadata?.user?.verified,
      signature: user_metadata?.user?.signature,
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

  const updateAddressHandler = ({ address, path }) => {
    let userData = {
      walletAddress: user?.walletAddress,
      signature: user?.signature,
      id: user?.id,
      created_at: user.created_at,
    };
    setUser({
      ...userData,
      address: address,
      path: path,
    });
    localStorage.setItem("update", true);
  };

  const onDeployHandler = () => {
    setEnableDeploy(true);
  };

  const authValue = {
    login: loginHandler,
    logout: logoutHandler,
    submitAddress: submitAddressHandler,
    updateAddress: updateAddressHandler,
    onRecommendation: onRecommendationHandler,
    onDeploy: onDeployHandler,
    recommendation: recommendation,
    token: token,
    isAuth: isAuth,
    enableDeploy: enableDeploy,
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
        signature: user?.signature,
        id: user?.id,
        created_at: user.created_at,
        verified: user.verified,
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

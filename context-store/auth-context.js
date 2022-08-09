import { createContext, useEffect, useState } from "react";
import { getUserAddress } from "../src/utils/utils";
import axios from "axios";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";

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
  ipData: {},
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
  const [timeInfo, setTimeInfo] = useState({
    timeDifference: 0,
    dateOfNextAvailableAddressChange: "",
  });
  const [ipData, setIpData] = useState({});
  const router = useRouter();
  const isAuth = !!token;
  const hasAddress = !!address;

  const getData = async () => {
    const { data } = await axios.get("https://geolocation-db.com/json/");
    const { IPv4, country_name, latitude, longitude, state, country_code } =
      data;
    const modifiedIpData = {
      ...ipData,
      ipAddress: IPv4,
      country_name: country_name,
      lat: latitude,
      lng: longitude,
      type: "Feature",
      text: state,
      place_type: ["place"],
      short_code: country_code,
    };
    setIpData(modifiedIpData);

    router.pathname === "/" && setHasRecommendation(true);
    router.pathname === "/" && setRecommendation(modifiedIpData);
  };

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
      ipCountry: user_metadata?.user?.ipCountry,
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
    setEnableDeploy(false);
  };

  const submitAddressHandler = () => {
    localStorage.setItem("address", true);
    setAddress(true);
  };

  const onRecommendationHandler = (city) => {
    router.pathname === "/" && setHasRecommendation(true);
    router.pathname === "/" && setRecommendation(city);
  };

  const updateAddressHandler = ({ address }) => {
    let userData = {
      walletAddress: user?.walletAddress,
      signature: user?.signature,
      id: user?.id,
      verified: user?.verified,
      created_at: user.created_at,
    };
    setUser({
      ...userData,
      address: address,
      // path: path,
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
    address: address,
    token: token,
    isAuth: isAuth,
    enableDeploy: enableDeploy,
    user: user,
    userId: userId,
    hasAddress: hasAddress,
    timeInfo: timeInfo,
    hasRecommendation: hasRecommendation,
    ipData: ipData,
  };

  const addMonths = (date, months) => {
    let newDate = new Date(date);
    var day = newDate.getDate();
    newDate.setMonth(newDate.getMonth() + +months);
    if (newDate.getDate() != day) newDate.setDate(0);
    return newDate;
  };

  const padTo2Digits = (num) => {
    return num.toString().padStart(2, "0");
  };

  const formatDate = (date) => {
    return [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join("/");
  };

  useEffect(() => {
    getData();
    if (localStorage.getItem("token")) {
      setLoading(true);
      setToken(localStorage.getItem("token"));
      setAddress(localStorage.getItem("address"));
      setHasRecommendation(false);
      const jwtToken = JSON.parse(localStorage.getItem("token"));
      const { user_metadata } = jwt.decode(jwtToken);
      const { user } = user_metadata;
      let timeOfUserRegistration = new Date(user.created_at) / 1000;
      addMonths(user.created_at, 6);
      let dateAfterSixMonths = addMonths(user.created_at, 6);
      const formatedDate = formatDate(dateAfterSixMonths);
      let currentTime = new Date().getTime() / 1000; //1440516958
      let minutes = Math.floor((currentTime - timeOfUserRegistration) / 60);
      setTimeInfo({
        ...timeInfo,
        timeDifference: minutes,
        dateOfNextAvailableAddressChange: formatedDate,
      });

      let userData = {
        walletAddress: user?.walletAddress,
        signature: user?.signature,
        id: user?.id,
        created_at: user.created_at,
        verified: user.verified,
        ipCountry: user_metadata?.user?.ipCountry,
        // path: "/",
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

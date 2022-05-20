import { createContext, useEffect, useState } from "react";
// import useHTTP from "../components/hooks/use-http";

const AuthContext = createContext({
  token: "",
  isAuth: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  //   const [loading, setLoading] = useState(true);

  //   const { httpClient, responseData: accessToken } = useHTTP();

  const isAuth = !!token;

  useEffect(() => {
    window.ethereum.on("accountsChanged", (accounts) => {
      if (!accounts.length) {
        logoutHandler();
      }
    });
  }, []);

  //   const updateToken = async () => {
  //     if (token) {
  //       let parsedToken = JSON.parse(token);

  //       httpClient.sendRequest("POST", "/token/refresh/", null, {
  //         refresh: parsedToken?.refresh,
  //       });
  //     }

  //     if (loading) {
  //       setLoading(false);
  //     }
  //   };

  const loginHandler = (token) => {
    let parsedToken = JSON.stringify(token);
    localStorage.setItem("token", parsedToken);
    setToken(token);
  };

  const logoutHandler = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const authValue = {
    login: loginHandler,
    logout: logoutHandler,
    token: token,
    isAuth: isAuth,
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  //   useEffect(() => {
  //     if (accessToken) {
  //       let parsedToken = JSON.parse(token);
  //       loginHandler(
  //         JSON.stringify({
  //           ...parsedToken,
  //           access: accessToken.access,
  //         })
  //       );
  //     }
  //   }, [accessToken, loading]);

  //   useEffect(() => {
  //     if (loading) {
  //       updateToken();
  //     }

  //     let fiftySeconds = 1000 * 50;

  //     if (token) {
  //       const id = setInterval(() => {
  //         updateToken();
  //       }, fiftySeconds);

  //       return () => {
  //         clearInterval(id);
  //       };
  //     }
  //   }, [token]);

  return (
    // <AuthContext.Provider value={authValue}>
    //   {loading ? null : children}
    // </AuthContext.Provider>
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;

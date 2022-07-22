const AIRTABLE_ACCESS_KEY = process.env.AIRTABLE_ACCESS_KEY;
const MAPBOX_TOKEN_PRODUCTION = process.env.MAPBOX_TOKEN_PRODUCTION;
import { ethers } from "ethers";
import jwt from "jsonwebtoken";

const fetchData = async (URL, data, method) => {
  const options = {
    endpoint: URL,
    method: method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(URL, method === "POST" ? options : null);
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error("Fetch wasn't successful");
  }

  return responseData;
};

const fetchDataFromTwitter = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
    },
  });
  if (!response.ok) {
    throw new Error("Fetch wasn't successful");
  }
  const { data } = await response.json();
  return data;
};

export const getAllCountries = async () => {
  let listOfAllCountries = [];
  let offset = null;
  let responseData = await fetchData(
    `https://api.airtable.com/v0/appEQgGYRpKWhBUQj/Countries?api_key=${AIRTABLE_ACCESS_KEY}`,
    null,
    "GET"
  );

  if (listOfAllCountries.length === 0) {
    listOfAllCountries = [...responseData.records];
    offset = responseData.offset;
    while (offset) {
      let responseData = await fetchData(
        `https://api.airtable.com/v0/appEQgGYRpKWhBUQj/Countries?api_key=${AIRTABLE_ACCESS_KEY}&offset=${offset}`,
        null,
        "GET"
      );
      offset = responseData.offset;
      listOfAllCountries.push(...responseData.records);
    }
  }
  return listOfAllCountries ? listOfAllCountries : [];
};

export const getAllCities = async () => {
  let listOfAllCities = [];
  let offset = null;
  let response = await fetch(
    `https://api.airtable.com/v0/appEQgGYRpKWhBUQj/Cities?api_key=${AIRTABLE_ACCESS_KEY}`
  );
  let responseData = await response.json();

  if (listOfAllCities.length === 0) {
    listOfAllCities = [...responseData.records];
    offset = responseData.offset;
    while (offset) {
      let response = await fetch(
        `https://api.airtable.com/v0/appEQgGYRpKWhBUQj/Cities?api_key=${AIRTABLE_ACCESS_KEY}&offset=${offset}`
      );
      let responseData = await response.json();
      offset = responseData.offset;
      listOfAllCities.push(...responseData.records);
    }
    let listOfCitiesWithCountryId = listOfAllCities.filter((obj) =>
      obj.fields.hasOwnProperty("Country")
    );
    listOfAllCities = [...listOfCitiesWithCountryId];
  }
  return listOfAllCities ? listOfAllCities : [];
};

export const getSingleDestiantion = async (URL, data, method) => {
  const singleDestination = await fetchData(URL, data, method);
  return singleDestination ? singleDestination : [];
};

export const getDestinationCoordinates = async (destination) => {
  const coordinates = await fetchData(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${destination}.json?access_token=${MAPBOX_TOKEN_PRODUCTION}`,
    null,
    "GET"
  );
  return coordinates.features[0].geometry.coordinates
    ? coordinates.features[0].geometry.coordinates
    : [];
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getID = async (URL, data, mathod) => {
  const response = await getSingleDestiantion(URL, data, mathod);
  return response;
};

export const getMapboxSearchResults = async (URL, data, method) => {
  const { features } = await fetchData(URL, data, method);
  return features ? features : [];
};

export const getAuth = async (URL, data, method) => {
  const response = await fetchData(URL, data, method);
  return response ? response : [];
};

export const getFavorites = async (URL, data, method) => {
  const response = await fetchData(URL, data, method);
  return response ? response : [];
};

export const getAllFavorites = async (URL, data, method) => {
  const response = await fetchData(URL, data, method);
  return response ? response : [];
};

export const removeFavorite = async (URL, data, method) => {
  const response = await fetchData(URL, data, method);
  return response ? response : [];
};

export const deployDao = async (URL, data, method) => {
  const response = await fetchData(URL, data, method);
  return response ? response : [];
};

export const shorten = (s, max) => {
  if (!s) return;
  return s.length > max
    ? s.substring(0, max / 2 - 1) +
        "..." +
        s.substring(s.length - max / 2 + 2, s.length)
    : s;
};

export const connectMetamaskHandler = async (str) => {
  if (!window.ethereum) {
    window.open(
      "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
      "_blank"
    );
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);

  const signer = provider.getSigner();
  const walletAddress = await signer.getAddress();

  let response = await fetch("/api/auth/nonce", {
    method: "POST",
    body: JSON.stringify({ walletAddress, str }),
    headers: {
      "Content-type": "application/json",
    },
  });

  const { nonce } = await response.json();
  const signature = await signer.signMessage(nonce);

  let walletResponse = await fetch("/api/auth/wallet", {
    method: "POST",
    body: JSON.stringify({ walletAddress, nonce, signature }),
    headers: {
      "Content-type": "application/json",
    },
  });
  const { data: userData, token } = await walletResponse.json();

  return {
    walletAddress,
    token,
    userData,
    signature,
  };
};

export const getUserId = () => {
  if (localStorage.getItem("token")) {
    const jwtToken = JSON.parse(localStorage.getItem("token"));
    const { user_metadata } = jwt.decode(jwtToken);
    return user_metadata?.user?.id;
  }
};

export const getUserAddress = async (walletAddress) => {
  const response = await fetch(
    "/api/auth/find-address?walletAddress=" + walletAddress
  );
  const { address } = await response.json();
  return address;
};

export const setNewAddress = async (search, walletAddress, user) => {
  const response = await fetch("/api/auth/address", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      address: search,
      walletAddress: user.walletAddress || walletAddress,
    }),
  });
  const { address: userAddress } = await response.json();
  return userAddress;
};

export const setVerifyUser = async (walletAddress) => {
  const response = await fetch("/api/auth/verify", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      walletAddress,
    }),
  });
  const { token } = await response.json();
  return token;
};

export const setTwitterHandle = async (twitterHandle, walletAddress) => {
  const response = await fetch("/api/auth/twitter", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      twitterHandle,
      walletAddress,
    }),
  });
  const { tweterHandle } = await response.json();
};

export const getclientID = async () => {
  const id = await fetchDataFromTwitter(
    `https://api.twitter.com/2/users/by/username/vyntex_`
  );
  return id;
};

export const getMentions = async (id) => {
  const mentions = await fetchDataFromTwitter(
    `https://api.twitter.com/2/users/${id}/mentions?max_results=15&expansions=author_id`
  );
  return mentions;
};

export const filterMentions = async (mentions, signature) => {
  const mention = mentions.find((mention) => mention.text.includes(signature));
  return mention;
};

export const getTwitterUser = async (id) => {
  const user = await fetchDataFromTwitter(
    `https://api.twitter.com/2/users/${id}`
  );
  return user;
};

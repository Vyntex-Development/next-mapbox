const AIRTABLE_ACCESS_KEY = process.env.AIRTABLE_ACCESS_KEY;
const MAPBOX_TOKEN_PRODUCTION = process.env.MAPBOX_TOKEN_PRODUCTION;
import { ethers } from "ethers";

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

export const getCountryCoordinates = async (destination) => {
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

export const shorten = (s, max) => {
  if (!s) return;
  return s.length > max
    ? s.substring(0, max / 2 - 1) +
        "..." +
        s.substring(s.length - max / 2 + 2, s.length)
    : s;
};

export const connectMetamaskHandler = async () => {
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
    body: JSON.stringify({ walletAddress }),
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

  console.log(userData, token);

  return {
    walletAddress,
    token,
    userData,
  };
};

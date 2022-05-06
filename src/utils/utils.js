const AirtableData = async (query, method) => {
  const URL = `https://api.airtable.com/v0/appEQgGYRpKWhBUQj/${query}?api_key=keykhSTwhPsT0cdej`;

  const options = {
    endpoint: URL,
    method: method,
    headers: {
      //   "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    // body: JSON.stringify({ query }),
  };

  const response = await fetch(URL, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error("Fetch wasn't successful");
  }

  return data;
};

export const getAllCountries = async () => {
  const response = await AirtableData("Countries", "GET");
  return response ? response : [];
};

export const getSingleCountry = async (name) => {
  console.log(name);
};

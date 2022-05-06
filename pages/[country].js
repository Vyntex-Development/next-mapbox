import CountryPage from "../src/pages/CountryPage";
import { getSingleCountry } from "../src/utils/utils";

const country = (props) => {
  let countryDetails = props.data[0]?.records[0];
  let cityDetails = props.data[1]?.records;
  return (
    <CountryPage countryDetails={countryDetails} cityDetails={cityDetails} />
  );
};

export async function getStaticProps(context) {
  //const country = await getSingleCountry(context.params.country);
  let data = {
    name: context.params.country,
    type: "country",
    lng: null,
    lat: null,
  };
  const response = await fetch(`https://nearestdao.herokuapp.com`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const responseData = await response.json();
  return {
    props: {
      data: responseData,
    },
    revalidate: 100,
  };
}

export async function getStaticPaths() {
  // const categories = await getAllCategories();
  // const paths = categories.map((category) => {
  //   return { params: { category: category.node.handle } };
  // });
  return {
    paths: [{ params: { country: "afghanistan" } }],
    fallback: false, // false or 'blocking'
  };
}

export default country;

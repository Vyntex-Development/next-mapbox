import CountryPage from "../src/pages/CountryPage";
import { getSingleDestiantion } from "../src/utils/utils";
import { getAllCountries } from "../src/utils/utils";
import SEO from "../src/components/SEO/SEO";

const Country = ({ details }) => {
  const { country, city } = details;
  return (
    <>
      <SEO title={country.fields["Name"]} />
      <CountryPage countryDetails={country} listOfCities={city.records} />
    </>
  );
};

export async function getStaticProps(context) {
  const details = await getSingleDestiantion(
    "https://nearestdao.herokuapp.com",
    {
      id: context.params.countryID,
      type: "country",
      lng: null,
      lat: null,
    },
    "POST"
  );

  return {
    props: {
      details,
    },
    revalidate: 100,
  };
}

export async function getStaticPaths() {
  const allCountries = await getAllCountries();
  const paths = allCountries.map((country) => {
    return {
      params: {
        countryID: country.id,
      },
    };
  });
  return {
    paths: paths,
    fallback: false, // false or 'blocking'
  };
}

export default Country;

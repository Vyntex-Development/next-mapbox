import CountryPage from "../src/pages/CountryPage";
import { getSingleDestiantion } from "../src/utils/utils";
import { getAllCountries } from "../src/utils/utils";
import SEO from "../src/components/SEO/SEO";

const country = ({ country }) => {
  console.log(country);
  return (
    <>
      {/* <div>Drzava</div> */}
      <SEO title={country[0].fields["Name"]} />
      <CountryPage
        countryDetails={country[0]}
        listOfCities={country[1]?.records}
      />
    </>
  );
};

export async function getStaticProps(context) {
  const country = await getSingleDestiantion(
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
      country,
    },
    revalidate: 100,
  };
}

export async function getStaticPaths() {
  const allCountries = await getAllCountries();
  console.log(allCountries);
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

export default country;

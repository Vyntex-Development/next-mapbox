import CityPage from "../src/pages/CityPage";
import SEO from "../src/components/SEO/SEO";
import { getSingleDestiantion } from "../src/utils/utils";
import { getAllCities } from "../src/utils/utils";

const City = ({ data }) => {
  const { city, country } = data;
  return (
    <>
      <SEO title={`${country.fields["Name"]} - ${city.fields.city}`}></SEO>
      <CityPage countryDetails={country} cityDetails={city} />
    </>
  );
};

export async function getStaticProps(context) {
  let cityId = context.params.city[1];

  const city = await getSingleDestiantion(
    "https://nearestdao.herokuapp.com",
    {
      id: cityId,
      type: "place",
    },
    "POST"
  );

  return {
    props: {
      data: city,
    },
    revalidate: 100,
  };
}

export async function getStaticPaths() {
  const allCities = await getAllCities();
  const modifiedCities = allCities.filter(
    (city) => !city.hasOwnProperty("value")
  );
  const allPaths = [];
  modifiedCities.forEach((city) => {
    console.log(city);
    allPaths.push({
      params: {
        city: [city.fields["Country"][0], `${city.id}`],
      },
    });
  });

  return {
    paths: allPaths,
    fallback: false, // false or 'blocking'
  };
}

export default City;

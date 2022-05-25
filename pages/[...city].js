import CityPage from "../src/pages/CityPage";
import SEO from "../src/components/SEO/SEO";
import { getSingleDestiantion } from "../src/utils/utils";
import { getAllCities } from "../src/utils/utils";
import { capitalizeFirstLetter } from "../src/utils/utils";

const City = ({ data }) => {
  return (
    <>
      {/* <SEO
        title={`${data[1].fields?.["Name"]} - ${data[0].records[0]?.fields?.["city"]}`}
      ></SEO> */}
      <CityPage countryDetails={data[1]} cityDetails={data[0].records[0]} />
    </>
  );
};

export async function getStaticProps(context) {
  let cityParams = context.params.city[1];
  let splittedQuery = cityParams.split("&");
  let name = splittedQuery[0];
  let nameWithCapitalizedFirstLetter = capitalizeFirstLetter(name);
  let lat = splittedQuery[1].split("=")[1];
  let lng = splittedQuery[2].split("=")[1];

  const city = await getSingleDestiantion(
    "https://nearestdao.herokuapp.com",
    {
      name: nameWithCapitalizedFirstLetter,
      type: "place",
      lng,
      lat,
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
  const allPaths = [];
  allCities.forEach((city) => {
    allPaths.push({
      params: {
        city: [
          city.fields["Country"][0],
          `${city.fields.city_ascii
            .replace("`", "")
            .toLowerCase()
            .split(" ")
            .join("-")}&lat=${city.fields.lat}&lng=${city.fields.lng}`,
        ],
      },
    });
  });

  return {
    paths: allPaths,
    fallback: false, // false or 'blocking'
  };
}

export default City;

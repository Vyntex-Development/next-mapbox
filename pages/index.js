import HomePage from "../src/pages/HomePage";
import SEO from "../src/components/SEO/SEO";
// import { getAllCities } from "../src/utils/utils";
// import { useEffect } from "react";

const homePage = () => {
  // useEffect(() => {
  //   const getAll = async () => {
  //     const allCities = await getAllCities();
  //     allCities.forEach((city, index) => {
  //       console.log(city.fields);
  //       console.log(index + 1);
  //     });
  //   };

  //   getAll();
  // }, []);

  return (
    <>
      <SEO title="Homepage" />
      <HomePage />
    </>
  );
};

export default homePage;

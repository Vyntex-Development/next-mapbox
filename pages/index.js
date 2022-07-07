import HomePage from "../src/pages/HomePage";
import SEO from "../src/components/SEO/SEO";

const homePage = () => {
  return (
    <>
      <SEO title="Homepage" />
      <HomePage />
    </>
  );
};

export default homePage;

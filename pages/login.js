import SEO from "../src/components/SEO/SEO";
import LoginPage from "../src/pages/LoginPage";

const loginPage = () => {
  return (
    <>
      <SEO title="Login" />
      <LoginPage />
    </>
  );
};

export default loginPage;

import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main>
        {children}
        <Footer />
      </main>
    </>
  );
};

export default Layout;

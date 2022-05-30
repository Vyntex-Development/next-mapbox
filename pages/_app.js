import "../styles/globals.css";
import Layout from "../src/components/Layout";
import { MetaMaskProvider } from "metamask-react";
import { AuthContextProvider } from "../context-store/auth-context";
import { FavoritesContextProvider } from "../context-store/favorites-context";

function MyApp({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <FavoritesContextProvider>
        <MetaMaskProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MetaMaskProvider>
      </FavoritesContextProvider>
    </AuthContextProvider>
  );
}

export default MyApp;

import "../styles/globals.css";
import Layout from "../src/components/Layout";
import { MetaMaskProvider } from "metamask-react";
import { AuthContextProvider } from "../context-store/auth-context";

function MyApp({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <MetaMaskProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MetaMaskProvider>
    </AuthContextProvider>
  );
}

export default MyApp;

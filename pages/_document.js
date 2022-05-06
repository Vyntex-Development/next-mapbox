import Document, { Html, Head, Main, NextScript } from "next/document";

class CustomDocument extends Document {
  render = () => (
    <Html lang="en">
      <Head>
        <link
          rel="preload"
          href="/fonts/VCR_OSD_MONO_1.001.ttf"
          as="font"
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default CustomDocument;

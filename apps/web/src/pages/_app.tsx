import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import Head from "next/head";
import { CookiesProvider } from "react-cookie";
import theme from "../theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          initialColorMode: "light",
        }}
      >
        <CookiesProvider>
          <Head>
            <title>Hyqueue</title>
          </Head>
          <Component {...pageProps} />
        </CookiesProvider>
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default MyApp;

import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import { CookiesProvider } from 'react-cookie';
import theme from '../theme'
import Head from 'next/head'
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          initialColorMode: 'light',
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
  )
}

export default MyApp

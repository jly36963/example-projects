// package imports
import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';
// components
import MainNavbar from '../components/main-navbar';
// theme
import theme from '../theme/theme';

// component
const App = ({ Component, pageProps }: AppProps) => {
  // jsx
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* navbar */}
      <MainNavbar />
      {/* head */}
      <Head>
        <title>TS Next.js Example</title>
      </Head>
      {/* component */}
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// App.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default App;

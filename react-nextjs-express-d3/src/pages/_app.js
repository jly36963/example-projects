import React, { useState, useEffect, useMemo } from "react";
// next
import Head from "next/head";
// components
import MainNavbar from "../components/main-navbar";
import LoadingScreen from "../components/loading-screen";
// material-ui
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline } from "@material-ui/core";
// theme
import { lightTheme, darkTheme } from "../theme/theme";
// utils
import storage from "../utils/storage";

// component
const App = ({ Component, pageProps }) => {
  // initial theme (SSR)
  const [useDarkTheme, setUseDarkTheme] = useState(true);
  const theme = useMemo(() => {
    return useDarkTheme ? darkTheme : lightTheme;
  }, [useDarkTheme]);
  // update theme
  useEffect(() => {
    let useDarkThemeLS = storage.getItem("useDarkTheme");
    if (typeof useDarkThemeLS !== "boolean") {
      useDarkThemeLS = true;
      storage.setItem("useDarkTheme", true);
    }
    if (!useDarkThemeLS) {
      setUseDarkTheme(useDarkThemeLS);
    }
  }, []);

  // loading screen
  const [useLoadingScreen, setUseLoadingScreen] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setUseLoadingScreen(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // jsx
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* loading screen */}
      {useLoadingScreen && <LoadingScreen />}
      {/* navbar */}
      <MainNavbar
        useDarkTheme={useDarkTheme}
        setUseDarkTheme={setUseDarkTheme}
      />
      {/* head */}
      <Head>
        <title>React Express Example</title>
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

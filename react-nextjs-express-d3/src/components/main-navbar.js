// react imports
import React, { useState } from "react";
// material-ui imports
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
} from "@material-ui/core";
// icons
import MenuIcon from "@material-ui/icons/Menu";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import HomeIcon from "@material-ui/icons/Home";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
// Router
import Router from "next/router";
import Link from "next/link";
// utils
import storage from "../utils/storage";

// styles
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: "relative",
    zIndex: theme.zIndex.drawer + 1, // https://stackoverflow.com/questions/51066461/drawer-covers-appbar-in-material-ui
  },
  menuIcon: {
    margin: theme.spacing(1),
  },
  unstyledLink: {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
  grow: {
    flexGrow: 1,
  },
}));

// component
const MainNavbar = ({ useDarkTheme, setUseDarkTheme }) => {
  // --------------
  // state
  // --------------

  // use custom hook (material-ui)
  const classes = useStyles();

  // menu
  const [anchorEl, setAnchorEl] = useState(null);

  // pretend user
  const currentUser = null;

  // --------------
  // ui
  // --------------

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // --------------
  // event
  // --------------

  // home
  const handleHome = () => {
    console.log("Redirecting to Home Page!");
    Router.push("/");
  };

  // login
  const handleLogin = () => {
    console.log("Redirecting to Login Page!");
  };

  // darkstate
  const handleDarkSwitchChange = () => {
    const newThemeState = !useDarkTheme;
    storage.setItem("useDarkTheme", newThemeState);
    setUseDarkTheme(newThemeState);
  };

  // handle logout button press
  const handleSignOut = async (e) => {
    console.log("Signing out!");
  };

  return (
    <Box className={classes.root}>
      <AppBar color="inherit" position="fixed">
        <Toolbar>
          <Link href={`/`}>
            <a className={classes.unstyledLink}>
              <Typography
                variant="h5"
                onClick={() => Router.push("/")}
                className={classes.title}
              >
                Next / Express Example
              </Typography>
            </a>
          </Link>
          {/* pushes title left, buttons right */}
          <div className={classes.grow} />
          {/* menu */}
          <IconButton onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            getContentAnchorEl={null}
          >
            {/* menu items */}
            <MenuItem onClick={handleDarkSwitchChange}>
              <Brightness4Icon className={classes.menuIcon} />
              Theme
            </MenuItem>
            <MenuItem onClick={handleHome}>
              <HomeIcon className={classes.menuIcon} />
              Home
            </MenuItem>
            {currentUser ? (
              <MenuItem onClick={handleSignOut}>
                <ExitToAppIcon className={classes.menuIcon} />
                Log Out
              </MenuItem>
            ) : (
              <MenuItem onClick={handleLogin}>
                <AccountCircleIcon className={classes.menuIcon} />
                Log In
              </MenuItem>
            )}
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default MainNavbar;

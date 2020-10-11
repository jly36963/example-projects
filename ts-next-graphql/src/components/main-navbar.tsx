// react imports
import React from 'react';
// material-ui imports
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Theme,
} from '@material-ui/core';
// icons
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
// Router
import Router from 'next/router';
import Link from 'next/link';

// styles
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    position: 'relative',
    zIndex: theme.zIndex.drawer + 1, // https://stackoverflow.com/questions/51066461/drawer-covers-appbar-in-material-ui
  },
  menuIcon: {
    margin: theme.spacing(1),
  },
  unstyledLink: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
  grow: {
    flexGrow: 1,
  },
}));

// component
const MainNavbar: React.FC = () => {
  // --------------
  // state
  // --------------

  // use custom hook (material-ui)
  const classes = useStyles();

  // menu
  const [anchorEl, setAnchorEl] = React.useState(null);

  // pretend user
  const currentUser: any = null;

  // --------------
  // event
  // --------------

  const handleMenuOpen = (e: React.SyntheticEvent) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // home
  const handleHome = () => {
    console.log('Redirecting to Home Page!');
    Router.push('/');
  };

  // login
  const handleLogin = () => {
    console.log('Redirecting to Login Page!');
  };

  // handle logout button press
  const handleSignOut = async (e: React.SyntheticEvent) => {
    console.log('Signing out!');
  };

  return (
    <Box className={classes.root}>
      <AppBar color="inherit" position="fixed">
        <Toolbar>
          <Link href={`/`}>
            <a className={classes.unstyledLink}>
              <Typography variant="h5" onClick={() => Router.push('/')}>
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
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            getContentAnchorEl={null}
          >
            {/* menu items */}
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

import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    height: '100vh',
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth: '640px',
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: '768px',
    },
    [theme.breakpoints.up('lg')]: {
      maxWidth: '1024px',
    },
  },
  main: {
    padding: theme.spacing(2),
    textAlign: 'center',
    margin: 'auto',
    borderWidth: '1px',
    borderRadius: '.25rem',
  },
}));

const FlexContainer: React.FC = ({ children }) => {
  // mui styles hook
  const classes = useStyles();
  // jsx
  return (
    <div className={classes.container}>
      <div className={classes.main}>{children}</div>
    </div>
  );
};

export default FlexContainer;

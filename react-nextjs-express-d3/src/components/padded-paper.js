import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Paper } from "@material-ui/core";

const useStyles = makeStyles(
  (theme) => ({
    paper: {
      padding: theme.spacing(2),
    },
  }),
  { withTheme: true }
);

const PaddedPaper = (props) => {
  // mui styles hook
  const classes = useStyles();
  // jsx
  return (
    <Paper className={classes.paper} {...props}>
      {props.children}
    </Paper>
  );
};

export default PaddedPaper;

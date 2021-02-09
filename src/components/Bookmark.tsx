import {
  Tooltip,
  Grid,
  Paper,
  Typography,
  makeStyles,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  paper: {
    width: "5rem",
    height: "5rem",
  },
  outerContainer: {
    margin: "1rem",
    padding: "1rem",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
}));

const Bookmark = ({ key }) => {
  const classes = useStyles();

  return (
    <Tooltip title="https://google.com" arrow>
      <Grid item>
        <Paper elevation={3} key={key} className={classes.paper}>
          <img src="logo192.png" alt="logo" className={classes.logo}></img>
        </Paper>

        <Typography variant="subtitle1">Title</Typography>
      </Grid>
    </Tooltip>
  );
};

export default Bookmark;

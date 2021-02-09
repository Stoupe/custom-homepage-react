import {
  Paper,
  Grid,
  Typography,
  makeStyles,
  Tooltip,
} from "@material-ui/core";
import React from "react";
import Bookmark from "./Bookmark";

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

const BookmarkCategory = (): JSX.Element => {
  const classes = useStyles();
  return (
    <Paper className={classes.outerContainer} variant="outlined">
      <Grid container justifyContent="center">
        <Grid item>
          <Grid container spacing={3} justifyContent="center">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((key) => (
              <Bookmark
                key={key}
                title="Google"
                url="https://google.com"
                img="google.svg"
              />
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BookmarkCategory;

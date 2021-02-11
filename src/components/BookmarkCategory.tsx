import { Grid, makeStyles, Paper, withStyles } from "@material-ui/core";
import React from "react";
import Bookmark from "./Bookmark";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "1rem",
    padding: "1rem",
  },
}));

const s = {
  borderRadius: "2rem",
  backgroundColor: "#eee",
};

const BookmarkCategory = ({ bookmarks }: { bookmarks?: {} }): JSX.Element => {
  console.log(bookmarks);
  const classes = useStyles();

  return (
    <Paper style={s} className={classes.root} variant="outlined">
      <Grid container justifyContent="center">
        <Grid item>
          <Grid container spacing={3} justifyContent="center">
            {Object.keys(bookmarks).map((key) => (
              <Bookmark
                key={key}
                title={bookmarks[key].title}
                url={bookmarks[key].url}
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

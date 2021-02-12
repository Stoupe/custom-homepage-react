import {
  Grid,
  makeStyles,
  Paper,
  Typography,
  withStyles,
} from "@material-ui/core";
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

const BookmarkCategory = ({
  category,
  bookmarks,
}: {
  category: string;
  bookmarks?: Record<string, any>;
}): JSX.Element => {
  // console.log(bookmarks);
  const classes = useStyles();

  return (
    <Paper style={s} className={classes.root} variant="outlined">
      <Typography variant="h5">{category}</Typography>
      <Grid container justifyContent="center">
        <Grid item>
          <Grid container spacing={3} justifyContent="center">
            {Object.entries(bookmarks).map(([key, value]) => {
              console.log(value);
              return (
                <Bookmark
                  key={key}
                  title={value.title}
                  url={value.url}
                  img="google.svg"
                />
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BookmarkCategory;

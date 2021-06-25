import { Box, Grid, Paper, Typography } from "@material-ui/core";
import React from "react";
import Bookmark from "./Bookmark";
import { makeStyles } from "@material-ui/styles";
import { FirebaseBookmark } from "./Types";

const useStyles = makeStyles((theme) => ({
  root: {},
  container: {},
  title: {
    // textAlign: "center",
  },
}));

const BookmarkCategory = ({
  category,
  bookmarks,
}: {
  category: string;
  bookmarks?: Record<string, FirebaseBookmark>;
}): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <Typography variant="h5">{category}</Typography>
      </div>
      <Paper className={classes.container}>
        <Grid container justifyContent="center">
          <Grid item>
            <Grid container spacing={3} justifyContent="center">
              {Object.entries(bookmarks).map(([key, value]) => {
                return <Bookmark key={key} uid={key} bookmark={value} />;
              })}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default BookmarkCategory;

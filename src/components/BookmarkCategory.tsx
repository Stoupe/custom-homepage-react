import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import Bookmark from "./Bookmark";
import { makeStyles } from "@material-ui/core/styles";
import { FirebaseBookmark } from "./Types";

const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: theme.palette.background.paper,
  },
  container: {
    margin: "0.2rem",
    padding: "1rem",
    backgroundColor: "#eee",
    borderRadius: "1rem",
  },
  title: {
    marginTop: theme.spacing(1),
    textAlign: "center",
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
      <Box className={classes.container}>
        <Grid container justifyContent="center">
          <Grid item>
            <Grid container spacing={3} justifyContent="center">
              {Object.entries(bookmarks).map(([key, value]) => {
                return <Bookmark key={key} uid={key} bookmark={value} />;
              })}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default BookmarkCategory;

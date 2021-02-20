import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import Bookmark from "./Bookmark";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: theme.palette.background.paper,
  },
  container: {
    margin: "0.2rem",
    padding: "1rem",
    borderRadius: "2rem",
    backgroundColor: "#eee",
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
  bookmarks?: Record<string, any>;
}): JSX.Element => {
  // console.log(bookmarks);
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
                return (
                  <Bookmark
                    key={key}
                    title={value.title}
                    url={value.url}
                    img={value.imgDownloadUrl}
                  />
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default BookmarkCategory;

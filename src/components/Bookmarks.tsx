import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useContext, useEffect, useState } from "react";
import { useFirebase } from "../functions/firebase";
import { useBookmarksRef } from "../functions/useBookmarksRef";
import Bookmark from "./Bookmark";
import BookmarkCategory from "./BookmarkCategory";
import { BookmarksContext, UserContext } from "./Contexts";
import NewBookmark from "./NewBookmark";

// test

const useStyles = makeStyles((theme) => ({
  root: {},
  bookmarksContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#424242",
    borderRadius: 20,
  },

  noBookmarksContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  noBookmarks: {
    // marginTop: theme.spacing(2),
  },
}));

const Bookmarks: React.FC = (): JSX.Element => {
  const classes = useStyles();
  const { bookmarks, setBookmarks } = useContext(BookmarksContext);
  const [loading, setLoading] = useState(true);

  const bookmarksRef = useBookmarksRef();

  /**
   * Set up listener for bookmarks
   */
  useEffect(() => {
    const observer = bookmarksRef.onSnapshot(
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          const tempBookmarks = {};

          querySnapshot.docs.forEach((doc) => {
            const data = doc.data();
            const id = doc.id;
            const category = data.category;

            if (!tempBookmarks[category]) {
              tempBookmarks[category] = {};
            }

            tempBookmarks[category][id] = data;
          });

          setBookmarks(tempBookmarks);
        } else {
          setBookmarks({});
        }
        setLoading(false);
      },
      (err) => {
        console.log(err);
      }
    );

    return () => {
      observer();
    };
  }, []);

  // if (loading) return <CircularProgress />;

  return (
    <Container className={classes.bookmarksContainer}>
      <NewBookmark />
      <NewBookmark />
      <NewBookmark />
    </Container>
  );

  return (
    <div className={classes.root}>
      {/* TODO: Form validation, sumbit on enter, reset values on enter, no duplicates, auto update categories */}

      {Object.keys(bookmarks).length === 0 && !loading && (
        <div className={classes.noBookmarksContainer}>
          <Card className={classes.noBookmarks}>
            <CardContent>
              <Typography variant="h5">No Bookmarks Found</Typography>
              <Typography variant="body1">
                Add bookmarks with the + icon in the bottom right corner
              </Typography>
            </CardContent>
          </Card>
        </div>
      )}

      {Object.entries(bookmarks).map(([key, value]) => {
        return <BookmarkCategory key={key} category={key} bookmarks={value} />;
      })}
    </div>
  );
};

export default Bookmarks;

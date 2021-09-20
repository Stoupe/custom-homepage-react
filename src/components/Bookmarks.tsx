import { CircularProgress, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useContext, useEffect, useState } from "react";
import { useBookmarksRef } from "../functions/useBookmarksRef";
import { BookmarksContext } from "./Contexts";
import NewBookmark from "./NewBookmark";

const useStyles = makeStyles((theme) => ({
  root: {},
  bookmarksContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#282828",
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

  if (loading)
    return (
      <div
        style={{
          width: "100%",
          height: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </div>
    );

  return (
    <Container className={classes.bookmarksContainer}>
      {Object.keys(bookmarks).length === 0 && !loading && (
        // <div className={classes.noBookmarksContainer}>
        // TODO: add a 'new bookmark' button here
        <Container>
          <Typography variant="h2">No Bookmarks Found</Typography>
          <Typography variant="body1">
            Add bookmarks with the + icon in the bottom right corner
          </Typography>
          {/* <CardContent>
              <Typography variant="h5">No Bookmarks Found</Typography>
              <Typography variant="body1">
                Add bookmarks with the + icon in the bottom right corner
              </Typography>
            </CardContent> */}
        </Container>
        // </div>
      )}
      {Object.entries(bookmarks).map(([key, value]) => {
        return <NewBookmark key={key} category={key} bookmarks={value} />;
        // return <BookmarkCategory key={key} category={key} bookmarks={value} />;
      })}
      {/* // <NewBookmark />
      // <NewBookmark />
      // <NewBookmark /> */}
    </Container>
  );
};

export default Bookmarks;

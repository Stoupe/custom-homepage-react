import { Card, CardContent, makeStyles, Typography } from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import { useFirebase } from "../functions/firebase";
import BookmarkCategory from "./BookmarkCategory";
import { BookmarksContext, UserContext } from "./Contexts";

const useStyles = makeStyles((theme) => ({
  root: {},
  noBookmarksContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  noBookmarks: {
    marginTop: theme.spacing(2),
  },
}));

const Bookmarks: React.FC = (): JSX.Element => {
  const classes = useStyles();
  const { user } = useContext(UserContext);
  const { bookmarks, setBookmarks } = useContext(BookmarksContext);

  const db = useFirebase();

  const bookmarksRef = db
    .collection("users")
    .doc(user.uid)
    .collection("bookmarks");

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
        }
      },
      (err) => {
        console.log(err);
      }
    );

    return () => {
      observer();
    };
  }, []);

  // if (Object.keys(bookmarks).length === 0) return null;

  return (
    <div className={classes.root}>
      {/* TODO: Form validation, sumbit on enter, reset values on enter, no duplicates, auto update categories */}

      {Object.keys(bookmarks).length === 0 && (
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

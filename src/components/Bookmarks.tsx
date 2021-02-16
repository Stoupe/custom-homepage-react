import { CircularProgress, makeStyles } from "@material-ui/core";
import React, { useContext } from "react";
import BookmarkCategory from "./BookmarkCategory";
import { BookmarksContext, UserContext } from "./Contexts";

const useStyles = makeStyles((theme) => ({
  thumbnail: {
    border: "5px solid #ccc",
    borderRadius: "1rem",
  },
  input: {
    // height: "3rem",
    margin: "1rem 0 1rem 0",
  },
}));

const Bookmarks: React.FC = (): JSX.Element => {
  const classes = useStyles();
  const { user } = useContext(UserContext);
  const { bookmarks, setBookmarks } = useContext(BookmarksContext);

  if (!bookmarks) return null;

  return (
    <>
      {/* TODO: Form validation, sumbit on enter, reset values on enter, no duplicates, auto update categories */}

      {Object.keys(bookmarks).length === 0 && <CircularProgress />}

      {Object.entries(bookmarks).map(([key, value]) => {
        return <BookmarkCategory key={key} category={key} bookmarks={value} />;
      })}
    </>
  );
};

export default Bookmarks;

import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Skeleton,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useFirebase } from "../functions/firebase";
import BookmarkCategory from "./BookmarkCategory";
import { UserContext } from "./Contexts";

const Bookmarks: React.FC = (): JSX.Element => {
  const { user } = useContext(UserContext);
  const db = useFirebase();
  const bookmarksRef = db
    .collection("users")
    .doc(user.uid)
    .collection("bookmarks");

  const [bookmarks, setBookmarks] = useState<Record<string, any>>({});

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
        // enqueueSnackbar(`Error fetching bookings: ${err}`, {
        //   variant: "error",
        // });
        console.log(err);
      }
    );

    return () => {
      observer();
    };
  }, []);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");

  const [addingBookmark, setAddingBookmark] = useState(false);

  const addBookmark = () => {
    bookmarksRef.add({ title: title, url: url, category: category });
  };

  return (
    <>
      {/* <div>{JSON.stringify(bookmarks)}</div> */}
      <Button
        onClick={() => {
          setAddingBookmark(true);
        }}
      >
        Add Bookmark
      </Button>

      {/* TODO: Form validation, sumbit on enter, reset values on enter, no duplicates, auto update categories */}

      <Dialog
        open={addingBookmark}
        onClose={() => {
          setAddingBookmark(false);
        }}
      >
        <DialogTitle>New Bookmark</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <TextField
            label="URL"
            type="url"
            fullWidth
            variant="standard"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
          />
          <Typography>upload or select image here</Typography>
          <Autocomplete
            freeSolo
            options={["SWEN 325", "SWEN 324", "ENGR 301"]}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={addBookmark}>Add</Button>
        </DialogActions>
      </Dialog>

      {Object.keys(bookmarks).length === 0 && <CircularProgress />}

      {Object.entries(bookmarks).map(([key, value]) => {
        return <BookmarkCategory key={key} category={key} bookmarks={value} />;
      })}
    </>
  );
};

export default Bookmarks;

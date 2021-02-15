import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { FormEvent, useContext, useEffect, useState } from "react";
import { useFirebase } from "../functions/firebase";
import BookmarkCategory from "./BookmarkCategory";
import { UserContext } from "./Contexts";

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
  const db = useFirebase();
  const bookmarksRef = db
    .collection("users")
    .doc(user.uid)
    .collection("bookmarks");

  const [bookmarks, setBookmarks] = useState<Record<string, any>>({});
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");

  const [addingBookmark, setAddingBookmark] = useState(false);

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

  const addBookmark = (e: FormEvent) => {
    e.preventDefault();
    bookmarksRef.add({ title: title, url: url, category: category });
  };

  const [image, setImage] = useState();
  const [imgUrl, setImgUrl] = useState<any>();

  const handleImageUpload = (e) => {
    const image = e.target.files[0];
    setImage(image);

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      setImgUrl(reader.result);
    };
  };

  return (
    <>
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
        <form onSubmit={addBookmark}>
          <DialogTitle>New Bookmark</DialogTitle>
          <DialogContent>
            <TextField
              className={classes.input}
              autoFocus
              label="Title"
              type="text"
              fullWidth
              value={title}
              required
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <TextField
              className={classes.input}
              label="URL"
              type="url"
              fullWidth
              value={url}
              required
              onChange={(e) => {
                setUrl(e.target.value);
              }}
            />

            <Typography>Upload or select image here</Typography>
            <Button variant="contained" component="label">
              Upload Image
              <input type="file" hidden required onChange={handleImageUpload} />
            </Button>
            {imgUrl && (
              <Box className={classes.thumbnail}>
                <img
                  src={imgUrl}
                  alt="uploaded bookmark thumbnail"
                  width="100px"
                ></img>
              </Box>
            )}
            <Autocomplete
              freeSolo
              options={["should automatically use existing categories"]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
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
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>

      {Object.keys(bookmarks).length === 0 && <CircularProgress />}

      {Object.entries(bookmarks).map(([key, value]) => {
        return <BookmarkCategory key={key} category={key} bookmarks={value} />;
      })}
    </>
  );
};

export default Bookmarks;

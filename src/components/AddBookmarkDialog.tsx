import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  TextField,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import React, { FormEvent, useContext, useEffect, useState } from "react";
import { useFirebase } from "../functions/firebase";
import { BookmarksContext, UserContext } from "./Contexts";

const useStyles = makeStyles((theme) => ({
  root: {
    // display: "flex",
    // flexDirection: "column",
    // margin: "5rem",
  },
  // title: {
  //   "& > *": {
  //     paddingTop: theme.spacing(1),
  //     paddingBottom: theme.spacing(1),
  //   },
  // },
  input: {
    // margin: "3rem",
    "& > div": {
      padding: theme.spacing(1),
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  },
  autocomplete: {
    "& > div": {
      marginTop: theme.spacing(2),
      // padding: "4rem",
    },
  },
  thumbnail: {
    border: "5px solid #ccc",
    borderRadius: "1rem",
  },
}));

const AddBookmarkDialog = ({
  addingBookmark,
  setAddingBookmark,
}): JSX.Element => {
  const { user } = useContext(UserContext);
  const { bookmarks, setBookmarks } = useContext(BookmarksContext);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState();
  const [imgUrl, setImgUrl] = useState<any>();

  const classes = useStyles();

  const db = useFirebase();

  const bookmarksRef = db
    .collection("users")
    .doc(user.uid)
    .collection("bookmarks");

  const [bookmarkCategories, setBookmarkCategories] = useState([]);

  const handleImageUpload = (e) => {
    const image = e.target.files[0];
    setImage(image);

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      setImgUrl(reader.result);
    };
  };

  const addBookmark = (e: FormEvent) => {
    e.preventDefault();
    bookmarksRef.add({ title: title, url: url, category: category });
  };

  useEffect(() => {
    Object.values(bookmarks).forEach((category: Record<string, any>) => {
      const categoryName = Object.values(category).pop().category;
      setBookmarkCategories((prevState) => [...prevState, categoryName]);
    });
  }, [bookmarks]);

  return (
    <Dialog
      className={classes.root}
      open={addingBookmark}
      onClose={() => {
        setAddingBookmark(false);
      }}
    >
      <DialogTitle>New Bookmark</DialogTitle>
      <form onSubmit={addBookmark}>
        <DialogContent>
          <TextField
            className={classes.input}
            autoFocus
            label="Title"
            type="text"
            fullWidth
            // margin="dense"
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
            // margin="normal"
            value={url}
            required
            onChange={(e) => {
              setUrl(e.target.value);
            }}
          />

          {/* ====================== */}

          <Typography variant="subtitle1">
            Upload or select image here
          </Typography>
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

          {/* ===================== */}

          <Autocomplete
            freeSolo
            className={classes.autocomplete}
            options={bookmarkCategories}
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
  );
};

export default AddBookmarkDialog;

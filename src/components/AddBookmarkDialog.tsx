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
  Typography,
} from "@material-ui/core";
import React, { FormEvent, useContext, useState } from "react";
import { useFirebase } from "../functions/firebase";
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

  return (
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
  );
};

export default AddBookmarkDialog;

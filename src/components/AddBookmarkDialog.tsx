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
import firebase from "firebase/app";
import "firebase/storage";
import { title } from "node:process";
import { url } from "node:inspector";

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

  const [title, setTitle] = useState("Test");
  const [url, setUrl] = useState("https://example.com");
  const [category, setCategory] = useState("General");
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

  const uploadThumbnail = async () => {
    const storageRef = firebase.storage().ref();

    const uploadTask = storageRef.child(`images/${title}-${url}`).put(image);
    console.log("created upload task");

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused": // or 'paused'
            console.log("Upload is paused");
            break;
          case "running": // or 'running'
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log(error);
        return Promise.reject(error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((dlUrl: string) => {
          console.log("Download URL: ", dlUrl);
          setImgUrl("" + dlUrl);
          return Promise.resolve();
          // downloadURL = dlUrl;

          // return Promise.resolve(dlUrl);
          // setImgUrl();
          // return Promise.resolve(downloadURL.toString());
        });
      }
    );

    await uploadTask.then(async (onFufilled) => {
      await onFufilled.ref.getDownloadURL();
    });
  };

  const addBookmark = async (e: FormEvent) => {
    e.preventDefault();
    setAddingBookmark(false);
    //! clear all add bookmark fields

    console.log("==========UPLOADING THUMBNAIL=============");
    uploadThumbnail()
      .then(() => {
        console.log("==========THUMBNAIL UPLOADED=============");
        // console.log("returned ", imgUrl);
        // setImgUrl(imgUrl);

        console.log("adding bookmark:");
        console.log(`Title: ${title}`);
        console.log(`URL: ${url}`);
        console.log(`Category: ${category}`);
        console.log(`Img Url: ${imgUrl}`);

        bookmarksRef
          .add({
            title: title,
            url: url,
            category: category,
            imgUrl: imgUrl,
          })
          .then((bookmark) => {
            console.log("bookmark added");
            // ref.put(image).then((snapshot) => {
            //   console.log("Uploaded a blob or file!");
            // });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });

    // console.log("uploaded thumbnail - adding bookmark");
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

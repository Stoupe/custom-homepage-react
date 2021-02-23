import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ImageList,
  ImageListItem,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import DeleteIcon from "@material-ui/icons/Delete";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import firebase from "firebase/app";
import "firebase/storage";
import React, { FormEvent, useContext, useEffect, useState } from "react";
import { addNewBookmark } from "../functions/bookmarkFunctions";
import { useFirebase } from "../functions/firebase";
import { BookmarksContext, UserContext } from "./Contexts";
import { FirebaseBookmark } from "./Types";

const useStyles = makeStyles((theme) => ({
  root: {},
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

    // width: "50px",
    // padding: ".2rem",
    marginBottom: theme.spacing(1),
  },
  centered: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

/**
 * TODO: Ensure thumbnail URL is the proper URL, verify this with testing
 */
const AddBookmarkDialog = (): JSX.Element => {
  const { user } = useContext(UserContext);
  const { bookmarks, addingBookmark, setAddingBookmark } = useContext(
    BookmarksContext
  );

  const [newBookmark, setNewBookmark] = useState<FirebaseBookmark>({
    title: "",
    url: "",
    category: "",
    thumbnailUrl: "",
  });

  // const [title, setTitle] = useState<string>("");
  // const [url, setUrl] = useState<string>("");
  // const [category, setCategory] = useState<string>("");
  const [image, setImage] = useState<File>();
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<
    string | ArrayBuffer
  >();
  const [choosingExistingImage, setChoosingExistingImage] = useState<boolean>(
    false
  );
  const [thumbnailUploaded, setThumbnailUploaded] = useState<boolean>(false);
  const [bookmarkCategories, setBookmarkCategories] = useState<Array<string>>(
    []
  );

  const classes = useStyles();

  const storageRef = firebase.storage().ref();
  const bookmarksRef = useFirebase()
    .collection("users")
    .doc(user.uid)
    .collection("bookmarks");

  //* ========================= FUNCTIONS ==============================

  const handleImageUpload = (e: FormEvent) => {
    let image = (e.target as HTMLInputElement).files[0];
    setImage(image);

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      const localUrl = reader.result;
      setThumbnailPreviewUrl(localUrl);
      setNewBookmark((prevState) => ({
        ...prevState,
        thumbnailUrl: null,
      }));
      setThumbnailUploaded(true);
    };
  };

  const uploadThumbnailToFirebase = async () => {
    let response: Promise<string>;

    const uploadTask = storageRef
      .child(`images/${user.uid}/${image.name}`)
      .put(image);
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
        // return Promise.reject(error);
        response = Promise.reject(error.message);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((dlUrl: string) => {
          console.log("Download URL: ", dlUrl);
          response = Promise.resolve(dlUrl);
        });
      }
    );

    await uploadTask.then(async (onFufilled) => {
      await onFufilled.ref.getDownloadURL();
    });

    return response;
  };

  const [existingThumbnails, setExistingThumbnails] = useState<string[]>([]);

  const getExistingThumbnails = async () => {
    const storageRef = firebase.storage().ref().child(`images/${user.uid}`);

    storageRef
      .listAll()
      .then(async (value) => {
        // console.log(value.items.length);
        let tempImageUrls = [];
        value.items.forEach(async (item) => {
          tempImageUrls.push(await item.getDownloadURL());
          // console.log(await item.getDownloadURL());
        });
        setExistingThumbnails(tempImageUrls);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getExistingThumbnails();
  }, [bookmarks]);

  const clearFormFields = () => {
    setNewBookmark({
      title: "",
      url: "",
      category: "",
      thumbnailUrl: "",
    });
    setImage(null);
    setThumbnailPreviewUrl("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAddingBookmark(false);
    clearFormFields();

    try {
      if (thumbnailUploaded) {
        await uploadThumbnailToFirebase();
      }
      addNewBookmark(bookmarksRef, newBookmark);
    } catch (err) {
      console.log(err);
    }
  };

  const removeThumbnail = () => {
    setImage(null);
    setThumbnailPreviewUrl(null);
    setNewBookmark((prevState) => ({
      ...prevState,
      thumbnailUrl: null,
    }));
    setThumbnailUploaded(false);
  };

  /**
   * Parse all existing bookmark categories every time the bookmarks are changed
   */
  useEffect(() => {
    const tempCategories: string[] = [];
    Object.values(bookmarks).forEach((category: Record<string, any>) => {
      const categoryName = Object.values(category).pop().category;
      tempCategories.push(categoryName);
    });
    setBookmarkCategories(tempCategories);
  }, [bookmarks]);

  //* ========================= RETURN ==============================

  return (
    <Dialog
      maxWidth="xs"
      className={classes.root}
      open={addingBookmark}
      onClose={() => {
        setAddingBookmark(false);
      }}
    >
      <DialogTitle>New Bookmark</DialogTitle>
      <form onSubmit={handleSubmit} noValidate>
        <DialogContent>
          <TextField
            className={classes.input}
            autoFocus
            label="Title"
            type="text"
            fullWidth
            value={newBookmark.title}
            onChange={(e) => {
              setNewBookmark((prevState) => ({
                ...prevState,
                title: e.target.value,
              }));
            }}
          />
          <TextField
            className={classes.input}
            label="URL"
            type="url"
            fullWidth
            // margin="normal"
            value={newBookmark.url}
            onChange={(e) => {
              setNewBookmark((prevState) => ({
                ...prevState,
                url: e.target.value,
              }));
            }}
          />
          {/* ==========SELECT THUMBNAIL IMAGE============ */}
          <Typography variant="caption">Thumbnail</Typography>
          <Box className={classes.centered}>
            {thumbnailPreviewUrl && (
              <Box className={classes.thumbnail}>
                {/* TODO: Click the image to crop */}
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  <img
                    alt="thumbnail"
                    width="60rem"
                    height="60rem"
                    src={thumbnailPreviewUrl as string}
                  />
                </Button>
              </Box>
            )}

            <ButtonGroup
              variant="contained"
              color="primary"
              aria-label="contained primary button group"
            >
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
              >
                Upload
                <input type="file" hidden onChange={handleImageUpload} />
              </Button>

              <Button
                variant="contained"
                component="label"
                startIcon={<PhotoLibraryIcon />}
                onClick={() => {
                  setChoosingExistingImage(true);
                }}
              >
                Browse
              </Button>

              <Button
                variant="contained"
                component="label"
                startIcon={<DeleteIcon />}
                onClick={removeThumbnail}
              >
                Remove
              </Button>
            </ButtonGroup>

            {choosingExistingImage && (
              // <Box>
              <Dialog
                open={choosingExistingImage}
                onClose={() => setChoosingExistingImage(false)}
              >
                <DialogTitle>Choose Image</DialogTitle>
                <DialogContent>
                  <ImageList cols={3}>
                    {existingThumbnails.map((itemUrl) => (
                      <ImageListItem key={itemUrl}>
                        <Button
                          onClick={() => {
                            removeThumbnail();
                            setThumbnailPreviewUrl(itemUrl);
                            setNewBookmark((prevState) => ({
                              ...prevState,
                              thumbnailUrl: itemUrl,
                            }));
                            setChoosingExistingImage(false);
                          }}
                        >
                          <img src={itemUrl} width={"80rem"} alt="" />
                        </Button>
                      </ImageListItem>
                    ))}
                  </ImageList>
                </DialogContent>
              </Dialog>
              // </Box>
            )}
          </Box>
          {/* ===================== */}
          <Autocomplete
            freeSolo
            className={classes.autocomplete}
            options={bookmarkCategories}
            value={newBookmark.category}
            inputValue={newBookmark.category}
            // onChange={(e, newValue) => {
            //   setNewBookmark((prevState) => ({
            //     ...prevState,
            //     category: newValue,
            //   }));
            // }}
            onInputChange={(e, newInputValue) => {
              setNewBookmark((prevState) => ({
                ...prevState,
                category: newInputValue,
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                value={newBookmark.category}
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

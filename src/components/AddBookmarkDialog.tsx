import {
  Autocomplete,
  Box,
  Button,
  ButtonBase,
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
import { makeStyles } from "@material-ui/styles";
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
import Image from "material-ui-image";
import { style } from "@material-ui/system";

const useStyles = makeStyles((theme) => ({
  text: {
    color: "white",
    "& > input": { color: "white" },
  },
  // root: {},
  // input: {
  //   // margin: "3rem",
  //   "& > div": {
  //     // padding: theme.spacing(1),
  //     // marginTop: theme.spacing(1),
  //     // marginBottom: theme.spacing(1),
  //   },
  // },
  // autocomplete: {
  //   "& > div": {
  //     // marginTop: theme.spacing(2),
  //     // padding: "4rem",
  //   },
  // },
  // thumbnail: {
  //   // marginBottom: theme.spacing(1),
  //   // marginLeft: theme.spacing(0.5),
  //   // marginRight: theme.spacing(0.5),
  //   width: "5.5rem",
  //   height: "5.5rem",
  //   border: "0.5rem solid #ddd",
  //   borderRadius: "1.5rem",
  //   // position: "flex",
  //   boxSizing: "border-box",
  //   "& > div": {
  //     borderRadius: "1rem",
  //   },
  // },
  // thumbnailImage: {
  //   borderRadius: "1rem",
  // },
  // centered: {
  //   display: "flex",
  //   flexDirection: "column",
  //   alignItems: "center",
  // },
}));

/**
 * TODO: Ensure thumbnail URL is the proper URL, verify this with testing
 */
const AddBookmarkDialog = (): JSX.Element => {
  const { user } = useContext(UserContext);
  const { bookmarks, addingBookmark, setAddingBookmark } =
    useContext(BookmarksContext);

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
  const [choosingExistingImage, setChoosingExistingImage] =
    useState<boolean>(false);
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

  /**
   * Upload the selected thumbnail in 'image' to firebase
   */
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

  /**
   * Clear all form fields
   */
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

  // useEffect(() => {

  // }, [newBookmark.thumbnailUrl]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAddingBookmark(false);
    clearFormFields();

    try {
      if (thumbnailUploaded) {
        const thumbnailUrl = await uploadThumbnailToFirebase();
        console.log(`Got thumbnail URL: ${thumbnailUrl}`);
        console.log("about to update state");

        setNewBookmark((prevState) => ({
          ...prevState,
          thumbnailUrl: thumbnailUrl,
        }));
        // console.log(thumbnailUrl);
        // console.log(newBookmark.thumbnailUrl);
        while (newBookmark.thumbnailUrl !== thumbnailUrl) {
          // console.log(
          // `waiting for state to update... ${newBookmark.thumbnailUrl}`
          // );
        }
        console.log("done");
      }
      addNewBookmark(bookmarksRef, newBookmark);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Remove the currently selected thumbnail
   */
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
  const getExistingCategories = () => {
    const tempCategories: string[] = [];
    Object.values(bookmarks).forEach((category: Record<string, any>) => {
      const categoryName = Object.values(category).pop().category;
      tempCategories.push(categoryName);
    });
    setBookmarkCategories(tempCategories);
  };

  useEffect(() => {
    getExistingCategories();
    getExistingThumbnails();
  }, [bookmarks]);

  //* ========================= RETURN ==============================

  return (
    <>
      <Dialog
        maxWidth="xs"
        open={addingBookmark}
        onClose={() => {
          setAddingBookmark(false);
        }}
      >
        <form onSubmit={handleSubmit} noValidate>
          <DialogTitle>New Bookmark</DialogTitle>
          <DialogContent
            style={{
              display: "grid",
              gap: "1rem",
              padding: "1rem auto",
              color: "white",
            }}
          >
            <TextField
              inputProps={{ style: { color: "white" } }}
              style={{ marginTop: "5px" }}
              autoFocus
              label="Title"
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
              inputProps={{ style: { color: "white" } }}
              label="URL"
              type="url"
              fullWidth
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
            {thumbnailPreviewUrl && (
              <ButtonBase
                style={{ width: "5rem", height: "5rem" }}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <Image
                  alt="thumbnail"
                  style={{ width: "100%", backgroundColor: "none" }}
                  imageStyle={{ borderRadius: "1rem" }}
                  src={thumbnailPreviewUrl as string}
                />
              </ButtonBase>
            )}

            <ButtonGroup>
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

            <Autocomplete
              freeSolo
              options={bookmarkCategories}
              value={newBookmark.category}
              inputValue={newBookmark.category}
              onInputChange={(e, newInputValue) => {
                setNewBookmark((prevState) => ({
                  ...prevState,
                  category: newInputValue,
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    style: { color: "white" },
                  }}
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

      {choosingExistingImage && (
        <Dialog
          open={choosingExistingImage}
          onClose={() => setChoosingExistingImage(false)}
        >
          <DialogTitle>Choose Image</DialogTitle>
          <DialogContent>
            <ImageList cols={3} gap={10}>
              {existingThumbnails.map((itemUrl) => (
                <ImageListItem key={itemUrl}>
                  <ButtonBase
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
                    <Image
                      src={itemUrl}
                      style={{
                        width: "5rem",
                        backgroundColor: "none",
                        borderRadius: "1rem",
                      }}
                      imageStyle={{ borderRadius: "1rem" }}
                    />
                  </ButtonBase>
                </ImageListItem>
              ))}
            </ImageList>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AddBookmarkDialog;

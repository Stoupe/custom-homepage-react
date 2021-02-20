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
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import DeleteIcon from "@material-ui/icons/Delete";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import firebase from "firebase/app";
import "firebase/storage";
import React, { FormEvent, useContext, useEffect, useState } from "react";
import { useFirebase } from "../functions/firebase";
import { BookmarksContext, UserContext } from "./Contexts";

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

const AddBookmarkDialog = ({
  addingBookmark,
  setAddingBookmark,
}): JSX.Element => {
  const { user } = useContext(UserContext);
  const { bookmarks, setBookmarks } = useContext(BookmarksContext);

  const [title, setTitle] = useState("Test");
  const [url, setUrl] = useState("https://google.com");
  const [category, setCategory] = useState("General");
  const [image, setImage] = useState<File>();
  const [imgBlobUrl, setImgBlobUrl] = useState<string | ArrayBuffer>();

  const [existingImage, setExistingImage] = useState(true);

  const classes = useStyles();

  const db = useFirebase();

  const bookmarksRef = db
    .collection("users")
    .doc(user.uid)
    .collection("bookmarks");

  const [bookmarkCategories, setBookmarkCategories] = useState([]);

  const [choosingExistingImage, setChoosingExistingImage] = useState(false);

  const handleImageUpload = (e: FormEvent) => {
    let image = (e.target as HTMLInputElement).files[0];

    setImage(image);

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      setImgBlobUrl(reader.result);
    };
  };

  const uploadThumbnail = async () => {
    let response: Promise<any>;
    const storageRef = firebase.storage().ref();
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
        response = Promise.reject(error);
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

  const itemData = [
    {
      img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
      title: "Breakfast",
    },
    {
      img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
      title: "Burger",
    },
    {
      img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
      title: "Camera",
    },
    {
      img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
      title: "Coffee",
    },
    {
      img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
      title: "Hats",
    },
    {
      img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
      title: "Honey",
    },
    {
      img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
      title: "Basketball",
    },
    {
      img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
      title: "Fern",
    },
    {
      img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
      title: "Mushrooms",
    },
    {
      img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
      title: "Tomato basil",
    },
    {
      img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
      title: "Sea star",
    },
    {
      img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
      title: "Bike",
    },
  ];

  //TODO: get thumbnails from storage
  const [existingThumbnails, setExistingThumbnails] = useState<string[]>([]);
  const getExistingThumbnails = async () => {
    const storageRef = firebase.storage().ref().child(`images/${user.uid}`);

    storageRef
      .listAll()
      .then(async (value) => {
        console.log(value.items.length);
        let tempImageUrls = [];
        await value.items.forEach(async (item) => {
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
    setTitle("");
    setUrl("");
    setCategory("");
    setImage(null);
    setImgBlobUrl("");
  };

  const addBookmark = async (e: FormEvent) => {
    e.preventDefault();
    setAddingBookmark(false);
    clearFormFields();
    //! clear all add bookmark fields

    console.log("==========UPLOADING THUMBNAIL=============");

    if (!existingImage) {
      try {
        const uploadedThumbnailUrl = await uploadThumbnail();

        bookmarksRef
          .add({
            title: title,
            url: url,
            category: category,
            imgDownloadUrl: uploadedThumbnailUrl,
          })
          .then((bookmark) => {
            console.log("bookmark added");
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
    } else {
      bookmarksRef
        .add({
          title: title,
          url: url,
          category: category,
          imgDownloadUrl: imgBlobUrl,
        })
        .then((bookmark) => {
          console.log("bookmark added");
        });
    }
  };

  useEffect(() => {
    Object.values(bookmarks).forEach((category: Record<string, any>) => {
      const categoryName = Object.values(category).pop().category;
      setBookmarkCategories((prevState) => [...prevState, categoryName]);
    });
  }, [bookmarks]);

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
      <form onSubmit={addBookmark} noValidate>
        <DialogContent>
          <TextField
            className={classes.input}
            // autoFocus
            label="Title"
            type="text"
            fullWidth
            // margin="dense"
            value={title}
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
            onChange={(e) => {
              setUrl(e.target.value);
            }}
          />

          {/* ==========SELECT THUMBNAIL IMAGE============ */}

          <Typography variant="caption">Thumbnail</Typography>

          <Box className={classes.centered}>
            {imgBlobUrl && (
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
                    src={imgBlobUrl as string}
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
                onClick={(e) => {
                  setChoosingExistingImage((prevState) => !prevState);
                }}
              >
                Browse
              </Button>

              <Button
                variant="contained"
                component="label"
                startIcon={<DeleteIcon />}
                onClick={(e) => {
                  setImage(null);
                  setImgBlobUrl(null);
                }}
              >
                Remove
              </Button>
            </ButtonGroup>

            {choosingExistingImage && (
              <Box>
                <Dialog
                  open={choosingExistingImage}
                  onClose={() => setChoosingExistingImage(false)}
                >
                  <DialogTitle>Choose Image</DialogTitle>
                  <DialogContent>
                    <ImageList cols={3}>
                      {existingThumbnails.map((item) => (
                        <ImageListItem key={item}>
                          <Button
                            onClick={() => {
                              // setImage();
                              setExistingImage(true);
                              setImgBlobUrl(item);
                              setChoosingExistingImage(false);
                            }}
                          >
                            <img src={item} width={"80rem"} alt="" />
                          </Button>
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </DialogContent>
                </Dialog>
              </Box>
            )}
          </Box>

          {/* ===================== */}

          <Autocomplete
            freeSolo
            className={classes.autocomplete}
            options={bookmarkCategories}
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
          <Button type="submit">Add</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddBookmarkDialog;

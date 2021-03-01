import {
  Box,
  ButtonBase,
  Grid,
  Grow,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import React, { useContext } from "react";
import { deleteBookmark } from "../functions/bookmarkFunctions";
import { useBookmarksRef } from "../functions/useBookmarksRef";
import { BookmarksContext } from "./Contexts";
// const scrapFavicon = require("scrap-favicon");
// import scrapFavicon from "scrap-favicon";
import { FirebaseBookmark } from "./Types";
import Image from "material-ui-image";

const useStyles = makeStyles((theme) => ({
  root: {},
  bookmarkBox: {
    width: "5.5rem",
    display: "flex",
    justifyContent: "center",
    position: "relative",
  },
  thumbnail: {
    boxSizing: "border-box",
    width: "5.5rem",
    height: "5.5rem",
    borderRadius: "1.5rem",
    border: "0.5rem solid #ddd",
    "& > *": {
      borderRadius: "inherit",
    },
  },

  button: {
    flexDirection: "column",
    // borderRadius: "0.2rem",
  },
  logo: {
    width: "100%",
    height: "100%",
    borderRadius: "1rem",
  },
  title: {
    paddingTop: "0.3rem",
    textAlign: "center",
  },
  removeCircleContainer: {
    position: "absolute",
    marginLeft: "4.5rem",
    top: "-0.4rem",
  },
}));

const Bookmark = ({
  uid,
  bookmark,
}: {
  uid: string;
  bookmark: FirebaseBookmark;
}) => {
  const classes = useStyles();
  const { editingBookmarks } = useContext(BookmarksContext);

  const { title, url, thumbnailUrl } = bookmark;
  const bookmarksRef = useBookmarksRef();

  return (
    <Grid item className={classes.root}>
      <Grow in={true}>
        <Tooltip
          title={url ?? "no url"}
          arrow
          disableHoverListener={editingBookmarks}
        >
          <Box className={classes.bookmarkBox}>
            <ButtonBase
              disabled={editingBookmarks}
              className={classes.button}
              href={url as string}
            >
              <Box className={classes.thumbnail}>
                <Image
                  src={thumbnailUrl ?? "logo192.png"}
                  alt={title ?? "logo"}
                  className={classes.logo}
                  disableSpinner
                ></Image>
              </Box>
              <Typography
                className={classes.title}
                variant="subtitle2"
                lineHeight={"1rem"}
              >
                {title ?? "No Title"}
              </Typography>
            </ButtonBase>
            {editingBookmarks && (
              <Grow in={true}>
                <Box className={classes.removeCircleContainer}>
                  <ButtonBase
                    onClick={() => {
                      deleteBookmark(bookmarksRef, uid);
                    }}
                  >
                    <RemoveCircleIcon />
                  </ButtonBase>
                </Box>
              </Grow>
            )}
          </Box>
        </Tooltip>
      </Grow>
    </Grid>
  );
};

export default Bookmark;

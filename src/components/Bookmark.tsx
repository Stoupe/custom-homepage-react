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

const useStyles = makeStyles((theme) => ({
  bookmarkBox: {
    position: "relative",
  },
  thumbnail: {
    boxSizing: "border-box",
    // height: "100%",
    width: "5.5rem",
    height: "5.5rem",
    // padding: "0.2rem",
    borderRadius: "1.5rem",
    border: "0.5rem solid #ddd",
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
  removeCircleContainer: {
    position: "absolute",
    top: "-0.3rem",
    right: "-0.3rem",
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
    <Grid item>
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
                <img
                  src={thumbnailUrl ?? "logo192.png"}
                  alt={title ?? "logo"}
                  className={classes.logo}
                ></img>
              </Box>
              <Typography variant="subtitle2">{title ?? "No Title"}</Typography>
            </ButtonBase>
            {editingBookmarks && (
              <Box className={classes.removeCircleContainer}>
                <ButtonBase
                  onClick={() => {
                    deleteBookmark(bookmarksRef, uid);
                  }}
                >
                  <RemoveCircleIcon />
                </ButtonBase>
              </Box>
            )}
          </Box>
        </Tooltip>
      </Grow>
    </Grid>
  );
};

export default Bookmark;

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
import { BookmarksContext } from "./Contexts";

// const scrapFavicon = require("scrap-favicon");
// import scrapFavicon from "scrap-favicon";

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
  title,
  url,
  img,
}: {
  title?: string;
  url?: string;
  img?: string;
}) => {
  const classes = useStyles();

  const { bookmarks, editingBookmarks } = useContext(BookmarksContext);
  // const { editing } = bookmarks;
  // const editing = bookmarks.editing;
  // const {bookmarkEditingMode, setBookmarkEditingMode} = useContext(BookmarkEditingContext);

  // const [editing, setEditing] = useState(true);

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
              href={url}
            >
              <Box className={classes.thumbnail}>
                <img
                  src={img ?? "logo192.png"}
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
                    alert("asdf");
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

import {
  Box,
  ButtonBase,
  Grid,
  Grow,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import React, { useContext } from "react";
import { deleteBookmark } from "../functions/bookmarkFunctions";
import { useBookmarksRef } from "../functions/useBookmarksRef";
import { BookmarksContext } from "./Contexts";
// const scrapFavicon = require("scrap-favicon");
// import scrapFavicon from "scrap-favicon";
import { FirebaseBookmark } from "./Types";
import Image from "material-ui-image";
import EditIcon from "@material-ui/icons/Edit";

const useStyles = makeStyles((theme) => ({}));

const Bookmark = ({
  uid,
  bookmark,
}: {
  uid: string;
  bookmark: FirebaseBookmark;
}) => {
  const classes = useStyles();
  const { editingView } = useContext(BookmarksContext);

  const { title, url, thumbnailUrl } = bookmark;
  const bookmarksRef = useBookmarksRef();

  return (
    <Grid item>
      <Grow in={true}>
        <Box>
          <ButtonBase
            // disabled={editingView}
            href={url as string}
          >
            <Box>
              <Tooltip
                title={url ?? "no url"}
                arrow
                // disableHoverListener={editingView}
              >
                <Image
                  src={thumbnailUrl ?? "logo192.png"}
                  alt={title ?? "logo"}
                  disableSpinner
                />
              </Tooltip>
            </Box>
            <Typography variant="subtitle2" lineHeight={"1rem"}>
              {title ?? "No Title"}
            </Typography>
          </ButtonBase>
          {editingView && (
            <Grow in={true}>
              {/* <Box className={classes.editButtons}> */}
              <Box>
                <ButtonBase
                  onClick={() => {
                    deleteBookmark(bookmarksRef, uid);
                  }}
                >
                  <EditIcon />
                </ButtonBase>
                {/* <Box className={classes.removeIconContainer}>
                      <ButtonBase
                        onClick={() => {
                          deleteBookmark(bookmarksRef, uid);
                        }}
                      >
                        <RemoveCircleIcon />
                      </ButtonBase>
                    </Box> */}
              </Box>
              {/* </Box> */}
            </Grow>
          )}
        </Box>
      </Grow>
    </Grid>
  );
};

export default Bookmark;

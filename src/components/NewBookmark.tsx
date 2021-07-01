import {
  Typography,
  Grid,
  Box,
  Button,
  Grow,
  Link,
  ButtonBase,
} from "@material-ui/core";
import TouchRipple from "@material-ui/core/ButtonBase/TouchRipple";
import { makeStyles, styled } from "@material-ui/styles";
import React, { useContext } from "react";
import { useBookmarksRef } from "../functions/useBookmarksRef";
import { BookmarksContext } from "./Contexts";
import { FirebaseBookmark } from "./Types";

const useStyles = makeStyles((theme) => ({
  bookmarkTitle: {
    textAlign: "center",
    marginTop: 10,
  },
  bookmarkIcon: {
    padding: 0,
    borderRadius: 2,
    boxShadow: "0 0 40px rgba(000,000,000,0.25)",
    backgroundColor: "#424242",
    height: 70,
    width: 70,
    // overflow: "hidden",
  },
  img: {
    height: "100%",
  },
}));

const BM = ({ uid, bookmark }: { uid: string; bookmark: FirebaseBookmark }) => {
  const classes = useStyles();
  const { editingView } = useContext(BookmarksContext);

  const { title, url, thumbnailUrl } = bookmark;
  const bookmarksRef = useBookmarksRef();

  return (
    <Grow in={true}>
      <Grid item>
        <Box draggable>
          <ButtonBase className={classes.bookmarkIcon} href={url as string}>
            <img
              className={classes.img}
              src={thumbnailUrl}
              alt={title + " thumbnail"}
            />
          </ButtonBase>
          <Typography
            variant="h3"
            className={classes.bookmarkTitle}
            marginTop={0.5}
          >
            {title}
          </Typography>
        </Box>
      </Grid>
    </Grow>
  );
};

const NewBookmark = ({
  category,
  bookmarks,
}: {
  category: string;
  bookmarks?: Record<string, FirebaseBookmark>;
}): JSX.Element => {
  // const classes = useStyles();

  return (
    <>
      <Typography variant="h2" paddingBottom={1}>
        {category}
      </Typography>
      <Grid container spacing={2} justifyContent={"center"}>
        {Object.entries(bookmarks).map(([key, value]) => {
          return <BM key={key} uid={key} bookmark={value} />;
        })}
      </Grid>
    </>
  );
};

export default NewBookmark;

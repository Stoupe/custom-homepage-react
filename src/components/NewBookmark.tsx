import {
  Typography,
  Grid,
  Box,
  Button,
  Grow,
  Link,
  ButtonBase,
  Tooltip,
} from "@material-ui/core";
import TouchRipple from "@material-ui/core/ButtonBase/TouchRipple";
import { makeStyles, styled } from "@material-ui/styles";
import React, { useContext } from "react";
import { useBookmarksRef } from "../functions/useBookmarksRef";
import { BookmarksContext } from "./Contexts";
import { FirebaseBookmark } from "./Types";

const useStyles = makeStyles((theme) => ({}));

const BM = ({ uid, bookmark }: { uid: string; bookmark: FirebaseBookmark }) => {
  const classes = useStyles();
  const { editingView } = useContext(BookmarksContext);

  const { title, url, thumbnailUrl } = bookmark;
  const bookmarksRef = useBookmarksRef();

  return (
    <Grow in={true}>
      <Grid item>
        <Box
          draggable
          style={{
            display: "flex",
            flexDirection: "column",
            width: "5rem",
            alignItems: "center",
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          <ButtonBase href={url as string}>
            <img
              src={thumbnailUrl}
              alt={title + " thumbnail"}
              style={{ height: "5rem", width: "5rem", borderRadius: "1rem" }}
            />
          </ButtonBase>
          <Typography variant="h3" style={{ marginTop: "0.3rem" }}>
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

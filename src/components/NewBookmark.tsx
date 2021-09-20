import {
  Box,
  ButtonBase,
  Grid,
  Grow,
  Icon,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useContext } from "react";
import { BookmarksContext } from "./Contexts";
import { FirebaseBookmark } from "./Types";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import { deleteBookmark } from "../functions/bookmarkFunctions";
import { useBookmarksRef } from "../functions/useBookmarksRef";

const useStyles = makeStyles((theme) => ({}));

const BM = ({ uid, bookmark }: { uid: string; bookmark: FirebaseBookmark }) => {
  const { editingView } = useContext(BookmarksContext);
  const bookmarksRef = useBookmarksRef();
  const { title, url, thumbnailUrl } = bookmark;

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
          <ButtonBase href={editingView ? null : (url as string)}>
            <img
              src={thumbnailUrl}
              alt={title + " thumbnail"}
              style={{ height: "5rem", width: "5rem", borderRadius: "1rem" }}
            />
            {editingView && (
              <div
                onClick={() => deleteBookmark(bookmarksRef, uid)}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "1rem",
                  backgroundColor: "#00000099",
                }}
              >
                <Delete
                  style={{
                    borderRadius: "1rem",
                    width: "3rem",
                    color: "white",
                  }}
                />
              </div>
            )}
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

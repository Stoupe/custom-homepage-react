import { Button, Container, Fab, makeStyles, styled } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import React, { useContext, useEffect, useState } from "react";
import { useFirebase } from "../functions/firebase";
import AddBookmarkDialog from "./AddBookmarkDialog";
import Bookmarks from "./Bookmarks";
import { BookmarksContext, UserContext } from "./Contexts";
import Header from "./Header";

// Fix for MUIv5 ButtonBase styles overriding Fab styles
// const Fab = styled(MuiFab)({
//   borderRadius: "50%",
// });

const useStyles = makeStyles((theme) => ({
  fab: {
    position: "absolute",
    bottom: "1rem",
    right: "1rem",
  },
}));

const App = () => {
  const { user, setUser } = useContext(UserContext);

  const [addingBookmark, setAddingBookmark] = useState(false);

  const styles = useStyles();

  return (
    <div>
      <Header />
      {user && (
        <>
          <Container>
            <Bookmarks />
          </Container>
          <div className={styles.fab}>
            <Fab
              // variant="contained"
              color="primary"
              aria-label="add bookmark"
              size="large"
              onClick={() => setAddingBookmark(true)}
            >
              <AddIcon />
            </Fab>
          </div>

          <AddBookmarkDialog
            addingBookmark={addingBookmark} //! remove "|| true", temp for development
            setAddingBookmark={setAddingBookmark}
          />
        </>
      )}
    </div>
  );
};

export default App;

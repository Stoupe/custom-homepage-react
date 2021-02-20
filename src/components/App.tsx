import { Container, Fab } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import React, { useContext, useState } from "react";
import AddBookmarkDialog from "./AddBookmarkDialog";
import Bookmarks from "./Bookmarks";
import { UserContext } from "./Contexts";
import Header from "./Header";

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

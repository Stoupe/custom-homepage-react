import { Box, Container, Fab } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import React, { useContext, useState } from "react";
import AddBookmarkDialog from "./AddBookmarkDialog";
import Bookmarks from "./Bookmarks";
import { BookmarksContext, UserContext } from "./Contexts";
import Header from "./Header";
import TimeTracker from "./TimeTracker";

const useStyles = makeStyles({
  root: {},
  container: {
    padding: "1em",
  },
  fab: {
    position: "fixed",
    bottom: "1rem",
    right: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: `0 auto 30%`,
    gap: "1rem",
  },
});

const App = () => {
  const { user } = useContext(UserContext);

  const { setAddingBookmark } = useContext(BookmarksContext);

  // const [addingBookmark, setAddingBookmark] = useState(false);

  const classes = useStyles();

  return (
    <div>
      <Header />
      {user && (
        <Box className={classes.root}>
          <Box className={classes.grid}>
            <div className={classes.container}></div>
            <div className={classes.container}>
              <Bookmarks />
            </div>
            <div className={classes.container}>
              <TimeTracker />
            </div>
          </Box>

          <div className={classes.fab}>
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

          <AddBookmarkDialog />
        </Box>
      )}
    </div>
  );
};

export default App;

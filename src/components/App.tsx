import { Box, Container, Fab } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import AddIcon from "@material-ui/icons/Add";
import React, { useContext } from "react";
import AddBookmarkDialog from "./AddBookmarkDialog";
import Bookmarks from "./Bookmarks";
import { BookmarksContext, UserContext } from "./Contexts";
import Header from "./Header";
import TimeTracker from "./TimeTracker";

const useStyles = makeStyles({
  root: {},
  main: {
    backgroundColor: "#363636",
  },
  fab: {
    position: "fixed",
    bottom: "1rem",
    right: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: `10% auto 10%`,
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
        <main className={classes.root}>
          {/* === Main outer grid === */}
          <div className={classes.grid}>
            <Container></Container>
            <Container>
              <Bookmarks />
            </Container>
            <Container>{/* <TimeTracker /> */}</Container>
          </div>

          {/* === FAB === */}
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
        </main>
      )}
    </div>
  );
};

export default App;

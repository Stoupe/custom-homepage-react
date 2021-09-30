import { Container, Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import React, { useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import AddBookmarkDialog from "./AddBookmarkDialog";
import Bookmarks from "./Bookmarks";
import { BookmarksContext, UserContext } from "./Contexts";
import Header from "./Header";

const useStyles = makeStyles((theme) => ({
  root: {},
  fab: {
    position: "fixed",
    bottom: "1rem",
    right: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: `10% auto 10%`,

    // [theme.breakpoints.down("sm")]: {
    //   gridTemplateColumns: `0% auto 0%`,
    // },

    gap: 0,
  },
}));

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
            <Container>{/*<TimeTracker />*/}</Container>
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

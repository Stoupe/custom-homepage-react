import { Container, Fab, makeStyles } from "@material-ui/core";
import React, { useContext } from "react";
import Header from "./Header";
import { useFirebase } from "../functions/firebase";
import { UserContext } from "./Contexts";
import Bookmarks from "./Bookmarks";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  fab: {
    position: "absolute",
    bottom: "1rem",
    right: "1rem",
  },
}));

const App = () => {
  const styles = useStyles();
  useFirebase();
  const { user } = useContext(UserContext);

  return (
    <div>
      <Header />
      {user && (
        <Container>
          <Bookmarks />
        </Container>
      )}
      <Fab
        color="primary"
        aria-label="add bookmark"
        size="large"
        className={styles.fab}
        // style={{ position: "fixed", borderRadius: "50%" }}
      >
        <AddIcon />
      </Fab>
    </div>
  );
};

export default App;

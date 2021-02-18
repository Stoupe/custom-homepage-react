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
  // const { bookmarks, setBookmarks } = useContext(BookmarksContext);
  // const db = useFirebase();

  // const bookmarksRef = db
  //   .collection("users")
  //   .doc(user.uid)
  //   .collection("bookmarks");

  /**
   * Set up listener for bookmarks
   */
  // useEffect(() => {
  //   const observer = bookmarksRef.onSnapshot(
  //     (querySnapshot) => {
  //       if (!querySnapshot.empty) {
  //         const tempBookmarks = {};

  //         querySnapshot.docs.forEach((doc) => {
  //           const data = doc.data();
  //           const id = doc.id;
  //           const category = data.category;

  //           if (!tempBookmarks[category]) {
  //             tempBookmarks[category] = {};
  //           }

  //           tempBookmarks[category][id] = data;
  //         });

  //         setBookmarks(tempBookmarks);
  //       }
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );

  //   return () => {
  //     observer();
  //   };
  // }, []);

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
            addingBookmark={addingBookmark}
            setAddingBookmark={setAddingBookmark}
          />
        </>
      )}
    </div>
  );
};

export default App;

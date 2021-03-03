import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./main.css";
import App from "./components/App";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { BookmarksContext, UserContext } from "./components/Contexts";
import firebase from "firebase/app";
import { StylesProvider } from "@material-ui/core/styles";
import { useFirebase } from "./functions/firebase";

const Main = () => {
  useFirebase();

  const [user, setUser] = useState<firebase.User>(
    JSON.parse(localStorage.getItem("user"))
  );

  const [bookmarks, setBookmarks] = useState<Record<string, any>>({});
  const [addingBookmark, setAddingBookmark] = useState<boolean>(false);
  const [editingView, setEditingView] = useState<boolean>(false);
  const [
    editingBookmark,
    setEditingBookmark,
  ] = useState<firebase.firestore.DocumentReference>(null);

  return (
    <React.StrictMode>
      <UserContext.Provider value={{ user, setUser }}>
        <BookmarksContext.Provider
          value={{
            bookmarks,
            setBookmarks,
            addingBookmark,
            setAddingBookmark,
            editingView,
            setEditingView,
            editingBookmark,
            setEditingBookmark,
          }}
        >
          <StylesProvider injectFirst>
            <App />
          </StylesProvider>
        </BookmarksContext.Provider>
      </UserContext.Provider>
    </React.StrictMode>
  );
};

ReactDOM.render(<Main />, document.getElementById("root"));

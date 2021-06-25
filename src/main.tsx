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
// import StylesProvider from "@material-ui/styles";
import { useFirebase } from "./functions/firebase";
import {
  createTheme,
  ThemeProvider,
  responsiveFontSizes,
  ThemeOptions,
} from "@material-ui/core/styles";

export const themeOptions: ThemeOptions = {
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          width: "calc(100% - 20px)",
          margin: 10,
          borderRadius: 50,
        },
      },
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#6541B3",
    },
    secondary: {
      main: "#f50057",
    },
  },
  typography: {
    fontFamily: "Poppins",
  },
};

const Main = () => {
  useFirebase();

  const [user, setUser] = useState<firebase.User>(
    JSON.parse(localStorage.getItem("user"))
  );

  const [bookmarks, setBookmarks] = useState<Record<string, any>>({});
  const [addingBookmark, setAddingBookmark] = useState<boolean>(false);
  const [editingView, setEditingView] = useState<boolean>(false);
  const [editingBookmark, setEditingBookmark] =
    useState<firebase.firestore.DocumentReference>(null);

  let theme = createTheme(themeOptions);
  theme = responsiveFontSizes(theme);

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
          {/* <StylesProvider injectFirst> */}
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
          {/* </StylesProvider> */}
        </BookmarksContext.Provider>
      </UserContext.Provider>
    </React.StrictMode>
  );
};

ReactDOM.render(<Main />, document.getElementById("root"));

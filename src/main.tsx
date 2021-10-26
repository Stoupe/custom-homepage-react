// import { Theme, ThemeProvider } from "@emotion/react";
import {
  createTheme,
  responsiveFontSizes,
  Theme,
  ThemeOptions,
} from "@material-ui/core/styles";
import firebase from "firebase/app";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { BookmarksContext, UserContext } from "./components/Contexts";
import { useFirebase } from "./functions/firebase";
import "./main.css";
import colours from "./variables/colours";
import ThemeProvider from "@material-ui/core/styles/ThemeProvider";

declare module "@material-ui/styles" {
  interface DefaultTheme extends Theme {}
}

const themeOptions: ThemeOptions = {
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          width: "calc(100% - 20px)",
          margin: 10,
          borderRadius: 25,
        },
      },
    },
  },
  palette: {
    mode: "dark",
    background: { default: colours.grey },
    primary: {
      main: colours.purple,
    },
    secondary: {
      main: colours.red,
    },
  },
  typography: {
    fontFamily: "Poppins",
    allVariants: {
      color: "white",
    },
    h1: {
      fontSize: 22,
      fontWeight: 400,
      color: "black",
    },
    h2: {
      color: "white",
      fontSize: 20,
      fontWeight: 600,
      // textAlign: "center",
    },
    h3: {
      fontSize: 12,
      fontWeight: 400,
    },
  },
  // spacing: 10,
  shape: {
    borderRadius: 10,
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

  const theme = responsiveFontSizes(createTheme(themeOptions));
  // theme = responsiveFontSizes(theme);

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

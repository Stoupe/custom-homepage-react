import { Container } from "@material-ui/core";
import React, { useContext } from "react";
import BookmarkCategory from "./components/BookmarkCategory";
import Header from "./components/Header";
import { useFirebase } from "./functions/firebase";
import { UserContext } from "./components/Contexts";

const App = () => {
  useFirebase();
  const { user } = useContext(UserContext);

  return (
    <div>
      <Header />
      {user && (
        <Container>
          <BookmarkCategory />
          <BookmarkCategory />
        </Container>
      )}
    </div>
  );
};

export default App;

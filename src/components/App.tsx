import { Container } from "@material-ui/core";
import React, { useContext } from "react";
import Header from "./Header";
import { useFirebase } from "../functions/firebase";
import { UserContext } from "./Contexts";
import Bookmarks from "./Bookmarks";

const App = () => {
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
    </div>
  );
};

export default App;

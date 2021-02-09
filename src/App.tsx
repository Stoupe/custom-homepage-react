import { Container } from "@material-ui/core";
import React from "react";
import BookmarkCategory from "./components/BookmarkCategory";
import Header from "./components/Header";

const App = () => {
  return (
    <div>
      <Header />
      <Container>
        <BookmarkCategory />
        <BookmarkCategory />
      </Container>
    </div>
  );
};

export default App;

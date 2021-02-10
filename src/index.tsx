import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { UserContext } from "./components/Contexts";
import firebase from "firebase/app";

const Index = () => {
  const [user, setUser] = useState<firebase.User>(
    JSON.parse(localStorage.getItem("user"))
  );

  return (
    <React.StrictMode>
      <UserContext.Provider value={{ user, setUser }}>
        <App />
      </UserContext.Provider>
    </React.StrictMode>
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));

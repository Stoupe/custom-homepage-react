import { Context, createContext } from "react";
import firebase from "firebase";
import "firebase/auth";

export const UserContext: Context<{
  user: firebase.User;
  setUser: React.Dispatch<React.SetStateAction<firebase.User>>;
}> = createContext(null);

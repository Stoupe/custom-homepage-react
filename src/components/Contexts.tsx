import firebase from "firebase";
import "firebase/auth";
import { Context, createContext } from "react";
import { FirebaseBookmark } from "./Types";

type Set<T> = React.Dispatch<React.SetStateAction<T>>;

export const UserContext: Context<{
  user: firebase.User;
  setUser: Set<firebase.User>;
}> = createContext(null);

export const BookmarksContext: Context<{
  bookmarks: Record<string, Record<string, FirebaseBookmark>>;
  setBookmarks: Set<Record<string, Record<string, FirebaseBookmark>>>;

  addingBookmark: boolean;
  setAddingBookmark: Set<boolean>;

  editingView: boolean;
  setEditingView: Set<boolean>;

  editingBookmark: firebase.firestore.DocumentReference;
  setEditingBookmark: Set<firebase.firestore.DocumentReference>;
}> = createContext(null);

import { Context, createContext } from "react";
import firebase from "firebase";
import "firebase/auth";

type Set<T> = React.Dispatch<React.SetStateAction<T>>;

export const UserContext: Context<{
  user: firebase.User;
  setUser: Set<firebase.User>;
}> = createContext(null);

export const BookmarksContext: Context<{
  editingBookmarks: boolean;
  setEditingBookmarks: Set<boolean>;
  addingBookmark: boolean;
  setAddingBookmark: Set<boolean>;
  bookmarks: Record<string, any>;
  setBookmarks: Set<Record<string, any>>;
}> = createContext(null);

import { useContext } from "react";
import { UserContext } from "../components/Contexts";
import { useFirebase } from "./firebase";
export const useBookmarksRef = () => {
  const { user } = useContext(UserContext);
  const bookmarksRef = useFirebase()
    .collection("users")
    .doc(user.uid)
    .collection("bookmarks");
  return bookmarksRef;
};

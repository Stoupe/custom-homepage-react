import { FirebaseBookmark } from "../components/Types";
import firebase from "firebase/app";

export const addNewBookmark = async (
  bookmarksRef: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>,
  { title, url, category, thumbnailUrl, position }: FirebaseBookmark
) => {
  bookmarksRef
    .add({
      title: title,
      url: url,
      category: category,
      thumbnailUrl: thumbnailUrl,
      position: 0,
    })
    .then(() => {
      console.log(`Bookmark '${title}' added!`);
      return Promise.resolve();
    })
    .catch((err) => {
      console.log(err);
      return Promise.reject(err);
    });
};

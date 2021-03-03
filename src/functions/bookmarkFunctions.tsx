import { FirebaseBookmark } from "../components/Types";
import firebase from "firebase/app";

export const addNewBookmark = async (
  bookmarksRef: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>,
  { title, url, category, thumbnailUrl, position = 0 }: FirebaseBookmark
) => {
  console.log("BOOKMARK BEING ADDED TO FIREBASE:");
  console.log({ title, url, category, thumbnailUrl, position });
  bookmarksRef
    .add({
      title: title,
      url: url,
      category: category,
      thumbnailUrl: thumbnailUrl,
      position: position,
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

export const deleteBookmark = async (bookmarksRef, bookmarkId: string) => {
  bookmarksRef
    .doc(bookmarkId)
    .delete()
    .then(() => {
      return Promise.resolve();
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

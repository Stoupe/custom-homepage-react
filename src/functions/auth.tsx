import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const updateLocalStorage = () => {
  const auth = firebase.auth();

  if (auth) {
    localStorage.setItem("user", JSON.stringify(auth.currentUser));
  } else {
    localStorage.setItem("user", null);
  }
};

/**
 * Check whether a user with a given uid exists in the database
 * @param uid
 */
const userInfoExists = async (uid: string) => {
  const db = firebase.firestore();
  const usersRef = db.collection("users").doc(uid);
  let exists: boolean;
  usersRef
    .get()
    .then((docSnapshot) => {
      exists = docSnapshot.exists;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
  return Promise.resolve(exists);
};

/**
 * Create a new entry in the users db collection for the specified user.
 * @param fName
 * @param lName
 * @param email
 */
const createUserInfo = async (
  uid: string,
  fName: string,
  lName: string,
  email: string
) => {
  const db = firebase.firestore();

  const user = {
    fName: fName,
    lName: lName,
    email: email,
    bookmarks: {},
  };

  console.log(user);

  try {
    await db.collection("users").doc(uid).set(user);
  } catch (err) {
    return Promise.reject(err);
  }

  return Promise.resolve();
};

/**
 * Register a New User
 * @param fName
 * @param lName
 * @param email
 * @param password
 */
// export const register = async (
//   fName: string,
//   lName: string,
//   email: string,
//   password: string
// ) => {
//   const auth = firebase.auth();

//   try {
//     const uid = (await auth.createUserWithEmailAndPassword(email, password))
//       .user.uid;
//     await createUserInfo(uid, fName, lName, email);
//   } catch (err) {
//     return Promise.reject(err);
//   }

//   updateLocalStorage();
//   return Promise.resolve(auth.currentUser);
// };

/**
 * Logging in with Google OAuth
 */
export const logInWithGoogle = async () => {
  const auth = firebase.auth();

  try {
    await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());

    if (!auth.currentUser) {
      throw Error("auth.currentUser is still null");
    }

    const userExistsInDB = await userInfoExists(auth.currentUser.uid);

    if (!userExistsInDB) {
      const names = auth.currentUser.displayName.split(" ");

      if (names.length < 2) {
        throw Error("displayName is less than two words");
      }

      const uid = auth.currentUser.uid;
      const fName = names[0];
      const lName = names.slice(1).join(" ");
      const email = auth.currentUser.email;

      await createUserInfo(uid, fName, lName, email);
    }
  } catch (err) {
    return Promise.reject(err);
  }

  updateLocalStorage();
  return Promise.resolve(auth.currentUser);
};

/**
 * Attempt to log in a user with email & password
 */
// export const logIn = async (email: string, password: string) => {
//   const auth = firebase.auth();

//   try {
//     //TODO: If a user tries to sign in with an email associated with a Google account, the page should give them this information
//     await auth.signInWithEmailAndPassword(email, password);
//   } catch (err) {
//     return Promise.reject(err);
//   }

//   updateLocalStorage();
//   return auth.currentUser;
// };

/**
 * Attempt to log out the current user
 */
export const logOut = async () => {
  const auth = firebase.auth();

  try {
    await auth.signOut();
  } catch (err) {
    return Promise.reject(err);
  }

  updateLocalStorage();
  return Promise.resolve(auth.currentUser);
};

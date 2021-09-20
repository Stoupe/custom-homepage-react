import firebase from "firebase/app";
// import "firebase/analytics";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAGv2Mq97DCAOdxnEPtPrFnVcW4ewkbof0",
  authDomain: "personal-bookmarks-568bf.firebaseapp.com",
  databaseURL: "https://personal-bookmarks-568bf.firebaseio.com",
  projectId: "personal-bookmarks-568bf",
  storageBucket: "personal-bookmarks-568bf.appspot.com",
  messagingSenderId: "663430604918",
  appId: "1:663430604918:web:cd91f14591e49f8e2b1757",
  measurementId: "G-8E3VR6P5S2",
};

export const firebaseInit = () => {
  if (firebase.apps.length === 0) {
    // Initialize firebase app
    firebase.initializeApp(firebaseConfig);
  }
};

export const useFirebase = (): firebase.firestore.Firestore => {
  if (firebase.apps.length === 0) {
    // Initialize firebase app
    firebase.initializeApp(firebaseConfig);

    // Enable analytics
    // if ("measurementId" in firebaseConfig && typeof window !== "undefined") {
    //   firebase.analytics();
    // }
  }
  const db = firebase.firestore();
  return db;
};

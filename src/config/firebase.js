import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

var config = {
  apiKey: "AIzaSyDNjT4pY3EhqCdjoJh9II8cLSG1XBCefUQ",
  authDomain: "snake-master-db17d.firebaseapp.com",
  databaseURL: "https://snake-master-db17d.firebaseio.com",
  projectId: "snake-master-db17d",
  storageBucket: "",
  messagingSenderId: "1075293458092"
};
firebase.initializeApp(config);
export const google_provider = new firebase.auth.GoogleAuthProvider();
export default firebase;

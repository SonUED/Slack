import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
var firebaseConfig = {
  apiKey: "AIzaSyDTi-Vjgv8YV86rLby1tLZgMEaIkFQY5oU",
  authDomain: "react-slack-2-ee9be.firebaseapp.com",
  databaseURL: "https://react-slack-2-ee9be.firebaseio.com",
  projectId: "react-slack-2-ee9be",
  storageBucket: "react-slack-2-ee9be.appspot.com",
  messagingSenderId: "762795012436",
  appId: "1:762795012436:web:e7949c19874d0dc06658c1",
  measurementId: "G-3QNDQRWDTG",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;

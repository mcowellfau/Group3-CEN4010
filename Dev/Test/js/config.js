//Practice project for now
const firebaseConfig = {
  apiKey: "AIzaSyBG8PGhE4UyVkhDtRoCFX3DFstBzBrnFjo",
  authDomain: "nutriplay-b404b.firebaseapp.com",
  projectId: "nutriplay-b404b",
  storageBucket: "nutriplay-b404b.appspot.com",
  messagingSenderId: "518981118424",
  appId: "1:518981118424:web:15e3ef7cd14b47c24f6aad",
  measurementId: "G-1QT3GFN7BX"
};

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
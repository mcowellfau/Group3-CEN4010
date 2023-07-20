//Practice project for now
const firebaseConfig = {
    apiKey: "AIzaSyDATD73-A2tiJhKJOeUmDWKzGs2_u49AEM",
    authDomain: "testuserlogin-ae95e.firebaseapp.com",
    projectId: "testuserlogin-ae95e",
    storageBucket: "testuserlogin-ae95e.appspot.com",
    messagingSenderId: "742536000422",
    appId: "1:742536000422:web:6bbb36b37913e1bf8a1567",
    measurementId: "G-KZBMH76HQJ"
  };

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
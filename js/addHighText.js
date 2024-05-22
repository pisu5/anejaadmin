// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
const firebaseConfig = {
  // Your Firebase configuration
  apiKey: "AIzaSyCKhxRMUK7tY774rVuFirGW5_nsjygD9Yo",
  authDomain: "aneja-mall-gwalior.firebaseapp.com",
  projectId: "aneja-mall-gwalior",
  storageBucket: "aneja-mall-gwalior.appspot.com",
  messagingSenderId: "1054095531032",
  appId: "1:1054095531032:web:5676a11dca68b2e98fb76d",
  measurementId: "G-LVSCZC1XN3",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase();

function highlightText() {
  const textInput = document.getElementById("textInput").value;

  // Push highlighted text to Firebase database
  push(ref(database, "AdminData/HighLightText"), {
    text: textInput,
    highlightedAt: new Date().toString(),
  })
    .then(() => {
      alert("Text highlighted and stored in database successfully!");
    })
    .catch((error) => {
      console.error("Error storing text:", error);
    });
}
const idd = document.getElementById("sendText");
idd.addEventListener("click", function () {
  highlightText();
});

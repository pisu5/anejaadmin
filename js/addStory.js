// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKhxRMUK7tY774rVuFirGW5_nsjygD9Yo",
  authDomain: "aneja-mall-gwalior.firebaseapp.com",
  projectId: "aneja-mall-gwalior",
  storageBucket: "aneja-mall-gwalior.appspot.com",
  messagingSenderId: "1054095531032",
  appId: "1:1054095531032:web:5676a11dca68b2e98fb76d",
  measurementId: "G-LVSCZC1XN3",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

function previewMedia() {
  const mediaInput = document.getElementById("mediaInput");
  const mediaPreview = document.getElementById("mediaPreview");
  while (mediaPreview.firstChild) {
    mediaPreview.removeChild(mediaPreview.firstChild);
  }
  const file = mediaInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const mediaType = file.type.split("/")[0];
      let mediaElement;
      if (mediaType === "image") {
        mediaElement = document.createElement("img");
        mediaElement.src = e.target.result;
      } else if (mediaType === "video") {
        mediaElement = document.createElement("video");
        mediaElement.src = e.target.result;
        mediaElement.controls = true;
        mediaElement.autoplay = true;
        mediaElement.muted = true;
        mediaElement.onloadedmetadata = function () {
          const aspectRatio = this.videoWidth / this.videoHeight;
          const maxWidth = 1080;
          const maxHeight = 1920;
          if (aspectRatio > 1) {
            // Landscape
            if (this.videoWidth > maxWidth) {
              this.width = maxWidth;
              this.height = maxWidth / aspectRatio;
            }
          } else {
            // Portrait or square
            if (this.videoHeight > maxHeight) {
              this.height = maxHeight;
              this.width = maxHeight * aspectRatio;
            }
          }
        };
      }
      mediaPreview.appendChild(mediaElement);
    };
    reader.readAsDataURL(file);
  }
}
const subBtn = document.getElementById("subBtn");
subBtn.addEventListener("click", function () {
  uploadToFirebase();
});

function uploadToFirebase() {
  console.log("func callrd");
  const storyName = document.getElementById("storyName").value;
  const mediaFile = document.getElementById("mediaInput").files[0];
  const duration = document.getElementById("duration").value;

  // Create a storage reference
  const storageRef = firebase
    .storage()
    .ref()
    .child("media/" + mediaFile.name);

  // Upload file to Firebase Storage
  storageRef
    .put(mediaFile)
    .then((snapshot) => {
      // Get the download URL of the uploaded file
      return snapshot.ref.getDownloadURL();
      console.log(snapshot.ref.getDownloadURL());
    })
    .then((downloadURL) => {
      // Store details in Firebase Realtime Database
      firebase.database().ref("AdminData").child("stories").push({
        storyName: storyName,
        mediaURL: downloadURL,
        duration: duration,
      });

      alert("Story uploaded successfully!");
      console.log("data stored");
    })
    .catch((error) => {
      console.error("Error uploading file: ", error);
    });
}

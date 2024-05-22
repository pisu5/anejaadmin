// Initialize Firebase with your configuration
const firebaseConfig = {
    apiKey: "AIzaSyCKhxRMUK7tY774rVuFirGW5_nsjygD9Yo",
    authDomain: "aneja-mall-gwalior.firebaseapp.com",
    projectId: "aneja-mall-gwalior",
    storageBucket: "aneja-mall-gwalior.appspot.com",
    messagingSenderId: "1054095531032",
    appId: "1:1054095531032:web:5676a11dca68b2e98fb76d",
    measurementId: "G-LVSCZC1XN3",
  };

firebase.initializeApp(firebaseConfig);

// Reference to Firebase Storage
const storageRef = firebase.storage().ref();

// Get a reference to the database service
const database = firebase.database();

// Handle form submission
document.getElementById('myForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const image = document.getElementById('image').files[0]; // Get the selected image file

    // Upload image to Firebase Storage
    uploadImage(image)
        .then((imageUrl) => {
            // Save data to Firebase Realtime Database
            return saveDataToDatabase(name, email, imageUrl);
        })
        .then(() => {
            console.log('Data saved successfully.');
            // Optionally, you can reset the form here
            document.getElementById('myForm').reset();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

// Function to upload image to Firebase Storage
function uploadImage(file) {
    // Create a reference to 'images/' + file.name
    const imageRef = storageRef.child('images/' + file.name);

    // Upload file to the reference
    return imageRef.put(file)
        .then((snapshot) => {
            console.log('Image uploaded successfully');
            // Get the download URL of the uploaded image
            return snapshot.ref.getDownloadURL();
        })
        .catch((error) => {
            console.error('Error uploading image:', error);
            throw error; // Rethrow the error for handling
        });
}

// Function to save data to Firebase Realtime Database
function saveDataToDatabase(name, email, imageUrl) {
    // Save data to Firebase Realtime Database
    return database.ref('formData').push({
        name: name,
        email: email,
        imageUrl: imageUrl // Add image URL to the data
    });
}

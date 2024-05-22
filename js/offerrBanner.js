// Initialize Firebase
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
  firebase.initializeApp(firebaseConfig);
  
  // Get a reference to the storage service
  var storage = firebase.storage();
  
  // Get a reference to the database service
  var database = firebase.database();
  
  // Function to handle banner upload
  function uploadBanner(file, size) {
    var storageRef = storage.ref('banners/' + file.name);
    var uploadTask = storageRef.put(file);
  
    uploadTask.on('state_changed', function(snapshot){
        console.log(snapshot);
      // Observe state change events such as progress, pause, and resume
    }, function(error) {
      // Handle unsuccessful uploads
      console.error('Upload failed:', error);
    }, function() {
        alert("Upload Successfully")
      // Handle successful uploads on complete
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        // Upload URL to realtime database
        database.ref('AdminData').child("OfferBanner").push({
          url: downloadURL,
          size: size
        });
  
        // Show banner preview
        showBannerPreview(downloadURL);
      });
    });
  }
  
  // Function to show banner preview
  function showBannerPreview(url) {
    var bannerPreviewContainer = document.getElementById('bannerPreviewContainer');
    var bannerPreview = document.getElementById('bannerPreview');
  
    bannerPreview.src = url;
    bannerPreviewContainer.style.display = 'block';
  }
  
  // Handle form submission
  var form = document.getElementById('uploadForm');
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
  
    var fileInput = document.getElementById('bannerFile');
    var sizeInput = document.getElementById('bannerSize');
  
    var file = fileInput.files[0];
    var size = sizeInput.value;
  
    if (file) {
      uploadBanner(file, size);
    } else {
      alert('Please select a banner file.');
    }
  });
  
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

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const desktopFile = document.getElementById("bannerFileDesktop").files[0];
  const mobileFile = document.getElementById("bannerFileMobile").files[0];
  const desktopSize = document.getElementById("bannerSizeDesktop").value;
  const mobileSize = document.getElementById("bannerSizeMobile").value;

  if (!desktopFile || !mobileFile) {
    alert("Please select both desktop and mobile banner files.");
    return;
  }

  try {
    const desktopSnapshot = await uploadFile(desktopFile, "desktop");
    const mobileSnapshot = await uploadFile(mobileFile, "mobile");

    const desktopUrl = await desktopSnapshot.ref.getDownloadURL();
    const mobileUrl = await mobileSnapshot.ref.getDownloadURL();

    await saveBannerData(desktopUrl, desktopSize, "desktop");
    await saveBannerData(mobileUrl, mobileSize, "mobile");

    showBannerPreview(desktopUrl, "desktop");
    showBannerPreview(mobileUrl, "mobile");

    alert("Banners uploaded successfully!");
  } catch (error) {
    console.error("Error uploading banners:", error);
    alert("Failed to upload banners. Please try again.");
  }
});

function uploadFile(file, type) {
  const storageRef = storage.ref(`banners/${type}/${file.name}`);
  return storageRef.put(file);
}

function saveBannerData(url, size, type) {
  const bannerRef = database.ref(`AdminData/Banners/${type}`).push();
  return bannerRef.set({
    url: url,
    size: size,
  });
}

function showBannerPreview(url, type) {
  const previewContainer =
    type === "desktop" ? "bannerPreviewDesktop" : "bannerPreviewMobile";
  const bannerPreview = document.getElementById(previewContainer);
  const bannerPreviewContainer = document.getElementById(
    "bannerPreviewContainer"
  );

  bannerPreview.src = url;
  bannerPreviewContainer.style.display = "block";
}

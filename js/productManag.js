console.log("Script loaded successfully");

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
console.log("Firebase initialized");

const database = firebase.database();
console.log("Database reference acquired");

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");

  const productCategory = document.getElementById("productCategory");
  const productCollection = document.getElementById("productCollection");
  const addProductForm = document.getElementById("addProductForm");
  const loader = document.getElementById("loader");

  if (productCategory && productCollection && addProductForm) {
    console.log("Elements found");

    productCategory.addEventListener("change", function () {
      const newCategoryInput = document.getElementById("newCategoryInput");
      if (this.value === "Create New One") {
        newCategoryInput.style.display = "inline-block";
        newCategoryInput.required = true;
      } else {
        newCategoryInput.style.display = "none";
        newCategoryInput.required = false;
      }
    });

    productCollection.addEventListener("change", function () {
      const newCollectionInput = document.getElementById("newCollectionInput");
      const discountInput = document.getElementById("discountInput");
      if (this.value === "Create New One") {
        newCollectionInput.style.display = "inline-block";
        newCollectionInput.required = true;
      } else if (this.value === "Sale") {
        discountInput.style.display = "inline-block";
        discountInput.required = true;
      } else {
        newCollectionInput.style.display = "none";
        newCollectionInput.required = false;
        discountInput.style.display = "none";
        discountInput.required = false;
      }
    });

    addProductForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log("Form submission triggered");

      const productName = document.getElementById("productName").value.trim();
      const productDescription = document
        .getElementById("productDescription")
        .value.trim();
      let selectedCategory = document.getElementById("productCategory").value;
      let selectedCollection =
        document.getElementById("productCollection").value;
      const quantity = parseInt(
        document.getElementById("productQuantity").value
      );
      const price = parseFloat(document.getElementById("productPrice").value);
      const selectedSizes = Array.from(
        document.querySelectorAll('input[name="productSizes"]:checked')
      ).map((cb) => cb.value);
      const discount = document.getElementById("discountInput").value;
      const productImages = document.getElementById("productImages").files;
      const productColors = document
        .getElementById("productColors")
        .value.trim();
      const productHighlights = document
        .getElementById("productHighlights")
        .value.trim();

      console.log({
        productName,
        productDescription,
        selectedCategory,
        selectedCollection,
        quantity,
        price,
        selectedSizes,
        discount,
        productImages,
        productColors,
        productHighlights,
      });

      if (selectedCategory === "Create New One") {
        selectedCategory = document.getElementById("newCategoryInput").value;
      }

      if (selectedCollection === "Create New One") {
        selectedCollection =
          document.getElementById("newCollectionInput").value;
      }

      if (productImages.length < 4) {
        alert("Please upload at least 4 images.");
        return;
      }

      try {
        // Show the loader
        loader.style.display = "block";

        console.log("Starting to add product...");
        const productId = database.ref("AdminData/Products").push().key;
        console.log("Generated product ID:", productId);

        const imageUrls = await uploadImages(productImages, productId);
        console.log("Image URLs:", imageUrls);

        await saveDataToDatabase(
          productName,
          productDescription,
          selectedCategory,
          selectedCollection,
          quantity,
          price,
          selectedSizes,
          imageUrls,
          discount,
          productColors,
          productHighlights
        );
        console.log("Product added successfully.");
        addProductForm.reset();
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while adding the product. Please try again.");
      } finally {
        // Hide the loader
        loader.style.display = "none";
      }
    });
  } else {
    console.error("One or more elements not found");
  }
});

async function uploadImages(files, productId) {
  const storageRef = firebase.storage().ref();
  const uploadPromises = Array.from(files).map((file) => {
    const imageRef = storageRef.child(`images/${productId}/${file.name}`);
    return imageRef.put(file).then((snapshot) => snapshot.ref.getDownloadURL());
  });
  return Promise.all(uploadPromises);
}

function saveDataToDatabase(
  productName,
  productDescription,
  category,
  collection,
  quantity,
  price,
  selectedSizes,
  imageUrls,
  discount,
  productColors,
  productHighlights
) {
  const productRef = database.ref("AdminData").child("Products").push();
  return productRef.set({
    name: productName,
    description: productDescription,
    category,
    collection,
    quantity,
    price,
    size: selectedSizes,
    imageUrls,
    discount,
    colors: productColors,
    highlights: productHighlights,
  });
}

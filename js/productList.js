document.addEventListener("DOMContentLoaded", function () {
  const productTableBody = document.getElementById("productTableBody");
  const visibleSwitch = document.getElementById("visibleSwitch");
  const totalProductsElement = document.getElementById("totalProducts");
  const addProductBtn = document.getElementById("addProductBtn");
  const productModal = document.getElementById("productModal");
  const closeBtn = document.querySelector(".close");
  const productForm = document.getElementById("productForm");
  const productNameInput = document.getElementById("productName");
  const productPriceInput = document.getElementById("productPrice");
  const productImageInput = document.getElementById("productImage");

  let products = []; // Array to store all products

  // Initialize Firebase and database reference
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
  const database = firebase.database().ref("AdminData/Products");

  // Fetch products from Firebase
  database.on("value", function (snapshot) {
    products = []; // Clear products array
    productTableBody.innerHTML = ""; // Clear existing table rows

    snapshot.forEach(function (childSnapshot) {
      const product = childSnapshot.val();
      product.key = childSnapshot.key; // Store product key

      // Add only visible products or all products based on switch state
      if (!visibleSwitch.checked || product.visible) {
        products.push(product); // Add product to array

        // Create table row for product
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${product.key}</td>
          <td><img src="${product.imageUrls[0]}" alt="${product.name}" /></td>
          <td>${product.name}</td>
          <td>${product.price}</td>
          <td>
            <button class="btn-edit" data-key="${product.key}">Edit</button>
            <button class="btn-delete" data-key="${product.key}">Delete</button>
          </td>
        `;
        productTableBody.appendChild(tr);
      }
    });

    // Update total products count
    totalProductsElement.textContent = products.length;
  });

  // Toggle visibility based on switch state
  visibleSwitch.addEventListener("change", function () {
    database.off(); // Turn off previous listener
    database.on("value", function (snapshot) {
      // Same logic as above to fetch products
      // The listener will automatically update the table based on switch state
    });
  });

  // Add product button click handler
  addProductBtn.addEventListener("click", function () {
    productModal.style.display = "block";
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
    productForm.reset(); // Clear form fields
    document.getElementById("modalTitle").textContent = "Add Product";
  });

  // Close modal button click handler
  closeBtn.addEventListener("click", function () {
    productModal.style.display = "none";
    document.body.style.overflow = "auto"; // Restore scrolling
  });

  // Modal close on outside click (click on modal overlay)
  window.addEventListener("click", function (event) {
    if (event.target === productModal) {
      productModal.style.display = "none";
      document.body.style.overflow = "auto"; // Restore scrolling
    }
  });

  // Form submission handler for adding/editing products
  productForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const productName = productNameInput.value.trim();
    const productPrice = parseFloat(productPriceInput.value);
    const productImages = productImageInput.files;

    if (!productName || !productPrice || productImages.length === 0) {
      alert("Please fill in all fields and upload at least one image.");
      return;
    }

    try {
      const productId = database.push().key; // Generate unique product ID
      const imageUrls = await uploadImages(productImages, productId);

      // Save product data to Firebase
      await saveDataToDatabase(productId, productName, productPrice, imageUrls);
      productModal.style.display = "none";
      document.body.style.overflow = "auto"; // Restore scrolling
      productForm.reset(); // Clear form fields
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred while adding the product. Please try again.");
    }
  });

  // Function to upload images to Firebase Storage
  async function uploadImages(files, productId) {
    const storageRef = firebase.storage().ref();
    const uploadPromises = Array.from(files).map((file) => {
      const imageRef = storageRef.child(`images/${productId}/${file.name}`);
      return imageRef
        .put(file)
        .then((snapshot) => snapshot.ref.getDownloadURL());
    });
    return Promise.all(uploadPromises);
  }

  // Function to save product data to Firebase Database
  async function saveDataToDatabase(
    productId,
    productName,
    productPrice,
    imageUrls
  ) {
    await database.child(productId).set({
      name: productName,
      price: productPrice,
      imageUrls: imageUrls,
      visible: true, // Default visibility for new products
    });
  }

  // Edit and delete buttons (event delegation)
  productTableBody.addEventListener("click", function (event) {
    const target = event.target;
    if (target.classList.contains("btn-edit")) {
      const productId = target.getAttribute("data-key");
      // Implement edit functionality (open modal with pre-filled data)
      // Example: Retrieve product data from Firebase and pre-fill form for editing
      // productModal.style.display = "block";
      // Populate form fields with existing product data for editing
    } else if (target.classList.contains("btn-delete")) {
      const productId = target.getAttribute("data-key");
      // Implement delete functionality (remove product from Firebase)
      // Example: Confirm deletion and then database.child(productId).remove()
    }
  });
});

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
const storage = firebase.storage();
console.log("Database and storage references acquired");

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");

    const productTableBody = document.getElementById('productTableBody');
    const productModal = document.getElementById('productModal');
    const closeModal = document.querySelector('.close');
    const addProductBtn = document.getElementById('addProductBtn');
    const productForm = document.getElementById('productForm');
    const modalTitle = document.getElementById('modalTitle');
    const productIdInput = document.getElementById('productId');
    const productNameInput = document.getElementById('productName');
    const productPriceInput = document.getElementById('productPrice');
    const productImageInput = document.getElementById('productImage');

    let products = [];
    let editingProductIndex = -1;

    function openModal() {
        productModal.style.display = 'block';
    }

    function closeModalFunction() {
        productModal.style.display = 'none';
        productForm.reset();
        editingProductIndex = -1;
        modalTitle.textContent = 'Add Product';
    }

    closeModal.addEventListener('click', closeModalFunction);
    window.addEventListener('click', (event) => {
        if (event.target === productModal) {
            closeModalFunction();
        }
    });

    addProductBtn.addEventListener('click', () => {
        openModal();
    });

    productForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = productIdInput.value || Date.now().toString();
        const name = productNameInput.value;
        const price = productPriceInput.value;
        const productImages = productImageInput.files;

        if (productImages.length < 4) {
            alert("Please upload at least 4 images.");
            return;
        }

        try {
            let imageUrls = [];

            for (let file of productImages) {
                const imageRef = storage.ref(`images/${id}/${file.name}`);
                await imageRef.put(file);
                const imageUrl = await imageRef.getDownloadURL();
                imageUrls.push(imageUrl);
            }

            const product = { id, name, price, imageUrls };

            if (editingProductIndex >= 0) {
                products[editingProductIndex] = product;
                database.ref('AdminData/Products/' + id).set(product);
            } else {
                products.push(product);
                database.ref('AdminData/Products/' + id).set(product);
            }

            renderProducts();
            closeModalFunction();
        } catch (error) {
            console.error("Error uploading image or saving product:", error);
        }
    });

    function fetchProducts() {
        database.ref('AdminData/Products').on('value', (snapshot) => {
            products = [];
            snapshot.forEach((childSnapshot) => {
                const product = childSnapshot.val();
                product.id = childSnapshot.key;
                products.push(product);
            });
            renderProducts();
        });
    }

    function renderProducts() {
        productTableBody.innerHTML = '';
        products.forEach((product) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td><img src="${product.imageUrls[0]}" alt="${product.name}" style="width: 50px; height: 50px;"></td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>
                    <button class="btn-primary" onclick="editProduct('${product.id}')"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn-primary" onclick="deleteProduct('${product.id}')"><i class="fas fa-trash"></i> Delete</button>
                </td>
            `;
            productTableBody.appendChild(row);
        });
    }

    window.editProduct = function (id) {
        const product = products.find(p => p.id === id);
        productIdInput.value = product.id;
        productNameInput.value = product.name;
        productPriceInput.value = product.price;
        modalTitle.textContent = 'Edit Product';
        editingProductIndex = products.findIndex(p => p.id === id);
        openModal();
    };

    window.deleteProduct = function (id) {
        database.ref('AdminData/Products/' + id).remove();
        products = products.filter(p => p.id !== id);
        renderProducts();
    };

    fetchProducts();
});

// Simulate recent activities
const recentActivitiesData = [
    "New order received",
    "Product added: T-shirt",
    "Order shipped: ABC123",
    "Product out of stock: XYZ456"
];

// Display recent activities dynamically
const recentActivitiesList = document.getElementById("recentActivitiesList");
recentActivitiesData.forEach(activity => {
    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item");
    listItem.textContent = activity;
    recentActivitiesList.appendChild(listItem);
});

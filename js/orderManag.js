$(document).ready(function () {
    // Sample dummy order data
    var dummyOrderData = [
        {
            orderId: 'ORD123456',
            customerName: 'John Doe',
            orderDate: '2024-05-01',
            totalAmount: '$150',
            status: 'Delivered',
            items: [
                { name: 'Product 1', quantity: 2, price: '$50' },
                { name: 'Product 2', quantity: 1, price: '$50' },
                { name: 'Product 3', quantity: 3, price: '$50' }
            ]
        }
        // Add more dummy order data as needed
    ];

    // Handle view details button click
    $('body').on('click', '.view-detail-btn', function () {
        var orderId = $(this).data('order-id');
        var order = dummyOrderData.find(function (item) {
            return item.orderId === orderId;
        });

        if (order) {
            var orderDetailsHtml = '<p><strong>Order ID:</strong> ' + order.orderId + '</p>';
            orderDetailsHtml += '<p><strong>Customer Name:</strong> ' + order.customerName + '</p>';
            orderDetailsHtml += '<p><strong>Order Date:</strong> ' + order.orderDate + '</p>';
            orderDetailsHtml += '<p><strong>Total Amount:</strong> ' + order.totalAmount + '</p>';
            orderDetailsHtml += '<p><strong>Status:</strong> ' + order.status + '</p>';
            orderDetailsHtml += '<p><strong>Items:</strong></p>';
            orderDetailsHtml += '<ul>';
            order.items.forEach(function (item) {
                orderDetailsHtml += '<li>' + item.name + ' - Quantity: ' + item.quantity + ', Price: ' + item.price + '</li>';
            });
            orderDetailsHtml += '</ul>';

            $('#orderDetailsModal .modal-body').html(orderDetailsHtml);
            $('#orderDetailsModal').modal('show');
        }
    });
});

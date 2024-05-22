$(document).ready(function () {
    // Sample dummy customer data
    var dummyCustomerData = [
        {
            customerId: 'CUST123',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '123-456-7890',
            orders: [
                { orderId: 'ORD123456', date: '2024-05-01', totalAmount: '$150', status: 'Delivered' },
                { orderId: 'ORD789012', date: '2024-05-05', totalAmount: '$200', status: 'Pending' }
            ]
        },
        {
            customerId: 'CUST456',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '456-789-0123',
            orders: [
                { orderId: 'ORD345678', date: '2024-05-03', totalAmount: '$100', status: 'Delivered' },
                { orderId: 'ORD901234', date: '2024-05-07', totalAmount: '$120', status: 'Cancelled' }
            ]
        }
        // Add more dummy customer data as needed
    ];

    // Populate customer table
    var customerTableBody = $('#customerTableBody');
    dummyCustomerData.forEach(function (customer, index) {
        var rowHtml = '<tr>';
        rowHtml += '<td>' + (index + 1) + '</td>';
        rowHtml += '<td>' + customer.customerId + '</td>';
        rowHtml += '<td>' + customer.name + '</td>';
        rowHtml += '<td>' + customer.email + '</td>';
        rowHtml += '<td>' + customer.phone + '</td>';
        rowHtml += '<td><button type="button" class="btn btn-primary btn-sm btn-view-customer-details" data-customer-id="' + customer.customerId + '">View Details</button></td>';
        rowHtml += '</tr>';
        customerTableBody.append(rowHtml);
    });

    // Handle view details button click
    $('body').on('click', '.btn-view-customer-details', function () {
        var customerId = $(this).data('customer-id');
        var customer = dummyCustomerData.find(function (item) {
            return item.customerId === customerId;
        });

        if (customer) {
            var customerDetailsHtml = '<p><strong>Customer ID:</strong> ' + customer.customerId + '</p>';
            customerDetailsHtml += '<p><strong>Name:</strong> ' + customer.name + '</p>';
            customerDetailsHtml += '<p><strong>Email:</strong> ' + customer.email + '</p>';
            customerDetailsHtml += '<p><strong>Phone:</strong> ' + customer.phone + '</p>';
            customerDetailsHtml += '<p><strong>Order History:</strong></p>';
            if (customer.orders.length > 0) {
                customerDetailsHtml += '<ul>';
                customer.orders.forEach(function (order) {
                    customerDetailsHtml += '<li>Order ID: ' + order.orderId + ', Date: ' + order.date + ', Total Amount: ' + order.totalAmount + ', Status: ' + order.status + '</li>';
                });
                customerDetailsHtml += '</ul>';
            } else {
                customerDetailsHtml += '<p>No orders found.</p>';
            }

            $('#customerDetailsModal .modal-body').html(customerDetailsHtml);
            $('#customerDetailsModal').modal('show');
        }
    });
});

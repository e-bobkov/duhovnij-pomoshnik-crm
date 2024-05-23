$(document).ready(function () {
    var auth = localStorage.getItem('auth');

    if (!auth) {
        window.location.href = 'login.html';
    }

    $.ajax({
        url: '/api/users/last7days',
        method: 'GET',
        success: function (data) {
            usersChart.data.labels = data.map(item => item.date);
            usersChart.data.datasets[0].data = data.map(item => item.count);
            usersChart.update();
        }
    });

    $.ajax({
        url: '/api/orders/last7days',
        method: 'GET',
        success: function (data) {
            ordersChart.data.labels = data.map(item => item.date);
            ordersChart.data.datasets[0].data = data.map(item => item.count);
            ordersChart.update();
        }
    });

    function formatData(data) {
        return data || data === 0 ? data : '-';
    }

    $.ajax({
        url: '/api/users/tableData',
        method: 'GET',
        success: function (data) {
            $('#totalUsers').text(formatData(data.totalUsers));
            $('#newUsersToday').text(formatData(data.newUsersToday));
            $('#recordNewUsers').text(formatData(data.recordNewUsers));
            $('#recordDate').text(formatData(data.recordDate));
        }
    });

    $.ajax({
        url: '/api/orders/tableData',
        method: 'GET',
        success: function (data) {
            $('#totalOrders').text(formatData(data.totalOrders));
            $('#totalAmount').text(data.totalAmount ? data.totalAmount + '₽' : '-');
            $('#newOrdersToday').text(formatData(data.newOrdersToday));
            $('#totalAmountToday').text(data.totalAmountToday ? data.totalAmountToday + '₽' : '-');
            $('#ordersInWaiting').text(formatData(data.ordersInWaiting));
            $('#ordersCompleted').text(formatData(data.ordersCompleted));
        }
    });
});
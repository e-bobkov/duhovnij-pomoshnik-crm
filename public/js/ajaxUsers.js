$(document).ready(function () {
    var auth = localStorage.getItem('auth');

    if (!auth) {
        window.location.href = 'login.html';
    }
    $.ajax({
        url: '/api/users/all',
        method: 'GET',
        success: function (data) {
            $('table tbody').empty();

            $.each(data, function (i, user) {
                const row = $('<tr>');

                row.append('<td>' + user.id + '</td>');
                row.append('<td>' + user.chat_id + '</td>');
                row.append('<td>' + user.username + '</td>');
                row.append('<td>' + user.first_name + '</td>');
                row.append('<td>' + (user.last_name || '') + '</td>');
                row.append('<td>' + user.created_at + '</td>');

                $('table tbody').append(row);


            });
        }
    });
});
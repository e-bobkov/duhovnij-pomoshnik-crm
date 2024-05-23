$(document).ready(function () {
    var auth = localStorage.getItem('auth');

    if (!auth) {
        window.location.href = 'login.html';
    }
    $.ajax({
        url: '/api/support/all',
        method: 'GET',
        success: function (data) {
            $('table tbody').empty();

            $.each(data, function (i, support) {
                const row = $('<tr>');

                row.append($('<td>').text(support.id));
                row.append($('<td>').text(support.name));
                row.append($('<td>').text(support.phone));
                row.append($('<td>').text(support.email));
                row.append($('<td>').text(support.message));




                $('table tbody').append(row);


            });
        }
    });


});
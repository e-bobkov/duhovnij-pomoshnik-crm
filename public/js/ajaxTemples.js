$(document).ready(function () {
    var auth = localStorage.getItem('auth');

    if (!auth) {
        window.location.href = 'login.html';
    }
    $.ajax({
        url: '/api/temples/all',
        method: 'GET',
        success: function (data) {
            $('table tbody').empty();

            $.each(data, function (i, temple) {
                const row = $('<tr>');

                row.append($('<td>').text(temple.id));
                row.append($('<td>').text(temple.name));
                row.append($('<td>').text(temple.country));
                row.append($('<td>').text(temple.city));



                $('table tbody').append(row);


            });
        }
    });


});
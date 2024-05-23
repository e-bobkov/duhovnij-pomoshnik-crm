var templesData = null;
var usersData = null;
var currentUserId = null;


function fetchData(url, dataVar) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            method: 'GET',
            success: function (data) {
                window[dataVar] = data;
                resolve();
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}

function fetchAndDisplayData(url, callback) {
    $.ajax({
        url: url,
        method: 'GET',
        success: function (data) {
            $('table tbody').empty();
            $.each(data, callback);
        }
    });
}

function handleOrderData(i, order) {
    const row = $('<tr>');
    const status_ru = {
        'waiting': 'В ожидании',
        'in_progress': 'В процессе',
        'completed': 'Завершено'
    };

    row.append('<td>' + order.id + '</td>');
    row.append('<td class="user_id">' + order.user_id + '</td>');
    row.append('<td>' + order.user_phone + '</td>');
    row.append('<td>' + order.user_email + '</td>');
    row.append('<td>' + order.order_amount + '</td>');

    // Создаем селектбокс для статуса
    const statusSelect = $('<select disabled>');
    for (let status in status_ru) {
        const option = $('<option>').val(status).text(status_ru[status]);
        if (status === order.status) {
            option.attr('selected', 'selected');
        }
        statusSelect.append(option);
    }
    row.append($('<td>').append(statusSelect));

    row.append('<td class="temple_id">' + order.temple_id + '</td>');
    row.append('<td>' + order.service_name + '</td>');
    row.append('<td>' + order.service_type + '</td>');
    row.append('<td>' + order.period + '</td>');

    ['created_at', 'started_at', 'completed_at'].forEach(dateField => {
        const dateInput = $('<input type="datetime-local" disabled>');
        dateInput.attr('name', dateField); // Устанавливаем атрибут name
        if (order[dateField]) {
            const formattedDate = moment(order[dateField]).format('YYYY-MM-DDTHH:mm');
            dateInput.val(formattedDate);
            dateInput.attr('data-original', formattedDate);
        } else {
            dateInput.val('-');
            dateInput.attr('data-original', '-');
        }
        row.append($('<td>').append(dateInput));
    });

    // Добавляем кнопки
    row.append('<td><button class="btn btn-primary send-message" disabled>Сообщение</button></td>');
    row.append('<td><button class="btn btn-secondary order-action">Редактировать</button></td>');

    $('table tbody').append(row);
}


$('table').on('click', '.save-action', function () {
    const row = $(this).closest('tr');

    const orderId = row.find('td:first').text();

    const statusSelect = row.find('select');
    const originalStatus = statusSelect.data('original');
    const currentStatus = statusSelect.val();
    let status = null;
    if (originalStatus !== currentStatus) {
        status = currentStatus;
    }

    const dateInputs = row.find('input[type="datetime-local"]');
    let dates = {};
    dateInputs.each(function () {
        const dateInput = $(this);
        const originalDate = dateInput.attr('data-original');
        const currentDate = dateInput.val();
        if (currentDate !== '-') {
            dates[dateInput.attr('name')] = currentDate;
        }
    });


    $.ajax({
        url: '/api/orders/update',
        method: 'POST',
        data: {
            id: orderId,
            status: status,
            created_at: dates['created_at'],
            started_at: dates['started_at'],
            completed_at: dates['completed_at']
        },
        success: function (response) {
            console.log('Заказ успешно обновлен', response);

            // Отключаем все элементы ввода в текущей строке
            row.find('input, select').prop('disabled', true);
            row.find('.send-message').prop('disabled', true);

            // Заменяем кнопки "Сохранить" и "Отмена" на кнопку "Редактировать"
            row.find('.save-action, .cancel-action').parent().html('<button class="btn btn-secondary order-action">Редактировать</button>');


            // Обновляем данные в строке таблицы
            row.find('select').val(status);
            dateInputs.each(function () {
                const dateInput = $(this);
                const dateName = dateInput.attr('name');
                if (dates[dateName]) {
                    dateInput.val(dates[dateName]);
                }
            });
        },
        error: function (error) {
            console.error('Ошибка при обновлении заказа', error);
        }
    });
});
$('table').on('click', '.order-action', function () {
    const row = $(this).closest('tr');

    $(this).replaceWith('<button class="btn btn-success save-action">Сохранить</button><button class="btn btn-danger cancel-action">Отмена</button>');
    row.find('input, select').prop('disabled', false);
    row.find('.send-message').prop('disabled', false);
});
$('table').on('click', '.cancel-action', function () {
    const row = $(this).closest('tr');

    row.find('input, select').prop('disabled', true);
    row.find('.send-message').prop('disabled', true);

    $(this).prev('.save-action').replaceWith('<button class="btn btn-secondary order-action">Редактировать</button>');
    $(this).remove();
});
$('table').on('click', '.send-message', function () {
    let userIdString = $(this).closest('tr').find('td:nth-child(2)').text();
    currentUserId = parseInt(userIdString, 10);
    $('#messageModal').modal('show');
});
$('table').on('change', 'input[type="datetime-local"]', function () {
    $(this).attr('data-original', $(this).val());
});


$('#sendMessage').on('click', function () {
    const messageText = $('#messageText').val();
    const messageFile = $('#messageFileInput')[0].files[0];
    const formData = new FormData();
    formData.append('message', messageText);
    if (messageFile) {
        formData.append('file', messageFile);
    }
    console.log(currentUserId)
    formData.append('currentUserId', currentUserId);

    $.ajax({
        url: '/api/sendMessage',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log('Сообщение успешно отправлено', response);
            $('#messageModal').modal('hide');
        },
        error: function (error) {
            console.error('Ошибка при отправке сообщения', error);
        }
    });
});

$(document).ready(function () {
    var auth = localStorage.getItem('auth');

    if (!auth) {
        window.location.href = 'login.html';
    }

    Promise.all([
        fetchData('/api/temples/all', 'templesData'),
        fetchData('/api/users/all', 'usersData')
    ]).then(() => {
        console.log('templesData', templesData);
        console.log('usersData', usersData);

        fetchAndDisplayData('/api/orders/all', handleOrderData);

        $('table').on('mouseenter', '.temple_id, .user_id', function () {
            const id = parseInt($(this).text(), 10);
            console.log(id);
            let tooltipText = '';

            if ($(this).hasClass('temple_id')) {
                const temple = templesData.find(t => t.id === id);
                tooltipText = temple ? `${temple.name}<br>${temple.city || '-'}<br>${temple.country}` : '';
            } else {
                const user = usersData.find(u => u.id === id);
                tooltipText = user ? `Юзернейм: ${user.username || '-'}<br>Телеграм айди: ${user.chat_id}<br>Имя: ${user.first_name}<br>Дата регистрации: ${user.created_at}` : '';
            }

            $(this).attr('data-original-title', tooltipText).tooltip({html: true}).tooltip('show');
        }).on('mouseleave', '.temple_id, .user_id', function () {
            $(this).tooltip('dispose');
        });
    }).catch(error => {
        console.error('Error fetching data:', error);
    });
});
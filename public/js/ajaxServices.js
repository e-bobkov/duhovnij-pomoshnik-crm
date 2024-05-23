function formatPrice(priceInKopecks) {
    if (priceInKopecks === 0 || priceInKopecks === undefined || priceInKopecks === null || priceInKopecks === '-' || priceInKopecks === '') {
        return '-';
    }
    let priceInRubles = (priceInKopecks / 100).toFixed(2);
    return `${priceInRubles} ₽`;
}

$(document).ready(function () {
    var auth = localStorage.getItem('auth');

    if (!auth) {
        window.location.href = 'login.html';
    }
    var templesData = {};

    $.ajax({
        url: '/api/temples/all',
        method: 'GET',
        success: function (data) {
            $.each(data, function (i, temple) {
                templesData[temple.id] = temple;
            });

            loadServices();
        }
    });

    function loadServices() {
        $.ajax({
            url: '/api/services/all',
            method: 'GET',
            success: function (data) {
                $('table tbody').empty();

                $.each(data, function (i, service) {
                    const row = $('<tr>');
                    const temple = templesData[service.temple_id] || {};
                    const templeInfo = `${temple.name}, ${temple.city || ''}, ${temple.country}`.trim();

                    row.append($('<td>').text(service.id));
                    row.append($('<td>').text(templeInfo));

                    ['note_once_price', 'note_month_price', 'note_half_year_price', 'note_year_price', 'candle_once_price', 'candle_month_price', 'candle_half_year_price', 'candle_year_price'].forEach(priceType => {
                        row.append($('<td>').append($('<input>')
                            .attr({
                                type: 'text',
                                disabled: true,
                                'data-raw-value': service[priceType]
                            })
                            .val(formatPrice(service[priceType]))
                            .addClass('price-input form-control')
                        ));
                    });

                    row.append('<td><button class="btn btn-secondary service-action">Редактировать</button></td>');

                    $('table tbody').append(row);
                });
            }
        });
    }

    $('table').on('click', '.service-action', function () {
        const row = $(this).closest('tr');
        $(this).replaceWith('<button class="btn btn-success save-action">Сохранить</button><button class="btn btn-danger cancel-action">Отмена</button>');

        row.find('input').each(function() {
            $(this).prop('disabled', false).val($(this).data('raw-value')); // Переключаемся на редактирование в копейках
        });
    });

    $('table').on('click', '.cancel-action', function () {
        const row = $(this).closest('tr');

        row.find('input').each(function() {
            $(this).prop('disabled', true).val(formatPrice($(this).data('raw-value')));
        });

        $(this).siblings('.save-action').replaceWith('<button class="btn btn-secondary service-action">Редактировать</button>');
        $(this).remove();
    });

    $('table').on('click', '.save-action', function () {
        const row = $(this).closest('tr');
        const serviceId = row.find('td:first').text();

        const updatedData = {
            id: serviceId,
            note_once_price: row.find('input[data-raw-value]').eq(0).val(),
            note_month_price: row.find('input[data-raw-value]').eq(1).val(),
            note_half_year_price: row.find('input[data-raw-value]').eq(2).val(),
            note_year_price: row.find('input[data-raw-value]').eq(3).val(),
            candle_once_price: row.find('input[data-raw-value]').eq(4).val(),
            candle_month_price: row.find('input[data-raw-value]').eq(5).val(),
            candle_half_year_price: row.find('input[data-raw-value]').eq(6).val(),
            candle_year_price: row.find('input[data-raw-value]').eq(7).val()
        };

        $.ajax({
            url: '/api/services/update',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(updatedData),
            success: function(response) {

                row.find('.save-action, .cancel-action').parent().html('<button class="btn btn-secondary service-action">Редактировать</button>');

                row.find('input').each(function() {
                    const valInKopecks = $(this).val();
                    $(this).prop('disabled', true).val(formatPrice(valInKopecks));
                    $(this).data('raw-value', valInKopecks);
                });
            },
            error: function(error) {
                // Логика обработки ошибки
                console.error('Ошибка при сохранении изменений: ', error);
            }
        });
    });



});
$(document).ready(function() {
    $('form').submit(function(event) {
        event.preventDefault();

        let username = $('#username').val();
        let password = $('#password').val();

        var formData = {
            username: username,
            password: password
        };

        $.ajax({
            type: 'POST',
            url: '/api/admin-login',
            data: formData,
            success: function(response) {
                localStorage.setItem('auth', 'true');
                window.location.href = 'index.html';
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
    });
});

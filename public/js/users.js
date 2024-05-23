const ctx = document.getElementById('users').getContext('2d');
const usersChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Количество пользователей',
            data: [],
            backgroundColor: 'rgba(255, 206, 86, 0.4)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#e2e6f6',
                    stepSize: 1,
                    precision: 0
                },
                title: {
                    display: true,
                    text: 'Количество пользователей',
                    color: '#e2e6f6',
                    font: {
                        size: 12
                    }
                }
            },
            x: {
                ticks: {
                    color: '#e2e6f6',
                    font: {
                        size: 12
                    }
                }
            }
        }
    }
});


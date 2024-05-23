const ctxOrders = document.getElementById('orders').getContext('2d');
const ordersChart = new Chart(ctxOrders, {
    type: 'bar',
    data: {
        labels: ['6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday', 'Today'],
        datasets: [{
            label: 'Количество заказов',
            data: [12, 19, 3, 5, 2, 3, 7],
            backgroundColor: [
                'rgba(75, 192, 192, 0.4)',
                'rgba(75, 192, 192, 0.4)',
                'rgba(75, 192, 192, 0.4)',
                'rgba(75, 192, 192, 0.4)',
                'rgba(75, 192, 192, 0.4)',
                'rgba(75, 192, 192, 0.4)',
                'rgba(75, 192, 192, 0.4)',

            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(75, 192, 192, 1)',

            ],
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
                    text: 'Количество заказов',
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
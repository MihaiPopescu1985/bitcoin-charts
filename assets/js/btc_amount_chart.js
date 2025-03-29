// Access the data from the global variables
const amountData = window.btcDailyAmountData;
const priceData = window.btcDailyPriceData;

// Function to transform data into the expected format
function transformData(data) {
    return Object.entries(data).map(([time, value]) => ({ time, value }));
}

// Transform both datasets
const amountArray = transformData(amountData);
const priceArray = transformData(priceData);

// Get year and month from date string
function getYearMonth(dateString) {
    return dateString.substring(0, 7); // "YYYY-MM"
}

function getDay(dateString) {
    return dateString.substring(8); // "DD"
}

// Group data by month
const monthlyAmountData = {};
amountArray.forEach(item => {
    const yearMonth = getYearMonth(item.time);
    const day = getDay(item.time);
    if (!monthlyAmountData[yearMonth]) {
        monthlyAmountData[yearMonth] = [];
    }
    monthlyAmountData[yearMonth].push({
        time: day,
        tx_count: item.value // Assuming 'value' in priceData corresponds to 'tx_count' for amount
    });
});

const monthlyPriceData = {};
priceArray.forEach(item => {
    const yearMonth = getYearMonth(item.time);
    const day = getDay(item.time);
    if (!monthlyPriceData[yearMonth]) {
        monthlyPriceData[yearMonth] = [];
    }
    monthlyPriceData[yearMonth].push({
        time: day,
        close: item.value // Assuming 'value' in priceData corresponds to 'close' price
    });
});

// Get sorted month keys (assuming both datasets have the same months)
const monthKeys = Object.keys(monthlyAmountData).sort();
let currentMonthIndex = monthKeys.length - 1; // Start with the last month

const ctx = document.getElementById('BTCAmountChart').getContext('2d');
const BTCAmountChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: '',
            data: [],
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            yAxisID: 'y-amount'
        }, {
            label: '',
            data: [],
            type: 'line',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            fill: false,
            yAxisID: 'y-price'
        }]
    },
    options: {
        scales: {
            'y-amount': {
                type: 'linear',
                display: true,
                position: 'left',
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'BTC Amount'
                }
            },
            'y-price': {
                type: 'logarithmic',
                display: true,
                position: 'right',
                beginAtZero: false,
                title: {
                    display: true,
                    text: 'BTC Close Price'
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
        }
    }
});

function updateChart() {
    const currentMonth = monthKeys[currentMonthIndex];
    const monthAmountData = monthlyAmountData[currentMonth];
    const monthPriceData = monthlyPriceData[currentMonth];

    const labels = monthAmountData.map(item => item.time);

    BTCAmountChart.data.labels = labels;
    BTCAmountChart.data.datasets[0].label = "# BTC amount - " + currentMonth;
    BTCAmountChart.data.datasets[0].data = monthAmountData.map(item => item.tx_count);

    BTCAmountChart.data.datasets[1].label = "BTC Close Price - " + currentMonth;
    BTCAmountChart.data.datasets[1].data = monthPriceData.map(item => item.close);

    BTCAmountChart.update();
}

updateChart(); // Initial chart display

document.getElementById('prevButton').addEventListener('click', () => {
    currentMonthIndex = Math.max(0, currentMonthIndex - 1);
    updateChart();
});

document.getElementById('nextButton').addEventListener('click', () => {
    currentMonthIndex = Math.min(monthKeys.length - 1, currentMonthIndex + 1);
    updateChart();
});

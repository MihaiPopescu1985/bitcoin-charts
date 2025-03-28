// Access the data from the global variable
const priceData = window.btcDailyPriceData;

// Convert price data into candlestick format
const candlestickData = priceData.map(entry => ({
    x: new Date(entry.date).getTime(),  // Convert date to timestamp
    o: entry.open,
    h: entry.high,
    l: entry.low,
    c: entry.close,
}));

function getYearMonth(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    return `${year}-${month}`;
}

function getDay(timestamp) {
    const date = new Date(timestamp);
    return String(date.getDate()).padStart(2, '0');
}

// Group candlestick data by month
const monthlyCandlestickData = {};
candlestickData.forEach(item => {
    const yearMonth = getYearMonth(item.x);
    const day = getDay(item.x);
    if (!monthlyCandlestickData[yearMonth]) {
        monthlyCandlestickData[yearMonth] = [];
    }
    monthlyCandlestickData[yearMonth].push({
        x: day, // Use day as 'x' for the monthly grouping
        o: item.o,
        h: item.h,
        l: item.l,
        c: item.c,
    });
});

// Get sorted month keys
const monthPriceKeys = Object.keys(monthlyCandlestickData).sort();
let currentMonthPriceIndex = monthPriceKeys.length - 1; // Start with the last month

console.log(monthlyCandlestickData);
console.log(monthPriceKeys);
console.log(currentMonthPriceIndex);

// Initialize the chart context
const chartContext = document.getElementById('BTCPrice').getContext('2d');

// Create the candlestick chart
const BTCPrice = new Chart(chartContext, {
    type: 'candlestick', // Use candlestick chart type
    data: {
        datasets: [{
            label: 'BTC Daily Prices',
            data: candlestickData,
            backgroundColor: (context) => context.raw.c > context.raw.o ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)',
            borderColor: (context) => context.raw.c > context.raw.o ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 0, 0, 1)',
            borderWidth: 1,
            yAxisID: 'y1' // Use secondary y-axis for price data
        }]
    },
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                },
                title: {
                    display: true,
                    text: 'Date'
                },
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Price'
                },
                position: 'left',
                beginAtZero: false
            },
            y1: {
                title: {
                    display: true,
                    text: 'Price'
                },
                position: 'right',
                grid: {
                    drawOnChartArea: false
                }
            }
        }
    }
});
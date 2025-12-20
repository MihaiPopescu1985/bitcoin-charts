---
layout: null
---

// Data from files
const dataFiles = {
  dailyAmounts: {{ site.data.daily_amounts | jsonify }},
  dailyPrice: {{ site.data.daily_price | jsonify }},
  dailyTxSize: {{ site.data.daily_tx_size | jsonify }}
};

// Charts' configurations
const optionFiles = {
  dailyAmounts: {{ site.data.options.daily_amounts | jsonify }},
  dailyPrice: {{ site.data.options.daily_price | jsonify }},
  dailyTxSize: {{ site.data.options.daily_tx_size | jsonify }}
};

// Display
document.addEventListener('DOMContentLoaded', () => {
    
    // Container initialization
    const chartDom = document.getElementById('main-chart-container');
    const myChart = echarts.init(chartDom);

    const dailyPriceColors = {
        up: '#00da3c',
        down: '#ec0000'
    };

    function splitDailyPriceData(rawData) {
        const categoryData = [];
        const values = [];
        const volumes = [];

        rawData.forEach((row, index) => {
            categoryData.push(row.timestamp);
            values.push([row.open, row.close, row.low, row.high]);
            volumes.push([index, row.volume, row.open > row.close ? 1 : -1]);
        });

        return { categoryData, values, volumes };
    }

    function calculateMA(dayCount, values) {
        const result = [];
        for (let i = 0; i < values.length; i++) {
            if (i < dayCount) {
                result.push('-');
                continue;
            }
            let sum = 0;
            for (let j = 0; j < dayCount; j++) {
                sum += values[i - j][1];
            }
            result.push(+(sum / dayCount).toFixed(3));
        }
        return result;
    }

    // Render the chart
    function renderChart(key) {
        // Loading data and options
        const rawData = dataFiles[key];
        const baseOption = JSON.parse(JSON.stringify(optionFiles[key]));

        if (!rawData || !baseOption) {
            console.error('Data or cofiguration missing for:', key);
            return;
        }

        // Preparing dataset
        if (key === 'dailyTxSize') {
            baseOption.dataset = { source: rawData };
        } else if (key === 'dailyPrice') {
            const data = splitDailyPriceData(rawData);

            baseOption.xAxis[0].data = data.categoryData;
            baseOption.xAxis[1].data = data.categoryData;
            baseOption.series[0].data = data.values;
            baseOption.series[1].data = calculateMA(5, data.values);
            baseOption.series[2].data = calculateMA(10, data.values);
            baseOption.series[3].data = calculateMA(20, data.values);
            baseOption.series[4].data = calculateMA(30, data.values);
            baseOption.series[5].data = data.volumes;

            if (baseOption.visualMap && baseOption.visualMap.pieces) {
                baseOption.visualMap.pieces = [
                    { value: 1, color: dailyPriceColors.down },
                    { value: -1, color: dailyPriceColors.up }
                ];
            }
        } else {
            baseOption.dataset = { source: Object.entries(rawData) };
        }

        // Reset the chart with the new options
        myChart.setOption(baseOption, true);
    }

    // Changing charts
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // UI: Schimbăm clasa active
            navButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Logică: Desenăm graficul cerut
            const key = e.target.getAttribute('data-key');
            renderChart(key);
        });
    });

    // Loading the first chart
    renderChart('dailyTxSize'); 

    // Automatic resize
    window.addEventListener('resize', () => {
        myChart.resize();
    });
});

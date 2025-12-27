---
layout: null
---

// Data from files
const dataFiles = {
  dailyAmounts: {{ site.data.daily_amounts | jsonify }},
  dailyPrice: {{ site.data.daily_price | jsonify }},
  dailyTxSize: {{ site.data.daily_tx_size | jsonify }},
  dailyPriceFeatures: {{ site.data.daily_price_features | jsonify }}
};

// Display
document.addEventListener('DOMContentLoaded', () => {
    
    // Container initialization
    const chartDom = document.getElementById('main-chart-container');
    const myChart = echarts.init(chartDom);
    const dailyPriceDesc = document.getElementById('daily-price-desc');
    let legendLockHandler = null;

    // Render the chart
    function renderChart(key) {
        // Loading data and options
        const rawData = dataFiles[key];
        const chartDef = window.chartRegistry && window.chartRegistry[key];

        if (!rawData || !chartDef) {
            console.error('Data or cofiguration missing for:', key);
            return;
        }

        // Reset the chart with the new options
        if (legendLockHandler) {
            myChart.off('legendselectchanged', legendLockHandler);
            legendLockHandler = null;
        }

        const optionInput = key === 'dailyPrice'
            ? { priceData: rawData, features: dataFiles.dailyPriceFeatures }
            : rawData;

        const option = chartDef.buildOption(optionInput);
        myChart.setOption(option, true);

        if (chartDef.legendRequired && chartDef.legendRequired.length) {
            legendLockHandler = (event) => {
                chartDef.legendRequired.forEach((name) => {
                    if (!event.selected[name]) {
                        myChart.dispatchAction({ type: 'legendSelect', name: name });
                    }
                });
            };
            myChart.on('legendselectchanged', legendLockHandler);
            chartDef.legendRequired.forEach((name) => {
                myChart.dispatchAction({ type: 'legendSelect', name: name });
            });
        }

        if (dailyPriceDesc) {
            dailyPriceDesc.hidden = key !== 'dailyPrice';
        }
    }

    // Changing charts
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // UI: toggle the active class
            navButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Logic: draw the requested chart
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

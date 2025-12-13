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

    // Render the chart
    function renderChart(key) {
        // Loading data and options
        const rawData = dataFiles[key];
        const baseOption = optionFiles[key];

        if (!rawData || !baseOption) {
            console.error('Data or cofiguration missing for:', key);
            return;
        }

        // Preparing dataset
        if (key === 'dailyTxSize') {
             baseOption.dataset = { source: rawData };
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

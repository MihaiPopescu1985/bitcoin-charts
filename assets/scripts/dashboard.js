---
layout: null
---
// List JSON files to load (adjust names/paths if your files are elsewhere).
const jsonFiles = [
  "{{ '/assets/data/daily_transaction_size.json' | relative_url }}",
  "{{ '/assets/data/daily_close_price.json' | relative_url }}",
  "{{ '/assets/data/daily_amounts.json' | relative_url }}"
];

const dashboard = document.getElementById('dashboard');
const chartsMap = Object.create(null);

function humanTitleFromPath(path){
  const parts = path.split('/').pop().split('.').shift().replace(/[_\-]/g,' ');
  return parts.replace(/\b\w/g, s => s.toUpperCase());
}

function createCard(title, id){
  const card = document.createElement('section');
  card.className = 'card';
  const h = document.createElement('h3');
  h.textContent = title;
  const chartDiv = document.createElement('div');
  chartDiv.className = 'chart';
  chartDiv.id = id;
  card.appendChild(h);
  card.appendChild(chartDiv);
  return card;
}

function isObject(v){ return v && typeof v === 'object' && !Array.isArray(v); }

async function loadAndRender(filePath, idx){
  try{
    const res = await fetch(filePath);
    if(!res.ok) throw new Error('Fetch failed: ' + res.status);
    const data = await res.json();

    const title = humanTitleFromPath(filePath);
    const chartId = 'chart-' + idx;

    // create card, mark original index, append
    const card = createCard(title, chartId);
    card.dataset.index = String(idx);
    dashboard.appendChild(card);

    const container = document.getElementById(chartId);

    const dates = Object.keys(data || {}).sort();
    if (dates.length === 0) {
      container.innerHTML = '<div style="color:#b00">No data</div>';
      return;
    }
    const sample = data[dates[0]];
    let option;

    if (isObject(sample)) {
      const categories = Array.from(new Set(dates.flatMap(d => Object.keys(data[d] || {}))));
      const series = categories.map(cat => ({
        name: cat,
        type: 'bar',
        stack: 'total',
        emphasis: { focus: 'series' },
        data: dates.map(d => (data[d] && typeof data[d][cat] === 'number') ? data[d][cat] : 0)
      }));
      option = {
        // hide echarts internal title because the card header (<h3>) already shows the title
        title: { show: false },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { type: 'scroll', top: 36, data: categories },
        grid: { left: '3%', right: '4%', bottom: '12%', containLabel: true },
        xAxis: [{ type: 'category', data: dates }],
        yAxis: [{ type: 'value' }],
        series,
        dataZoom: [
          { type: 'slider', xAxisIndex: 0, start: 0, end: Math.min(100, 100) },
          { type: 'inside', xAxisIndex: 0, start: 0, end: Math.min(100, 100) }
        ],
        toolbox: {
          feature: {
            dataZoom: { xAxisIndex: [0], yAxisIndex: [] },
            restore: {},
            saveAsImage: {}
          },
          right: 10,
          top: 8
        }
      };
    } else {
      const values = dates.map(d => (typeof data[d] === 'number') ? data[d] : Number(data[d]) || 0 );
      option = {
        // hide echarts internal title because the card header (<h3>) already shows the title
        title: { show: false },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: dates },
        yAxis: { type: 'value' },
        series: [{
          name: title,
          type: 'line',
          smooth: true,
          areaStyle: {},
          data: values
        }],
        dataZoom: [
          { type: 'slider', xAxisIndex: 0, start: 0, end: 100 },
          { type: 'inside', xAxisIndex: 0, start: 0, end: 100 }
        ],
        toolbox: {
          feature: {
            dataZoom: { xAxisIndex: [0], yAxisIndex: [] },
            restore: {},
            saveAsImage: {}
          },
          right: 10,
          top: 8
        }
      };
    }

    const chart = echarts.init(container);
    chart.setOption(option);

    // register chart & original index (store as string key)
    chartsMap[String(idx)] = { chart, card, originalIndex: Number(idx) };

    // keep chart sized using ResizeObserver
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(container);
    chartsMap[String(idx)].observer = ro;

    return chartsMap[String(idx)];
  } catch (err){
    console.error('Error loading', filePath, err);
    const errCard = document.createElement('section');
    errCard.className = 'card';
    errCard.innerHTML = `<h3>${humanTitleFromPath(filePath)}</h3><div style="color:#b00">Failed to load ${filePath}: ${err.message}</div>`;
    dashboard.appendChild(errCard);
  }
}

async function init(){
  dashboard.innerHTML = '';
  for (let i = 0; i < jsonFiles.length; i++){
    const f = jsonFiles[i];
    if (!f) continue;
    await loadAndRender(f, i);
  }

  document.querySelectorAll('nav a[data-index]').forEach(a => {
    a.addEventListener('click', (ev) => {
      ev.preventDefault();
      const idx = String(a.getAttribute('data-index'));
      toggleExpand(idx);
    });
  });
}

function restoreOriginalOrder(){
  const cards = Array.from(dashboard.querySelectorAll('.card'));
  cards.sort((a,b) => (Number(a.dataset.index) - Number(b.dataset.index)));
  cards.forEach(c => dashboard.appendChild(c));
}

function toggleExpand(idx){
  const card = document.getElementById('chart-' + idx)?.closest('.card');
  if (!card) return;

  const currentlyExpanded = document.querySelector('.card.expanded');

  // if same card clicked while expanded -> collapse and restore order
  if (currentlyExpanded === card) {
    card.classList.remove('expanded');
    restoreOriginalOrder();
    const entry = chartsMap[String(idx)];
    if (entry && entry.chart) entry.chart.resize();
    return;
  }

  // collapse previous if any
  if (currentlyExpanded) currentlyExpanded.classList.remove('expanded');

  // move this card to be first and expand
  dashboard.prepend(card);
  card.classList.add('expanded');

  // resize charts to account for layout change
  // resize only this chart (and previous if present)
  const entry = chartsMap[String(idx)];
  if (entry && entry.chart) {
    // ensure resize after layout paint
    requestAnimationFrame(() => entry.chart.resize());
  }
  if (currentlyExpanded) {
    const prevIdx = currentlyExpanded.dataset.index;
    const prevEntry = chartsMap[String(prevIdx)];
    if (prevEntry && prevEntry.chart) requestAnimationFrame(() => prevEntry.chart.resize());
  }

  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

document.addEventListener('DOMContentLoaded', init);

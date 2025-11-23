---
layout: null
---
// List JSON files to load, containing data used by charts
const jsonFiles = [
  "{{ '/assets/data/daily_transaction_size.json' | relative_url }}",
  "{{ '/assets/data/daily_close_price.json' | relative_url }}",
  "{{ '/assets/data/daily_amounts.json' | relative_url }}"
];

// Container element for all cards
const dashboard = document.getElementById('dashboard');
// Groups together all the chart instances by their index for easy access and management.
const chartsMap = Object.create(null);

/* ---------------------------
   Utility helpers
   --------------------------- */

/**
 * Converts a file path into a human-readable title.
 * Example:
 *   'assets/data/daily_transaction_size.json' -> 'Daily Transaction Size'
 * @param {string} path
 * @returns {string}
 */
function humanTitleFromPath(path){
  const parts = path.split('/').pop().split('.').shift().replace(/[_\-]/g,' ');
  return parts.replace(/\b\w/g, s => s.toUpperCase());
}

/** Return true when v is a plain object (not null, not array) */
function isObject(v){ return v && typeof v === 'object' && !Array.isArray(v); }

/** Format large numbers to use k/M/B for axis labels and tooltips */
function formatValue(v){
  if (v === null || v === undefined || v === '') return v;
  const n = Number(v);
  if (!isFinite(n)) return v;
  const abs = Math.abs(n);
  if (abs >= 1e9) return (n / 1e9).toFixed(2).replace(/\.00$/,'') + 'B';
  if (abs >= 1e6) return (n / 1e6).toFixed(2).replace(/\.00$/,'') + 'M';
  if (abs >= 1e3) return (n / 1e3).toFixed(2).replace(/\.00$/,'') + 'k';
  return String(n);
}

/* ---------------------------
   ChartCard: encapsulates one card + echarts instance
   --------------------------- */

/**
 * ChartCard manages DOM for a card, the echarts instance and resize/expand behaviour.
 * - title: visible title
 * - id: chart container id
 * - idx: numeric index used as key in chartsMap
 */
class ChartCard {
  constructor(title, id, idx){
    this.title = title;
    this.id = id;
    this.idx = idx;
    this.card = null;
    this.chartContainer = null;
    this.chart = null;
    this.observer = null;
    this.data = null;
    this.expanded = false;
  }

  // Create DOM structure for the card and return the root element
  buildDOM(){
    const card = document.createElement('section');
    card.className = 'card';
    card.dataset.index = String(this.idx);

    // omit external heading to save vertical space; use chart's internal title instead
    const chartDiv = document.createElement('div');
    chartDiv.className = 'chart';
    chartDiv.id = this.id;
    // ensure a sensible minimum height so charts don't shrink too much
    // use a smaller minimum on narrow screens and larger on desktop
    const isMobile = (typeof window !== 'undefined') && window.innerWidth < 700;
    const minHeight = isMobile ? 220 : 320; // px
    chartDiv.style.minHeight = `${minHeight}px`;
    chartDiv.style.height = '100%';
    chartDiv.style.boxSizing = 'border-box';

    // leave a tiny top gap so the chart title does not touch the card edge
    card.style.paddingTop = '6px';
    card.appendChild(chartDiv);

    this.card = card;
    this.chartContainer = chartDiv;
    return card;
  }

  // Mount the card into a parent DOM element
  mount(parent){
    parent.appendChild(this.buildDOM());
  }

  // Initialize echarts with current data and options
  render(data){
    this.data = data;
    if (!this.chartContainer) return;
    if (!this.chart) this.chart = echarts.init(this.chartContainer);
    const option = this._buildOptionFromData(data);
    this.chart.setOption(option);

    // observe container resize and keep chart resized
    if (!this.observer) {
      this.observer = new ResizeObserver(() => this.chart && this.chart.resize());
      this.observer.observe(this.chartContainer);
    }
  }

  // Build echarts option based on data shape
  _buildOptionFromData(data){
    const dates = Object.keys(data || {}).sort();
    const title = this.title;
    const isMobile = (typeof window !== 'undefined') && window.innerWidth < 700;

    if (dates.length === 0) {
      return { title: { show: false }, series: [] };
    }

    const sample = data[dates[0]];
    if (isObject(sample)) {
      // stacked bar series for multiple categories
      const categories = Array.from(new Set(dates.flatMap(d => Object.keys(data[d] || {}))));
      const series = categories.map(cat => ({
        name: cat,
        type: 'bar',
        stack: 'total',
        emphasis: { focus: 'series' },
        data: dates.map(d => (data[d] && typeof data[d][cat] === 'number') ? data[d][cat] : 0)
      }));
      return {
        title: {
          show: true,
          text: title,
          left: 'center',
          top: isMobile ? 6 : 8,
          textStyle: { fontSize: isMobile ? 12 : 14, fontWeight: 500 }
        },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: v => formatValue(v) },
        legend: { type: 'scroll', top: isMobile ? 52 : 36, left: isMobile ? 'center' : undefined, data: categories },
        grid: { left: '3%', right: '4%', bottom: '12%', containLabel: true },
        xAxis: [{ type: 'category', data: dates }],
        yAxis: [{ type: 'value', axisLabel: { formatter: v => formatValue(v) } }],
        series,
        dataZoom: [{ type: 'slider', xAxisIndex: 0, start: 0, end: 100 }, { type: 'inside', xAxisIndex: 0, start: 0, end: 100 }],
        toolbox: { feature: { dataZoom: { xAxisIndex: [0] }, restore: {}, saveAsImage: {} }, right: 10, top: 8 }
      };
    } else {
      // single line series
      const values = dates.map(d => (typeof data[d] === 'number') ? data[d] : Number(data[d]) || 0 );
      return {
        title: {
          show: true,
          text: title,
          left: 'center',
          top: isMobile ? 6 : 8,
          textStyle: { fontSize: isMobile ? 12 : 14, fontWeight: 500 }
        },
        tooltip: { trigger: 'axis', valueFormatter: v => formatValue(v) },
        xAxis: { type: 'category', data: dates },
        yAxis: { type: 'value', axisLabel: { formatter: v => formatValue(v) } },
        series: [{
          name: title,
          type: 'line',
          smooth: true,
          areaStyle: {},
          symbolSize: isMobile ? 6 : 8,
          lineStyle: { width: isMobile ? 2 : 3 },
          data: values
        }],
        dataZoom: [{ type: 'slider', xAxisIndex: 0, start: 0, end: 100 }, { type: 'inside', xAxisIndex: 0, start: 0, end: 100 }],
        toolbox: { feature: { dataZoom: { xAxisIndex: [0] }, restore: {}, saveAsImage: {} }, right: 10, top: 8 }
      };
    }
  }

  // Expand card (add class and let dashboard rearrange)
  expand(){
    if (!this.card) return;
    this.card.classList.add('expanded');
    this.expanded = true;
    // resize chart after layout change
    requestAnimationFrame(() => this.chart && this.chart.resize());
  }

  // Collapse card
  collapse(){
    if (!this.card) return;
    this.card.classList.remove('expanded');
    this.expanded = false;
    requestAnimationFrame(() => this.chart && this.chart.resize());
  }

  // Clean up echarts and observers
  destroy(){
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
    if (this.card && this.card.parentNode) {
      this.card.parentNode.removeChild(this.card);
    }
  }
}

/* ---------------------------
   Dashboard: orchestrates loading and card lifecycle
   --------------------------- */

class Dashboard {
  constructor(jsonFiles, container){
    this.jsonFiles = jsonFiles || [];
    this.container = container;
    this.cards = []; // ordered list of ChartCard instances
    this.map = Object.create(null); // index -> ChartCard
  }

  // Initialize dashboard: clear container, load each JSON and create cards
  async init(){
    if (!this.container) throw new Error('Dashboard container not found');
    this.container.innerHTML = '';
    for (let i = 0; i < this.jsonFiles.length; i++){
      const fp = this.jsonFiles[i];
      if (!fp) continue;
      await this._loadAndCreate(fp, i);
    }
    // wire nav links (if any)
    document.querySelectorAll('nav a[data-index]').forEach(a => {
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        const idx = String(a.getAttribute('data-index'));
        this.toggleExpand(idx);
      });
    });
  }

  // Load JSON, create ChartCard, render and register
  async _loadAndCreate(filePath, idx){
    try {
      const res = await fetch(filePath);
      if (!res.ok) throw new Error('Fetch failed: ' + res.status);
      const data = await res.json();

      const title = humanTitleFromPath(filePath);
      const id = 'chart-' + idx;
      const card = new ChartCard(title, id, idx);
      card.mount(this.container);
      card.render(data);

      this.cards.push(card);
      this.map[String(idx)] = card;
      chartsMap[String(idx)] = { chart: card.chart, card: card.card, originalIndex: Number(idx) };
      return card;
    } catch (err) {
      console.error('Error loading', filePath, err);
      const errCard = document.createElement('section');
      errCard.className = 'card';
      errCard.innerHTML = `<h3>${humanTitleFromPath(filePath)}</h3><div style="color:#b00">Failed to load ${filePath}: ${err.message}</div>`;
      this.container.appendChild(errCard);
    }
  }

  // Restore original order of cards
  restoreOriginalOrder(){
    this.cards.sort((a,b) => a.idx - b.idx).forEach(c => this.container.appendChild(c.card));
  }

  // Toggle expand/collapse for card index
  toggleExpand(idx){
    const card = this.map[String(idx)];
    if (!card) return;

    const currentlyExpanded = this.cards.find(c => c.expanded);

    if (currentlyExpanded === card) {
      card.collapse();
      this.restoreOriginalOrder();
      return;
    }

    if (currentlyExpanded) currentlyExpanded.collapse();

    // Move clicked card to front and expand
    this.container.prepend(card.card);
    card.expand();
    card.card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/* ---------------------------
   bootstrap
   --------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  const d = new Dashboard(jsonFiles, dashboard);
  // expose instance for debugging if needed
  window.__dashboard = d;
  d.init();
});

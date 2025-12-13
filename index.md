---
layout: default
title: BTC Pulse
---

<header class="layout-header">
  <div class="brand">
    <img src="{{ site.baseurl }}/assets/favicon.svg" alt="BTC Pulse" class="logo" />
    <h1>BTC Pulse</h1>
  </div>
</header>

<nav class="layout-nav">
  <ul>
    <li>
      <button class="nav-btn active" data-key="dailyTxSize">
        Daily Transaction Sizes
      </button>
    </li>
    <li>
      <button class="nav-btn" data-key="dailyPrice">
        Daily Close Price
      </button>
    </li>
    <li>
      <button class="nav-btn" data-key="dailyAmounts">
        Daily Amounts
      </button>
    </li>
  </ul>
</nav>

<div class="content-wrapper">
  <section class="layout-main">
    <div id="main-chart-container" style="width: 100%; height: 600px;"></div>
  </section>
</div>

<footer class="layout-footer">© BTC Pulse</footer>

<script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
<script src="{{ site.baseurl }}/assets/scripts/dashboard.js"></script>

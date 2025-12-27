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
        Daily Price
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
    <div id="daily-price-desc" hidden>
      <details open>
        <summary>Reading / interpretare (SAFE + scoruri)</summary>
        <div>
          <h3>Indicatori și interpretare (SAFE + Scores + AGGR)</h3>
          <p>
            <b>Regime (UP/RANGE/DOWN)</b>:
            indică starea dominantă a pieței (trend sau lateral). Ne interesează schimbările de regim și persistența, nu fiecare fluctuație mică.
          </p>
          <p>
            <b>Hazard</b>:
          </p>
          <ul>
            <li><b>P_Corr_10D</b> mare = risc crescut de corecție în ~10 zile → nu accelera acumularea.</li>
            <li><b>P_Reb_10D</b> mare = șanse crescute de rebound → susține hold/accumulate dacă regimul nu e toxic.</li>
          </ul>
          <p>
            <b>E_target_safe</b> (0..1):
            expunerea recomandată în modul SAFE (long-only). Este „baza” în piață. Ajustările sunt lente, pentru stabilitate psihologică și disciplină.
          </p>
          <p>
            <b>Decision Scores</b> (0..1):
          </p>
          <ul>
            <li><b>S_accumulate</b> mare = context bun să crești expunerea (gradual).</li>
            <li><b>S_hold</b> mare = nu forța acțiuni (piața nu oferă edge clar).</li>
            <li><b>S_reduce</b> mare = ia din risc (reduce) / evită adăugările.</li>
            <li><b>S_exit</b> mare = risc structural ridicat (regim toxic). Nu e automatizare: este un „semn de apărare”.</li>
          </ul>
          <hr />
          <p>
            <b>AGGR (mod explorator)</b>:
            aceste câmpuri NU sunt folosite ca decizie principală în v0.2. Ele există ca referință pentru o versiune viitoare mai agresivă.
          </p>
          <ul>
            <li><b>E_target_aggr</b> (0..1): expunerea țintă în modul agresiv (poate reacționa mai puternic).</li>
            <li><b>direction_aggr</b> (-1/0/+1): direcția preferată de poziționare în modul agresiv (short/flat/long).</li>
            <li><b>L_target_aggr</b> (>=1): leverage-ul țintă (doar informativ în v0.2; nu executăm automat).</li>
          </ul>
          <p>
            <i>Notă:</i> în v0.2, deciziile reale se bazează pe SAFE + Scores + Regime. AGGR este doar context.
          </p>
        </div>
      </details>
    </div>
  </section>
</div>

<footer class="layout-footer">© BTC Pulse</footer>

<script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
<script src="{{ site.baseurl }}/assets/scripts/chart-utils.js"></script>
<script src="{{ site.baseurl }}/assets/scripts/charts/daily_amounts.js"></script>
<script src="{{ site.baseurl }}/assets/scripts/charts/daily_price.js"></script>
<script src="{{ site.baseurl }}/assets/scripts/charts/daily_tx_size.js"></script>
<script src="{{ site.baseurl }}/assets/scripts/dashboard.js"></script>

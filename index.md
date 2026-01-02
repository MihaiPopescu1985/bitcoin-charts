---
layout: default
title: BTC Pulse
---

<div class="content-wrapper">
  <section class="layout-main">
    <div>
      <span>SAFE</span>
      <span>Statistical Asset Flow Engine</span>
      <span>— probabilistic regime + hazard + exposure + on-chain</span>
    </div>
    <h1>SAFE: a probabilistic dashboard for BTC decisions</h1>
    <p>
      SAFE is a framework that replaces classic indicators with <b>probabilities</b>.
      It aims to answer one question: <b>“How much risk should I take today?”</b>
      using three layers: <b>Regime</b> (market state), <b>Hazard</b> (risk of adverse move),
      and <b>Exposure</b> (target position sizing), optionally augmented with <b>on-chain signals</b>.
    </p>

    <section>
      <div>
        <h2>What SAFE is (in one paragraph)</h2>
        <p>
          SAFE models price as a <b>living process</b>. Instead of “RSI says oversold”, it produces
          <b>state probabilities</b> such as <span>DOWN_SLOW</span> or <span>RANGE_LOWVOL</span>,
          plus <b>short-horizon statistical measures</b> (e.g., autocorrelation and rebound likelihood) and
          <b>on-chain flow metrics</b>. The output is a consistent, machine-readable set of numbers that can drive
          a strategy, a rules engine, or a training label set for ML.
        </p>

        <div></div>

        <h2>Core design principles</h2>
        <div>
          <div>
            <strong>1) Probabilities, not “signals”</strong>
            <p>
              Each component is calibrated to output values in interpretable scales (e.g., 0..1),
              so multiple sources can be combined without hand-wavy normalization.
            </p>
          </div>
          <div>
            <strong>2) Separation of concerns</strong>
            <p>
              <b>Regime</b> answers “what market are we in?”.
              <b>Exposure</b> answers “how attractive is risk-adjusted participation?”.
              On-chain adds “who is moving?”.
            </p>
          </div>
        </div>

        <div></div>

      </div>

      <div>
        <h2>Glossary (quick)</h2>
        <div>
          <div><b>Regime</b>: market state probabilities</div>
          <div><b>Hazard</b>: risk-of-adverse-move score</div>
          <div><b>Exposure</b>: target position sizing (0..1)</div>
          <div><b>On-chain</b>: network flows + dominance/whales</div>
        </div>

        <div></div>

        <h2>Typical SAFE states</h2>
        <table>
          <thead>
            <tr>
              <th>State</th>
              <th>Meaning</th>
              <th>Typical action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>UP_FAST</td>
              <td>Strong trend + high velocity</td>
              <td>Allow high exposure</td>
            </tr>
            <tr>
              <td>UP_SLOW</td>
              <td>Trend up, controlled pace</td>
              <td>Moderate/high exposure</td>
            </tr>
            <tr>
              <td>RANGE_LOWVOL</td>
              <td>Compression, volatility decay</td>
              <td>Wait for confirmation / mean-reversion rules</td>
            </tr>
            <tr>
              <td>RANGE_HIGHVOL</td>
              <td>Choppy swings, elevated noise</td>
              <td>Reduce exposure, avoid overtrading</td>
            </tr>
            <tr>
              <td>DOWN_SLOW</td>
              <td>Orderly decline, not panic</td>
              <td>Defensive; watch for transition</td>
            </tr>
            <tr>
              <td>DOWN_FAST</td>
              <td>Capitulation / panic dynamics</td>
              <td>Minimal exposure, wait for stabilization</td>
            </tr>
          </tbody>
        </table>

        <p>
          Note: exact actions depend on your ruleset (e.g., long-only, leverage mode, risk budget).
        </p>
      </div>
    </section>

    <h2>Disclaimer</h2>
    <p>
      SAFE is a research/engineering framework and does not constitute financial advice.
      Any strategy built on top of SAFE should include robust risk controls, slippage/fee modeling,
      and out-of-sample validation.
    </p>

  </section>
</div>

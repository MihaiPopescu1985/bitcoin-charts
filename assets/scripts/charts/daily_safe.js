---
layout: null
---
(function (global) {
    'use strict';

    const area = (name, data, xAxisIndex, yAxisIndex, stackKey = 'states') => ({
        name, type: 'line', data,
        xAxisIndex, yAxisIndex,
        stack: stackKey,
        showSymbol: false,
        smooth: true,
        lineStyle: { width: 1.1 },
        areaStyle: { opacity: 0.28 },
        emphasis: { focus: 'series' }
    });

    const line = (name, data, xAxisIndex, yAxisIndex, smooth = true, width = 1.8) => ({
        name, type: 'line', data,
        xAxisIndex, yAxisIndex,
        showSymbol: false,
        smooth,
        lineStyle: { width },
        emphasis: { focus: 'series' }
    });

    function seriesOrFallback(s, key, fallbackKey = null) {
        const a = s[key];
        if (a && a.length) return a.map(v => v == null ? null : +v);
        if (fallbackKey && s[fallbackKey] && s[fallbackKey].length) return s[fallbackKey].map(v => v == null ? null : +v);
        // return array of nulls later (caller can handle)
        return null;
    }

    function pickRegimeSeries(s, mode) {
        const suf = (mode === 'hmm') ? '_HMM' : '';
        const get = (k) => seriesOrFallback(s, k + suf, k); // if hmm missing, fallback to heur

        return [
            ["UP_SLOW", get("P_UP_SLOW")],
            ["UP_FAST", get("P_UP_FAST")],
            ["RANGE_LOWVOL", get("P_RANGE_LOWVOL")],
            ["RANGE_HIGHVOL", get("P_RANGE_HIGHVOL")],
            ["DOWN_SLOW", get("P_DOWN_SLOW")],
            ["DOWN_FAST", get("P_DOWN_FAST")],
        ];
    }

    function buildCloseSeries(dates, dailyPrice) {
        const byDate = new Map();
        (dailyPrice || []).forEach((row) => {
            if (row && row.timestamp) byDate.set(row.timestamp, row);
        });

        return dates.map((d) => {
            const row = byDate.get(d);
            if (!row) return null;
            const close = +row.close;
            if (!isFinite(close)) return null;
            return close;
        });
    }

    function buildOption(rawData) {
        const regimeMode = 'hmm';
        const featuresPayload = rawData && rawData.features ? rawData.features : null;
        const onchainPayload = rawData && rawData.onchain ? rawData.onchain : null;
        const dailyPrice = rawData && rawData.dailyPrice ? rawData.dailyPrice : null;

        if (!featuresPayload || !featuresPayload.dates) {
            return {
                backgroundColor: '#ffffff',
                title: { text: 'SAFE data unavailable', left: 'center', top: 'center', textStyle: { color: '#1f2933' } }
            };
        }

        const dates = featuresPayload.dates;

        // const n = dates.length;
        const featuresSeries = featuresPayload.series;
        const onChainSeries = (onchainPayload && onchainPayload.series) ? onchainPayload.series : {};

        const regimes = pickRegimeSeries(featuresSeries, regimeMode);

        const closes = buildCloseSeries(dates, dailyPrice);

        const pCorr = seriesOrFallback(featuresSeries, "P_CORRECTION_10D_CAL", "P_CORRECTION_10D") || [];
        const pReb = seriesOrFallback(featuresSeries, "P_REBOUND_10D_CAL", "P_REBOUND_10D") || [];

        const E_safe = seriesOrFallback(featuresSeries, "E_target_safe") || [];

        // If some series are missing (null), replace with arrays of nulls for chart consistency
        function ensure(arr) {
            if (arr && arr.length) return arr;
            return new Array(dates.length).fill(null);
        }

        const regSeries = regimes.map(([name, data]) => [name, ensure(data)]);

        // --- On-chain series (date-aligned + smoothing) ---
        const ocDates = (onchainPayload && onchainPayload.dates) ? onchainPayload.dates : [];
        const ocIndex = new Map(ocDates.map((d, i) => [d, i]));

        function ocAligned(key) {
            const src = onChainSeries[key] || [];
            return dates.map((d) => {
                const idx = ocIndex.get(d);
                if (idx == null) return null;
                const v = src[idx];
                return v == null ? null : +v;
            });
        }

        const oc_amount_log = ocAligned('ONCHAIN_AMOUNT_LOG');
        const oc_vol_z = ocAligned('ONCHAIN_VOL_Z');
        const oc_whale_share = ocAligned('ONCHAIN_WHALE_SHARE');
        const oc_dom_z = ocAligned('ONCHAIN_DOM_Z');

        // Disabled
        // Simple moving average that ignores nulls; returns null until window is full
        // function sma(arr, win) {
        //   const out = new Array(arr.length).fill(null);
        //   let sum = 0, cnt = 0;
        //   const q = [];
        //   for (let i = 0; i < arr.length; i++) {
        //     const v = arr[i];
        //     q.push(v);
        //     if (v != null && isFinite(v)) { sum += v; cnt++; }
        //     if (q.length > win) {
        //       const old = q.shift();
        //       if (old != null && isFinite(old)) { sum -= old; cnt--; }
        //     }
        //     out[i] = (q.length === win && cnt > 0) ? (sum / cnt) : null;
        //   }
        //   return out;
        // }

        // // Smooth to reduce daily noise (tweak windows if needed)
        // const oc_amount_log = sma(oc_amount_log_raw, 7);
        // const oc_vol_z = sma(oc_vol_z_raw, 14);
        // const oc_whale_share = sma(oc_whale_share_raw, 7);
        // const oc_dom_z = sma(oc_dom_z_raw, 14);

        return {
    backgroundColor: '#ffffff',
    animation: false,
    title: [],

    toolbox: { right: 12, top: 64, iconStyle: { borderColor: 'rgba(0,0,0,0.35)' }, feature: { dataZoom: { yAxisIndex: 'none' }, restore: {}, saveAsImage: {} } },
    tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        backgroundColor: '#ffffff',
        borderColor: 'rgba(0,0,0,0.15)',
        textStyle: { color: '#1f2933' }
    },
    axisPointer: { link: [{ xAxisIndex: 'all' }] },
    legend: {
        type: 'scroll', top: 36,
        left: 12,
        right: 12,
        textStyle: { color: '#1f2933' },
        itemWidth: 14,
        itemHeight: 8,
        pageIconColor: '#1f2933',
        pageTextStyle: { color: '#52606d' },
        // Pornim cu un set "citibil" by default. Restul rămân în legendă, dar OFF.
        selected: {
        'Price': true,
        'UP_SLOW': true,
        'UP_FAST': true,
        'RANGE_LOWVOL': true,
        'RANGE_HIGHVOL': true,
        'DOWN_SLOW': true,
        'DOWN_FAST': true,
        'P_Corr_10D': true,
        'P_Reb_10D': true,
        'E_target_safe': true,
        'OC_amount_log': true,
        'OC_vol_z': true,
        'OC_whale_share': true,
        'OC_dom_z': true,
        }
    },
    grid: [
        // Layout lizibil + spațiu pentru slider jos (mai mult aer între panouri)
        { left: 60, right: 70, top: '11%', height: '45%' },    // price (mare)
        { left: 60, right: 70, top: '60%', height: '7%' },     // regimes (benzi)
        { left: 60, right: 70, top: '69%', height: '7%' },     // hazard
        { left: 60, right: 70, top: '78%', height: '7%' },     // exposure
        { left: 60, right: 70, top: '87%', height: '7%' },     // onchain (all)
    ],
    xAxis: [
        { type: 'category', data: dates, gridIndex: 0, boundaryGap: true, axisLabel: { color: '#4b5563', hideOverlap: true, margin: 10 } },
        { type: 'category', data: dates, gridIndex: 1, boundaryGap: false, axisLabel: { show: false } },
        { type: 'category', data: dates, gridIndex: 2, boundaryGap: false, axisLabel: { show: false } },
        { type: 'category', data: dates, gridIndex: 3, boundaryGap: false, axisLabel: { show: false } },
        { type: 'category', data: dates, gridIndex: 4, boundaryGap: false, axisLabel: { show: false } },
    ],
    yAxis: [
        {
        type: 'log', gridIndex: 0, scale: true, splitNumber: 6,
        min: (val) => Math.max(1e-8, val.min * 0.98),
        max: (val) => val.max * 1.02,
        axisLabel: {
            color: '#a9b4cc', formatter: (v) => {
            const n = +v;
            if (!isFinite(n) || n <= 0) return '';
            if (n >= 1e6) return (n / 1e6).toFixed(0) + 'M';
            if (n >= 1e3) return (n / 1e3).toFixed(0) + 'k';
            return String(Math.round(n));
            }
        },
        splitLine: { lineStyle: { color: 'rgba(0,0,0,0.08)' } }
        }, // 0 price
        { type: 'value', gridIndex: 1, min: 0, max: 1, axisLine: { lineStyle: { color: 'rgba(0,0,0,0.18)' } }, splitLine: { lineStyle: { color: 'rgba(0,0,0,0.06)' } } }, // 1 regimes
        { type: 'value', gridIndex: 2, min: 0, max: 1, axisLine: { lineStyle: { color: 'rgba(0,0,0,0.18)' } }, splitLine: { lineStyle: { color: 'rgba(0,0,0,0.06)' } } }, // 2 hazard
        { type: 'value', gridIndex: 3, min: 0, max: 1, axisLine: { lineStyle: { color: 'rgba(0,0,0,0.18)' } }, splitLine: { lineStyle: { color: 'rgba(0,0,0,0.06)' } } }, // 3 exposure
        { type: 'value', gridIndex: 4, scale: true, axisLine: { lineStyle: { color: 'rgba(0,0,0,0.18)' } }, splitLine: { lineStyle: { color: 'rgba(0,0,0,0.06)' } } }, // 4 onchain amount_log
        { type: 'value', gridIndex: 4, min: 0, max: 1, axisLine: { lineStyle: { color: 'rgba(0,0,0,0.18)' } }, splitLine: { show: false } }, // 5 onchain whale_share
        { type: 'value', gridIndex: 4, scale: true, axisLine: { lineStyle: { color: 'rgba(0,0,0,0.18)' } }, splitLine: { show: false } }  // 6 onchain z-scores
    ],
    dataZoom: [
        { type: 'inside', xAxisIndex: [0, 1, 2, 3, 4], filterMode: 'filter' },
        { type: 'slider', xAxisIndex: [0, 1, 2, 3, 4], bottom: 10, height: 32, filterMode: 'filter' }
    ],
    series: [
        // PRICE
        {
        name: 'Price',
        type: 'line',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: closes,
        showSymbol: false,
        smooth: true,
        lineStyle: { width: 2 }
        },

        // REGIMES (stacked)
        ...regSeries.map(([name, data]) => area(name, data, 1, 1, 'regimes')),

        // HAZARD
        line('P_Corr_10D', ensure(pCorr), 2, 2, true, 1.7),
        line('P_Reb_10D', ensure(pReb), 2, 2, true, 1.7),

        // EXPOSURE (SAFE is 0..1, AGGR is -1..1)
        line('E_target_safe', ensure(E_safe), 3, 3, true, 1.7),

        line('OC_amount_log', oc_amount_log, 4, 4, true, 1.6),
        line('OC_vol_z', oc_vol_z, 4, 6, true, 1.6),
        line('OC_whale_share', oc_whale_share, 4, 5, true, 1.6),
        line('OC_dom_z', oc_dom_z, 4, 6, true, 1.6),
    ]
        };
    }

    global.chartRegistry = global.chartRegistry || {};
    global.chartRegistry.dailySafe = {
        buildOption: buildOption
    };
})(window);

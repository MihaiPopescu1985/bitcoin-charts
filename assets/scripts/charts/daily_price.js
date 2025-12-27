---
layout: null
---
(function (global) {
    'use strict';

    const REGIME_MODE = 'hmm';
    const REGIME_NAMES = [
        'UP_SLOW',
        'UP_FAST',
        'RANGE_LOWVOL',
        'RANGE_HIGHVOL',
        'DOWN_SLOW',
        'DOWN_FAST'
    ];

    function areaSeries(name, xAxisIndex, yAxisIndex, stackKey) {
        return {
            name: name,
            type: 'line',
            data: [],
            xAxisIndex: xAxisIndex,
            yAxisIndex: yAxisIndex,
            stack: stackKey,
            showSymbol: false,
            smooth: true,
            lineStyle: { width: 1.1 },
            areaStyle: {}
        };
    }

    function lineSeries(name, xAxisIndex, yAxisIndex, smooth, width) {
        return {
            name: name,
            type: 'line',
            data: [],
            xAxisIndex: xAxisIndex,
            yAxisIndex: yAxisIndex,
            showSymbol: false,
            smooth: smooth,
            lineStyle: { width: width }
        };
    }

    const baseOption = {
        legend: {
            type: 'scroll',
            top: 10,
            left: 'center',
            data: [
                'Price',
                'UP_SLOW',
                'UP_FAST',
                'RANGE_LOWVOL',
                'RANGE_HIGHVOL',
                'DOWN_SLOW',
                'DOWN_FAST',
                'P_Corr_10D',
                'P_Reb_10D',
                'E_target_safe',
                'E_target_aggr',
                'direction_aggr',
                'L_target_aggr',
                'S_accumulate',
                'S_hold',
                'S_reduce',
                'S_exit',
                'Score thresholds'
            ],
            selected: {
                Price: true,
                UP_SLOW: true,
                UP_FAST: true,
                RANGE_LOWVOL: true,
                RANGE_HIGHVOL: true,
                DOWN_SLOW: true,
                DOWN_FAST: true,
                P_Corr_10D: true,
                P_Reb_10D: true,
                E_target_safe: true,
                E_target_aggr: true,
                direction_aggr: true,
                L_target_aggr: true,
                S_accumulate: true,
                S_hold: true,
                S_reduce: true,
                S_exit: true,
                'Score thresholds': true
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' }
        },
        axisPointer: {
            link: [{ xAxisIndex: 'all' }],
            label: { backgroundColor: '#777' }
        },
        toolbox: {
            feature: {
                dataZoom: { yAxisIndex: false },
                restore: {},
                saveAsImage: {}
            }
        },
        grid: [
            { left: '10%', right: '8%', top: '12%', height: '45%' },
            { left: '10%', right: '8%', top: '60%', height: '7%' },
            { left: '10%', right: '8%', top: '69%', height: '7%' },
            { left: '10%', right: '8%', top: '78%', height: '7%' },
            { left: '10%', right: '8%', top: '87%', height: '6%' }
        ],
        xAxis: [
            {
                type: 'category',
                data: [],
                boundaryGap: false,
                axisLine: { onZero: false },
                splitLine: { show: false },
                min: 'dataMin',
                max: 'dataMax',
                axisPointer: { z: 100 }
            },
            {
                type: 'category',
                gridIndex: 1,
                data: [],
                boundaryGap: false,
                axisLine: { onZero: false },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                min: 'dataMin',
                max: 'dataMax'
            },
            {
                type: 'category',
                gridIndex: 2,
                data: [],
                boundaryGap: false,
                axisLine: { onZero: false },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                min: 'dataMin',
                max: 'dataMax'
            },
            {
                type: 'category',
                gridIndex: 3,
                data: [],
                boundaryGap: false,
                axisLine: { onZero: false },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                min: 'dataMin',
                max: 'dataMax'
            },
            {
                type: 'category',
                gridIndex: 4,
                data: [],
                boundaryGap: false,
                axisLine: { onZero: false },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                min: 'dataMin',
                max: 'dataMax'
            }
        ],
        yAxis: [
            { scale: true, splitArea: { show: true } },
            {
                gridIndex: 1,
                min: 0,
                max: 1,
                axisLabel: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false }
            },
            {
                gridIndex: 2,
                min: 0,
                max: 1,
                axisLabel: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false }
            },
            {
                gridIndex: 3,
                min: -1,
                max: 1,
                axisLabel: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false }
            },
            {
                gridIndex: 3,
                min: 1,
                max: 5,
                position: 'right',
                axisLabel: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false }
            },
            {
                gridIndex: 4,
                min: 0,
                max: 1,
                axisLabel: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false }
            }
        ],
        dataZoom: [
            { type: 'inside', xAxisIndex: [0, 1, 2, 3, 4], filterMode: 'none', start: 0, end: 100 },
            { show: true, xAxisIndex: [0, 1, 2, 3, 4], type: 'slider', filterMode: 'none', top: '94%', start: 0, end: 100 }
        ],
        series: [
            {
                name: 'Price',
                type: 'candlestick',
                data: [],
                itemStyle: {
                    color: '#00da3c',
                    color0: '#ec0000',
                    borderColor: '#00da3c',
                    borderColor0: '#ec0000'
                }
            },
            areaSeries('UP_SLOW', 1, 1, 'regimes'),
            areaSeries('UP_FAST', 1, 1, 'regimes'),
            areaSeries('RANGE_LOWVOL', 1, 1, 'regimes'),
            areaSeries('RANGE_HIGHVOL', 1, 1, 'regimes'),
            areaSeries('DOWN_SLOW', 1, 1, 'regimes'),
            areaSeries('DOWN_FAST', 1, 1, 'regimes'),
            lineSeries('P_Corr_10D', 2, 2, true, 1.7),
            lineSeries('P_Reb_10D', 2, 2, true, 1.7),
            lineSeries('E_target_safe', 3, 3, true, 1.7),
            lineSeries('E_target_aggr', 3, 3, true, 1.7),
            lineSeries('direction_aggr', 3, 3, false, 1.2),
            lineSeries('S_accumulate', 4, 5, true, 1.6),
            lineSeries('S_hold', 4, 5, true, 1.6),
            lineSeries('S_reduce', 4, 5, true, 1.6),
            lineSeries('S_exit', 4, 5, true, 1.8),
            {
                name: 'Score thresholds',
                type: 'line',
                xAxisIndex: 4,
                yAxisIndex: 5,
                data: [],
                showSymbol: false,
                lineStyle: { opacity: 0 },
                tooltip: { show: false },
                markLine: {
                    symbol: ['none', 'none'],
                    lineStyle: { type: 'dashed', opacity: 0.6 },
                    data: [
                        { yAxis: 0.35, name: '0.35 (moderate)' },
                        { yAxis: 0.65, name: '0.65 (risk)' }
                    ]
                }
            },
            lineSeries('L_target_aggr', 3, 4, true, 1.6)
        ]
    };

    function seriesOrFallback(series, key, fallbackKey) {
        if (!series) {
            return null;
        }
        const primary = series[key];
        if (Array.isArray(primary) && primary.length) {
            return primary.map((value) => (value == null ? null : +value));
        }
        if (fallbackKey) {
            const fallback = series[fallbackKey];
            if (Array.isArray(fallback) && fallback.length) {
                return fallback.map((value) => (value == null ? null : +value));
            }
        }
        return null;
    }

    function pickRegimeSeries(series, mode) {
        const suffix = mode === 'hmm' ? '_HMM' : '';
        const pick = (key) => seriesOrFallback(series, key + suffix, key);

        return [
            ['UP_SLOW', pick('P_UP_SLOW')],
            ['UP_FAST', pick('P_UP_FAST')],
            ['RANGE_LOWVOL', pick('P_RANGE_LOWVOL')],
            ['RANGE_HIGHVOL', pick('P_RANGE_HIGHVOL')],
            ['DOWN_SLOW', pick('P_DOWN_SLOW')],
            ['DOWN_FAST', pick('P_DOWN_FAST')]
        ];
    }

    function normalizeSeries(series, length) {
        if (!Array.isArray(series)) {
            return new Array(length).fill(null);
        }
        if (series.length === length) {
            return series;
        }
        if (series.length < length) {
            return series.concat(new Array(length - series.length).fill(null));
        }
        return series.slice(0, length);
    }

    function normalizePayload(rawData) {
        const payload = { priceData: [], features: null };

        if (Array.isArray(rawData)) {
            payload.priceData = rawData;
            return payload;
        }
        if (!rawData || typeof rawData !== 'object') {
            return payload;
        }

        const priceCandidate = rawData.priceData || rawData.price || rawData.prices || rawData.candles
            || rawData.dailyPrice || rawData.ohlc || rawData.data;
        if (Array.isArray(priceCandidate)) {
            payload.priceData = priceCandidate;
        }

        let features = rawData.features || rawData.dashboard || rawData.signals || null;
        if (!features && rawData.dates && rawData.series) {
            features = rawData;
        }
        payload.features = features;

        return payload;
    }

    function buildDates(priceData, features) {
        if (features && Array.isArray(features.dates) && features.dates.length) {
            return features.dates.slice();
        }
        return priceData.map((row) => row.timestamp);
    }

    function buildCandleSeries(priceData, dates) {
        const byDate = new Map();
        priceData.forEach((row) => {
            if (row && row.timestamp != null) {
                byDate.set(row.timestamp, row);
            }
        });

        return dates.map((date) => {
            const row = byDate.get(date);
            if (!row) {
                return [null, null, null, null];
            }
            const open = row.open == null ? null : +row.open;
            const close = row.close == null ? null : +row.close;
            const low = row.low == null ? null : +row.low;
            const high = row.high == null ? null : +row.high;
            return [open, close, low, high];
        });
    }

    function buildOption(rawData) {
        const option = global.ChartUtils.clone(baseOption);
        const payload = normalizePayload(rawData);
        const features = payload.features;
        const dates = buildDates(payload.priceData, features);
        const seriesLength = dates.length;

        option.xAxis.forEach((axis) => {
            axis.data = dates;
        });

        const candleValues = buildCandleSeries(payload.priceData, dates);

        option.series[0].data = candleValues;
        const seriesSource = features && features.series ? features.series : (features && !features.dates ? features : null);
        const regimes = seriesSource ? pickRegimeSeries(seriesSource, REGIME_MODE) : [];
        const regimeMap = {};
        regimes.forEach(([name, data]) => {
            regimeMap[name] = normalizeSeries(data, seriesLength);
        });

        REGIME_NAMES.forEach((name, index) => {
            const data = regimeMap[name] || new Array(seriesLength).fill(null);
            option.series[1 + index].data = data;
        });

        const pCorr = normalizeSeries(
            seriesOrFallback(seriesSource, 'P_CORRECTION_10D_CAL', 'P_CORRECTION_10D'),
            seriesLength
        );
        const pReb = normalizeSeries(
            seriesOrFallback(seriesSource, 'P_REBOUND_10D_CAL', 'P_REBOUND_10D'),
            seriesLength
        );
        const eSafe = normalizeSeries(seriesOrFallback(seriesSource, 'E_target_safe'), seriesLength);
        const eAggr = normalizeSeries(seriesOrFallback(seriesSource, 'E_target_aggr'), seriesLength);
        const dirAggr = normalizeSeries(seriesOrFallback(seriesSource, 'direction_aggr'), seriesLength);
        const sAcc = normalizeSeries(seriesOrFallback(seriesSource, 'S_accumulate'), seriesLength);
        const sHold = normalizeSeries(seriesOrFallback(seriesSource, 'S_hold'), seriesLength);
        const sReduce = normalizeSeries(seriesOrFallback(seriesSource, 'S_reduce'), seriesLength);
        const sExit = normalizeSeries(seriesOrFallback(seriesSource, 'S_exit'), seriesLength);
        const lAggr = normalizeSeries(seriesOrFallback(seriesSource, 'L_target_aggr'), seriesLength);

        option.series[7].data = pCorr;
        option.series[8].data = pReb;
        option.series[9].data = eSafe;
        option.series[10].data = eAggr;
        option.series[11].data = dirAggr;
        option.series[12].data = sAcc;
        option.series[13].data = sHold;
        option.series[14].data = sReduce;
        option.series[15].data = sExit;
        option.series[16].data = new Array(seriesLength).fill(null);
        option.series[17].data = lAggr;

        return option;
    }

    global.chartRegistry = global.chartRegistry || {};
    global.chartRegistry.dailyPrice = {
        buildOption: buildOption,
        legendRequired: ['Price']
    };
})(window);

// Router and wiring for Japan in Numbers. Hash routes, one per section:
//   #/                overview
//   #/population      population and prefectures
//   #/economy         GDP, growth and structure
//   #/prices-labour   inflation and jobs
//   #/trade           exports, imports and partners
//   #/regions         where Japan lives
//   #/sources         sources, methods and CSV downloads
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import {
  CPI, GDP_NOMINAL, GDP_REAL_GROWTH, POPULATION, PREFECTURES, TRADE,
  UNEMPLOYMENT, YEN_PER_DOLLAR_2024,
} from './data.js';
import { barChart, groupedBarChart, lineChart } from './charts.js';
import {
  economy, missing, overview, population, prefectureTable, pricesLabour,
  regions, sources, trade, yearReview,
} from './views.js';

const app = document.getElementById('app');
const navLinks = [...document.querySelectorAll('nav a')];

const ROUTES = {
  '': overview,
  population,
  economy,
  'prices-labour': pricesLabour,
  trade,
  regions,
  sources,
};

const TITLES = {
  '': 'Japan in Numbers — 日本統計年鑑',
  population: 'Population | Japan in Numbers',
  economy: 'Economy | Japan in Numbers',
  'prices-labour': 'Prices & Labour | Japan in Numbers',
  trade: 'Trade | Japan in Numbers',
  regions: 'Regions | Japan in Numbers',
  sources: 'Sources & Methods | Japan in Numbers',
};

// --- chart rendering -------------------------------------------------------

const CHARTS = {
  popChart: (kind) => kind === 'bar'
    ? barChart(POPULATION, { format: (v) => v.toFixed(1), unit: 'm', yLabel: 'Total population, millions' })
    : lineChart(POPULATION, { format: (v) => v.toFixed(1), unit: 'm', yLabel: 'Total population, millions' }),
  gdpChart: (kind) => kind === 'line'
    ? lineChart(GDP_NOMINAL, { format: (v) => `$${v.toFixed(2)}`, unit: 'trn', color: '#2e6f8e', yLabel: 'Nominal GDP, US$ trillion' })
    : barChart(GDP_NOMINAL, { format: (v) => `$${v.toFixed(2)}`, unit: 'trn', yLabel: 'Nominal GDP, US$ trillion' }),
  priceChart: (kind, series) => {
    const data = series === 'unemployment' ? UNEMPLOYMENT : CPI;
    const fmt = (v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}`;
    return kind === 'bar'
      ? barChart(data, { format: fmt, unit: '%', yLabel: series === 'unemployment' ? 'Unemployment rate, percent' : 'CPI inflation, percent' })
      : lineChart(data, { format: fmt, unit: '%', color: series === 'unemployment' ? '#2e6f8e' : '#b3402e', yLabel: series === 'unemployment' ? 'Unemployment rate, percent' : 'CPI inflation, percent' });
  },
  tradeChart: (currency) => {
    const rate = YEN_PER_DOLLAR_2024;
    const conv = (v) => currency === 'usd' ? (v * 1000) / rate : v;
    const fmt = (v) => currency === 'usd' ? Math.round(v).toLocaleString('en-US') : v.toFixed(1);
    const unit = currency === 'usd' ? ' $bn' : ' ¥trn';
    const ex = TRADE.map((t) => ({ year: t.year, value: conv(t.exports) }));
    const im = TRADE.map((t) => ({ year: t.year, value: conv(t.imports) }));
    return groupedBarChart(ex, im, { format: fmt, unit, labelA: 'Exports', labelB: 'Imports' });
  },
};

function drawChart(id, kind, extra) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = CHARTS[id](kind, extra);
}

// --- prefecture table: search + sort --------------------------------------

let prefSort = { key: 'population', dir: -1 };

function renderPrefTable() {
  const table = document.getElementById('prefTable');
  if (!table) return;
  const q = (document.getElementById('prefSearch')?.value || '').trim().toLowerCase();
  let rows = PREFECTURES.filter((r) =>
    !q || r.name.toLowerCase().includes(q) || r.capital.toLowerCase().includes(q) || r.region.toLowerCase().includes(q));
  const { key, dir } = prefSort;
  rows = [...rows].sort((a, b) => {
    const av = a[key], bv = b[key];
    return (typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv))) * dir;
  });
  const fresh = document.createElement('div');
  fresh.innerHTML = prefectureTable(rows);
  const next = fresh.firstChild;
  table.replaceWith(next);
  next.querySelectorAll('th[data-sort]').forEach((th) => {
    if (th.dataset.sort === key) th.setAttribute('aria-sort', dir === 1 ? 'ascending' : 'descending');
  });
}

// --- render ----------------------------------------------------------------

function render() {
  window.__shotReady = false;
  const route = (location.hash.match(/^#\/([a-z-]*)?\/?$/) || [])[1] || '';
  const view = ROUTES[route] || missing;
  document.title = TITLES[route] || 'Not found | Japan in Numbers';
  app.innerHTML = view();
  navLinks.forEach((a) => {
    const r = a.getAttribute('href').slice(2);
    if (r === route) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });

  // Overview: year in review.
  const pick = document.getElementById('yearPick');
  if (pick) {
    const review = document.getElementById('yearReview');
    const update = () => { review.innerHTML = yearReview(Number(pick.value)); };
    pick.addEventListener('change', update);
    update();
  }

  // Chart containers present on this page get their first draw.
  drawChart('popChart', 'line');
  drawChart('gdpChart', 'bar');
  drawChart('priceChart', 'line', 'cpi');
  drawChart('tradeChart', 'yen');

  // Prefecture search.
  const search = document.getElementById('prefSearch');
  if (search) search.addEventListener('input', renderPrefTable);

  window.scrollTo(0, 0);
  window.__shotReady = true;
}

// Chart-type toggles and the prices series switch, by delegation.
document.addEventListener('click', (event) => {
  const btn = event.target.closest('button');
  if (!btn) return;

  if (btn.dataset.target) {
    const group = btn.parentElement.querySelectorAll('button');
    group.forEach((b) => b.classList.toggle('on', b === btn));
    const extra = btn.dataset.target === 'priceChart'
      ? (document.querySelector('[data-series-btn].on')?.dataset.seriesBtn || 'cpi')
      : undefined;
    drawChart(btn.dataset.target, btn.dataset.kind, extra);
    return;
  }

  if (btn.dataset.seriesBtn) {
    const group = btn.parentElement.querySelectorAll('button');
    group.forEach((b) => b.classList.toggle('on', b === btn));
    const series = btn.dataset.seriesBtn;
    const kind = document.querySelector('[data-target="priceChart"].on')?.dataset.kind || 'line';
    document.getElementById('priceTitle').textContent = series === 'unemployment'
      ? 'Unemployment rate, 2015–2024'
      : 'Consumer price inflation, 2015–2024';
    document.getElementById('priceNote').textContent = series === 'unemployment'
      ? 'Unemployment fell from 3.4% in 2015 to 2.4% before the pandemic, rose to 2.8% in 2020–2021, and eased to 2.5% in 2024 — low by any international standard.'
      : 'After decades near zero — including a −0.2% fall in 2021 — consumer prices rose 2.5% in 2022, 3.3% in 2023 and 2.7% in 2024, driven by energy and food costs and a weak yen.';
    drawChart('priceChart', kind, series);
    return;
  }

  if (btn.dataset.currency) {
    const group = btn.parentElement.querySelectorAll('button');
    group.forEach((b) => b.classList.toggle('on', b === btn));
    drawChart('tradeChart', btn.dataset.currency);
  }
});

// Sortable prefecture table headers, by delegation (click and keyboard).
document.addEventListener('click', (event) => {
  const th = event.target.closest('th[data-sort]');
  if (!th) return;
  const key = th.dataset.sort;
  prefSort = { key, dir: prefSort.key === key ? -prefSort.dir : (key === 'population' ? -1 : 1) };
  renderPrefTable();
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const th = event.target.closest?.('th[data-sort]');
  if (!th) return;
  event.preventDefault();
  const key = th.dataset.sort;
  prefSort = { key, dir: prefSort.key === key ? -prefSort.dir : (key === 'population' ? -1 : 1) };
  renderPrefTable();
});

window.addEventListener('hashchange', render);
render();

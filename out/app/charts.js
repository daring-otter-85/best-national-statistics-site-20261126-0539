// Hand-rolled SVG charts — no libraries, no network. Every chart is built
// from the data in data.js and returns an SVG string. Colours come from the
// site palette: indigo ink, vermilion accent, warm grey gridlines.

const INK = '#1b2a4a';
const ACCENT = '#b3402e';
const ACCENT2 = '#2e6f8e';
const GRID = '#e3ddd2';
const MUTED = '#6b7280';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

function niceTicks(min, max, count = 4) {
  const span = max - min || 1;
  const step = span / count;
  const mag = 10 ** Math.floor(Math.log10(step));
  const norm = step / mag;
  const nice = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
  const s = nice * mag;
  const lo = Math.floor(min / s) * s;
  const out = [];
  for (let v = lo; v <= max + 1e-9; v += s) out.push(Math.round(v * 100) / 100);
  return out;
}

// A line chart with labelled axes and value dots. `series` is
// [{year, value}]; `format` formats a value for the axis and tooltip.
export function lineChart(series, { width = 640, height = 260, format = (v) => String(v), unit = '', color = ACCENT, yLabel = '' } = {}) {
  const padL = 52, padR = 14, padT = 18, padB = 30;
  const w = width - padL - padR, h = height - padT - padB;
  const vals = series.map((p) => p.value);
  let min = Math.min(...vals), max = Math.max(...vals);
  const pad = (max - min) * 0.15 || 1;
  min -= pad; max += pad;
  // No forced zero baseline here: for a slowly moving series (population
  // 124–127m) a zero axis would flatten the trend into a straight line.
  // Bar charts keep their zero baseline in barChart().
  const x = (i) => padL + (i / (series.length - 1)) * w;
  const y = (v) => padT + (1 - (v - min) / (max - min)) * h;
  const ticks = niceTicks(min, max, 4).filter((t) => y(t) <= padT + h - 14);
  const grid = ticks.map((t) => `
    <line x1="${padL}" y1="${y(t)}" x2="${padL + w}" y2="${y(t)}" stroke="${GRID}" stroke-width="1"/>
    <text x="${padL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${esc(format(t))}</text>`).join('');
  const labels = series.map((p, i) => i % 2 === 0 || i === series.length - 1
    ? `<text x="${x(i)}" y="${height - 8}" text-anchor="middle" font-size="11" fill="${MUTED}">${p.year}</text>` : '').join('');
  const pts = series.map((p, i) => `${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const dots = series.map((p, i) => `
    <circle cx="${x(i)}" cy="${y(p.value)}" r="3.5" fill="#fff" stroke="${color}" stroke-width="2">
      <title>${p.year}: ${format(p.value)}${unit}</title>
    </circle>`).join('');
  const last = series[series.length - 1];
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(yLabel)} line chart, ${series[0].year} to ${last.year}" class="chart">
    ${grid}
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    ${dots}
    <text x="${padL + w}" y="${y(last.value) - 14}" text-anchor="end" font-size="12" font-weight="700" fill="${color}">${esc(format(last.value))}${esc(unit)}</text>
    ${labels}
  </svg>`;
}

// A vertical bar chart. `series` is [{year, value}]; negative bars hang
// below the zero line, which the growth chart needs.
export function barChart(series, { width = 640, height = 260, format = (v) => String(v), unit = '', color = ACCENT2, yLabel = '' } = {}) {
  const padL = 52, padR = 14, padT = 18, padB = 30;
  const w = width - padL - padR, h = height - padT - padB;
  const vals = series.map((p) => p.value);
  let min = Math.min(0, ...vals), max = Math.max(0, ...vals);
  const pad = (max - min) * 0.08 || 1;
  max += pad;
  if (min < 0) min -= pad; // never pad below zero: no phantom negative ticks
  const y = (v) => padT + (1 - (v - min) / (max - min)) * h;
  const slot = w / series.length;
  const bw = Math.min(44, slot * 0.62);
  const ticks = niceTicks(min, max, 4);
  const grid = ticks.map((t) => `
    <line x1="${padL}" y1="${y(t)}" x2="${padL + w}" y2="${y(t)}" stroke="${GRID}" stroke-width="1"/>
    <text x="${padL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${esc(format(t))}</text>`).join('');
  const bars = series.map((p, i) => {
    const bx = padL + i * slot + (slot - bw) / 2;
    const top = Math.min(y(0), y(p.value));
    const bh = Math.abs(y(p.value) - y(0));
    const fill = p.value < 0 ? ACCENT : color;
    return `<rect x="${bx.toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(bh, 1.5).toFixed(1)}" rx="2" fill="${fill}">
      <title>${p.year}: ${format(p.value)}${unit}</title></rect>
    <text x="${(padL + i * slot + slot / 2).toFixed(1)}" y="${height - 8}" text-anchor="middle" font-size="11" fill="${MUTED}">${p.year}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(yLabel)} bar chart" class="chart">
    ${grid}
    <line x1="${padL}" y1="${y(0)}" x2="${padL + w}" y2="${y(0)}" stroke="${INK}" stroke-width="1.2"/>
    ${bars}
  </svg>`;
}

// Grouped bars for two series sharing the same years (exports vs imports).
export function groupedBarChart(seriesA, seriesB, { width = 640, height = 280, format = (v) => String(v), unit = '', labelA = 'A', labelB = 'B' } = {}) {
  const padL = 52, padR = 14, padT = 18, padB = 30;
  const w = width - padL - padR, h = height - padT - padB;
  const vals = [...seriesA, ...seriesB].map((p) => p.value);
  const max = Math.max(...vals) * 1.12;
  const y = (v) => padT + (1 - v / max) * h;
  const slot = w / seriesA.length;
  const bw = Math.min(30, slot * 0.3);
  const ticks = niceTicks(0, max, 4);
  const grid = ticks.map((t) => `
    <line x1="${padL}" y1="${y(t)}" x2="${padL + w}" y2="${y(t)}" stroke="${GRID}" stroke-width="1"/>
    <text x="${padL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${esc(format(t))}</text>`).join('');
  const bars = seriesA.map((p, i) => {
    const cx = padL + i * slot + slot / 2;
    const q = seriesB[i];
    return `<rect x="${(cx - bw - 2).toFixed(1)}" y="${y(p.value).toFixed(1)}" width="${bw}" height="${(padT + h - y(p.value)).toFixed(1)}" rx="2" fill="${ACCENT2}">
      <title>${p.year} ${labelA}: ${format(p.value)}${unit}</title></rect>
    <rect x="${(cx + 2).toFixed(1)}" y="${y(q.value).toFixed(1)}" width="${bw}" height="${(padT + h - y(q.value)).toFixed(1)}" rx="2" fill="${ACCENT}">
      <title>${q.year} ${labelB}: ${format(q.value)}${unit}</title></rect>
    <text x="${cx.toFixed(1)}" y="${height - 8}" text-anchor="middle" font-size="11" fill="${MUTED}">${p.year}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(labelA)} versus ${esc(labelB)} bar chart" class="chart">
    ${grid}${bars}
  </svg>`;
}

// Horizontal bars for shares (age structure, employment mix).
export function hbars(rows, { width = 640, barH = 26, gap = 14, format = (v) => `${v}%`, color = ACCENT } = {}) {
  const padL = 150, padR = 64;
  const height = rows.length * (barH + gap) + gap;
  const max = Math.max(...rows.map((r) => r.share));
  const body = rows.map((r, i) => {
    const yTop = gap + i * (barH + gap);
    const bw = ((width - padL - padR) * r.share) / max;
    return `<text x="${padL - 10}" y="${yTop + barH / 2 + 4}" text-anchor="end" font-size="13" fill="${INK}">${esc(r.group || r.sector)}</text>
    <rect x="${padL}" y="${yTop}" width="${Math.max(bw, 2).toFixed(1)}" height="${barH}" rx="3" fill="${r.color || color}">
      <title>${esc(r.group || r.sector)}: ${format(r.share)}</title></rect>
    <text x="${padL + bw + 8}" y="${yTop + barH / 2 + 4}" font-size="13" font-weight="700" fill="${INK}">${esc(format(r.share))}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="share bar chart" class="chart">${body}</svg>`;
}

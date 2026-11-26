// One render function per section. Every figure carries its source and
// year; every control the page shows actually works (wired in main.js).

import {
  AGE_STRUCTURE_2024, AT_A_GLANCE, CPI, EMPLOYMENT_SHARES_2024,
  GDP_NOMINAL, GDP_REAL_GROWTH, HEADLINES, POPULATION, PREFECTURES,
  SOURCES, TRADE, TRADE_PARTNERS, UNEMPLOYMENT, YEARS,
  YEN_PER_DOLLAR_2024,
} from './data.js';
import { barChart, groupedBarChart, hbars, lineChart } from './charts.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

const src = (text) => `<p class="src">Source: ${esc(text)}</p>`;

function statCard(h) {
  return `<article class="card stat">
    <h3>${esc(h.label)}</h3>
    <p class="big">${esc(h.value)}</p>
    <p class="sub">${esc(h.sub)}</p>
    <p class="detail">${esc(h.detail)}</p>
  </article>`;
}

function yearOptions(selected) {
  return YEARS.map((y) => `<option value="${y}"${y === selected ? ' selected' : ''}>${y}</option>`).join('');
}

function lookup(series, year) {
  const row = series.find((r) => r.year === year);
  return row ? row.value : '—';
}

export function overview() {
  const cards = HEADLINES.map(statCard).join('');
  const facts = AT_A_GLANCE.map((f) => `<li><span>${esc(f.label)}</span><strong>${esc(f.value)}</strong></li>`).join('');
  return `
  <section class="hero">
    <p class="kicker">日本統計年鑑 · National statistics of Japan</p>
    <h1>Japan in Numbers</h1>
    <p class="lede">The country at a glance — population, economy, prices, work and
    trade — drawn from Japan's official statistics and the World Bank, with
    every figure sourced and dated. Pick a year below and watch the whole
    country change.</p>
  </section>

  <section aria-label="Headline indicators">
    <h2>Headlines, 2024</h2>
    <div class="grid stats">${cards}</div>
  </section>

  <section class="panel" aria-label="Year in review">
    <div class="panel-head">
      <h2>Year in review</h2>
      <label class="year-pick">Year
        <select id="yearPick" aria-label="Choose a year">${yearOptions(2024)}</select>
      </label>
    </div>
    <div id="yearReview" class="year-review"></div>
    ${src('World Bank WDI; IMF WEO; Statistics Bureau of Japan. GDP in current US dollars.')}
  </section>

  <section aria-label="Trends">
    <h2>Three trends that define the decade</h2>
    <div class="grid thirds">
      <article class="card">
        <h3>A shrinking population</h3>
        ${lineChart(POPULATION, { format: (v) => v.toFixed(1), unit: 'm', yLabel: 'Total population, millions' })}
        <p>From 127.1m in 2015 to 124.0m in 2024 — the 18th straight annual fall.</p>
        ${src('World Bank WDI, 2015–2024.')}
      </article>
      <article class="card">
        <h3>Growth that stalled</h3>
        ${barChart(GDP_REAL_GROWTH, { format: (v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}`, unit: '%', yLabel: 'Real GDP growth, percent' })}
        <p>Real growth of just 0.1% in 2024 after the pandemic rebound faded.</p>
        ${src('World Bank WDI, 2015–2024.')}
      </article>
      <article class="card">
        <h3>Inflation is back</h3>
        ${lineChart(CPI, { format: (v) => v.toFixed(1), unit: '%', color: '#2e6f8e', yLabel: 'Consumer price inflation, percent' })}
        <p>2.7% in 2024 — the third straight year above 2% after decades near zero.</p>
        ${src('Statistics Bureau of Japan, CPI, 2015–2024.')}
      </article>
    </div>
  </section>

  <section aria-label="At a glance">
    <h2>At a glance</h2>
    <ul class="facts">${facts}</ul>
  </section>

  <section class="panel" aria-label="What to read first">
    <h2>Three stories in the numbers</h2>
    <ol class="stories">
      <li><strong>Japan is ageing faster than any large country.</strong> Almost
        three in ten people are 65 or older, births fell below 700,000 for the
        first time in 2024, and the population shrinks by about 0.44% a year.
        <a href="#/population">See population →</a></li>
      <li><strong>The economy is big, rich — and flat.</strong> Nominal GDP fell
        to $4.02 trillion in 2024 mostly because the yen weakened, but real
        growth has averaged under 1% a year for a decade.
        <a href="#/economy">See economy →</a></li>
      <li><strong>Trade is back in deficit, but the current account is not.</strong>
        Goods ran a ¥5.3 trillion deficit in 2024 while investment income pushed
        the current account to a record ¥30.38 trillion surplus.
        <a href="#/trade">See trade →</a></li>
    </ol>
  </section>`;
}

export function population() {
  return `
  <section class="hero slim">
    <p class="kicker">Population · 人口</p>
    <h1>Population</h1>
    <p class="lede">124.0 million people in 2024, falling every year since 2010 —
    and the world's oldest large population.</p>
  </section>

  <section class="panel" aria-label="Population trend">
    <div class="panel-head">
      <h2>Total population, 2015–2024</h2>
      <div class="toggle" role="group" aria-label="Chart type">
        <button type="button" data-target="popChart" data-kind="line" class="on">Line</button>
        <button type="button" data-target="popChart" data-kind="bar">Bars</button>
      </div>
    </div>
    <div id="popChart" data-series="population"></div>
    ${src('World Bank World Development Indicators, 2015–2024.')}
    <table class="data">
      <caption>Population by year (millions)</caption>
      <thead><tr><th>Year</th><th>Population</th><th>Change</th></tr></thead>
      <tbody>${POPULATION.map((p, i) => {
        const prev = i ? POPULATION[i - 1].value : null;
        const chg = prev === null ? '—' : `${(((p.value - prev) / prev) * 100).toFixed(2)}%`;
        return `<tr><td>${p.year}</td><td>${p.value.toFixed(1)}m</td><td>${chg}</td></tr>`;
      }).join('')}</tbody>
    </table>
  </section>

  <section class="panel" aria-label="Age structure">
    <h2>Age structure, 2024</h2>
    ${hbars(AGE_STRUCTURE_2024.map((a, i) => ({ ...a, color: ['#2e6f8e', '#1b2a4a', '#b3402e'][i] })))}
    <p>Median age 49.9 years — the highest of any large country. The 65-and-over
    share has risen every year since the 1970s; the child share keeps falling.</p>
    ${src('World Bank WDI, 2024.')}
  </section>

  <section class="panel" aria-label="Births and deaths">
    <h2>Births and deaths, 2024</h2>
    <div class="grid thirds">
      <article class="card stat"><h3>Births</h3><p class="big">686,061</p>
        <p class="sub">MHLW Vital Statistics</p><p class="detail">Lowest since records began in 1899; down 5.7% on 2023.</p></article>
      <article class="card stat"><h3>Deaths</h3><p class="big">≈ 1.61m</p>
        <p class="sub">MHLW Vital Statistics</p><p class="detail">Up 1.9% on 2023; deaths outnumber births more than two to one.</p></article>
      <article class="card stat"><h3>Fertility rate</h3><p class="big">1.15</p>
        <p class="sub">MHLW, 2024</p><p class="detail">Record low, down from 1.20 in 2023; replacement level is 2.1.</p></article>
    </div>
    <p>Population peaked at 128.5 million in 2010. Foreign residents reached a
    record 3.6 million in 2024 — about 3% of the population — but immigration
    does not offset the natural decline.</p>
    ${src('MHLW Vital Statistics 2024 (final figures, June 2025); Ministry of Internal Affairs and Communications.')}
  </section>

  <section class="panel" aria-label="Largest prefectures">
    <div class="panel-head">
      <h2>Largest prefectures</h2>
      <label class="search">Search
        <input id="prefSearch" type="search" placeholder="e.g. Osaka" aria-label="Search prefectures">
      </label>
    </div>
    <p class="hint">Click a column heading to sort. Population, 1 October 2024 estimates.</p>
    ${prefectureTable(PREFECTURES)}
    ${src('Statistics Bureau of Japan, Population Estimates, 1 October 2024.')}
  </section>`;
}

export function prefectureTable(rows) {
  return `<table class="data sortable" id="prefTable">
    <thead><tr>
      <th data-sort="name" tabindex="0">Prefecture ↕</th>
      <th data-sort="capital" tabindex="0">Capital ↕</th>
      <th data-sort="region" tabindex="0">Region ↕</th>
      <th data-sort="population" tabindex="0" aria-sort="descending">Population (m) ↕</th>
    </tr></thead>
    <tbody>${rows.map((r) => `<tr><td>${esc(r.name)}</td><td>${esc(r.capital)}</td><td>${esc(r.region)}</td><td>${r.population.toFixed(2)}</td></tr>`).join('')}</tbody>
  </table>`;
}

export function economy() {
  return `
  <section class="hero slim">
    <p class="kicker">Economy · 経済</p>
    <h1>Economy</h1>
    <p class="lede">The world's 4th-largest economy at $4.02 trillion in 2024 —
    rich, export-heavy, and growing barely at all.</p>
  </section>

  <section class="panel" aria-label="GDP">
    <div class="panel-head">
      <h2>Nominal GDP, 2015–2024</h2>
      <div class="toggle" role="group" aria-label="Chart type">
        <button type="button" data-target="gdpChart" data-kind="bar" class="on">Bars</button>
        <button type="button" data-target="gdpChart" data-kind="line">Line</button>
      </div>
    </div>
    <div id="gdpChart" data-series="gdp"></div>
    <p>The dollar figure fell from $5.12trn in 2019 to $4.02trn in 2024 mostly
    because the yen weakened — in yen terms the economy kept growing. GDP per
    capita was $32,443 in 2024.</p>
    ${src('World Bank WDI (nominal GDP, current US$); IMF WEO (GDP per capita), 2015–2024.')}
  </section>

  <section class="panel" aria-label="Real growth">
    <h2>Real GDP growth, 2015–2024</h2>
    ${barChart(GDP_REAL_GROWTH, { format: (v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}`, unit: '%', yLabel: 'Real GDP growth, percent' })}
    <p>The pandemic year 2020 took growth to −4.2%; the rebound peaked at +2.7%
    in 2021, then faded to +0.1% in 2024. Ten-year average: under 1% a year.</p>
    ${src('World Bank WDI, 2015–2024.')}
  </section>

  <section class="panel" aria-label="Structure">
    <h2>What Japan does for a living</h2>
    <div class="grid halves">
      <article class="card">
        <h3>Employment by sector, 2024</h3>
        ${hbars(EMPLOYMENT_SHARES_2024.map((s, i) => ({ ...s, group: s.sector, color: ['#1b2a4a', '#2e6f8e', '#b3402e'][i] })))}
        ${src('ILOSTAT, 2024.')}
      </article>
      <article class="card">
        <h3>Strengths and strains</h3>
        <dl class="kv">
          <dt>R&amp;D spending</dt><dd>3.4% of GDP (2023) — among the highest in the OECD</dd>
          <dt>Government debt</dt><dd>≈ 230% of GDP (IMF, 2025) — the highest in the developed world</dd>
          <dt>Exports of goods &amp; services</dt><dd>$921bn (2024)</dd>
          <dt>Foreign reserves</dt><dd>≈ $1.37trn (2025) — among the world's largest</dd>
        </dl>
        ${src('OECD; IMF WEO; World Bank WDI; Ministry of Finance.')}
      </article>
    </div>
  </section>`;
}

export function pricesLabour() {
  return `
  <section class="hero slim">
    <p class="kicker">Prices &amp; labour · 物価と労働</p>
    <h1>Prices &amp; Labour</h1>
    <p class="lede">Inflation returned after thirty quiet years, while unemployment
    stayed near the lowest levels in the developed world.</p>
  </section>

  <section class="panel" aria-label="Prices and unemployment chart">
    <div class="panel-head">
      <h2 id="priceTitle">Consumer price inflation, 2015–2024</h2>
      <div class="toggle" role="group" aria-label="Indicator">
        <button type="button" data-series-btn="cpi" class="on">Inflation</button>
        <button type="button" data-series-btn="unemployment">Unemployment</button>
      </div>
    </div>
    <div class="toggle" role="group" aria-label="Chart type" style="margin-bottom:.5rem">
      <button type="button" data-target="priceChart" data-kind="line" class="on">Line</button>
      <button type="button" data-target="priceChart" data-kind="bar">Bars</button>
    </div>
    <div id="priceChart" data-series="cpi"></div>
    <p id="priceNote">After decades near zero — including a −0.2% fall in 2021 — consumer
    prices rose 2.5% in 2022, 3.3% in 2023 and 2.7% in 2024, driven by energy
    and food costs and a weak yen.</p>
    ${src('Statistics Bureau of Japan, Consumer Price Index (all items), 2015–2024.')}
  </section>

  <section class="panel" aria-label="Labour market">
    <h2>Labour market, 2024</h2>
    <div class="grid thirds">
      <article class="card stat"><h3>Unemployment</h3><p class="big">2.5%</p>
        <p class="sub">Statistics Bureau</p><p class="detail">Down from 3.4% in 2015; youth unemployment 3.9% (2025).</p></article>
      <article class="card stat"><h3>Labour force</h3><p class="big">69.3m</p>
        <p class="sub">Statistics Bureau</p><p class="detail">Participation rate about 63% — women and seniors keep joining.</p></article>
      <article class="card stat"><h3>Jobs</h3><p class="big">1.5×</p>
        <p class="sub">Vacancies per applicant</p><p class="detail">Employers have chased workers for most of the last decade.</p></article>
    </div>
    ${src('Statistics Bureau of Japan, Labour Force Survey, 2024; MHLW employment referrals.')}
  </section>`;
}

export function trade() {
  const ex = TRADE.map((t) => ({ year: t.year, value: t.exports }));
  const im = TRADE.map((t) => ({ year: t.year, value: t.imports }));
  return `
  <section class="hero slim">
    <p class="kicker">Trade · 貿易</p>
    <h1>Trade</h1>
    <p class="lede">A record ¥107.9 trillion of exports in 2024 — and still a goods
    deficit, the fourth in a row.</p>
  </section>

  <section class="panel" aria-label="Exports and imports">
    <div class="panel-head">
      <h2>Exports vs imports</h2>
      <div class="toggle" role="group" aria-label="Currency">
        <button type="button" data-currency="yen" class="on">¥ trillion</button>
        <button type="button" data-currency="usd">$ billion</button>
      </div>
    </div>
    <div id="tradeChart" data-currency="yen"></div>
    <p class="legend"><span class="sw blue"></span> Exports <span class="sw red"></span> Imports</p>
    <table class="data">
      <caption>Merchandise trade (trillion yen)</caption>
      <thead><tr><th>Year</th><th>Exports</th><th>Imports</th><th>Balance</th></tr></thead>
      <tbody>${TRADE.map((t) => `<tr><td>${t.year}</td><td>¥${t.exports.toFixed(1)}trn</td><td>¥${t.imports.toFixed(1)}trn</td><td>${t.balance > 0 ? '+' : ''}¥${t.balance.toFixed(1)}trn</td></tr>`).join('')}</tbody>
    </table>
    <p>The 2024 deficit narrowed to ¥5.3trn from ¥9.3trn in 2023 and ¥20.0trn
    in 2022, as export values hit a record and energy import costs eased.</p>
    ${src('Ministry of Finance, Trade Statistics of Japan, calendar years 2022–2024. Dollar conversion at ¥151.4/$, the 2024 average.')}
  </section>

  <section class="panel" aria-label="Current account">
    <h2>Beyond goods: the current account</h2>
    <div class="grid thirds">
      <article class="card stat"><h3>Current-account surplus</h3><p class="big">¥30.38trn</p>
        <p class="sub">Fiscal 2024 · MOF</p><p class="detail">A record, powered by investment income from abroad.</p></article>
      <article class="card stat"><h3>Goods exports</h3><p class="big">$707.4bn</p>
        <p class="sub">2024 · MOF</p><p class="detail">Cars, machinery and electronics lead the export mix.</p></article>
      <article class="card stat"><h3>Foreign reserves</h3><p class="big">$1.37trn</p>
        <p class="sub">2025 · MOF</p><p class="detail">One of the largest reserve piles in the world.</p></article>
    </div>
  </section>

  <section class="panel" aria-label="Trading partners">
    <h2>Top trading partners, fiscal 2024</h2>
    <table class="data">
      <thead><tr><th>Partner</th><th>Exports (¥trn)</th><th>Imports (¥trn)</th><th>Note</th></tr></thead>
      <tbody>${TRADE_PARTNERS.map((p) => `<tr><td>${esc(p.partner)}</td><td>${p.exports.toFixed(1)}</td><td>${p.imports.toFixed(1)}</td><td>${esc(p.note)}</td></tr>`).join('')}</tbody>
    </table>
    ${src('Ministry of Finance, Trade Statistics of Japan, fiscal 2024.')}
  </section>`;
}

export function regions() {
  const total = PREFECTURES.reduce((s, p) => s + p.population, 0);
  return `
  <section class="hero slim">
    <p class="kicker">Regions · 地域</p>
    <h1>Regions</h1>
    <p class="lede">One in nine Japanese people lives in Tokyo; the ten largest
    prefectures hold more than half the country.</p>
  </section>

  <section class="panel" aria-label="Prefecture shares">
    <h2>Where Japan lives</h2>
    <table class="data">
      <thead><tr><th>Prefecture</th><th>Population (m)</th><th>Share of Japan</th><th>Region</th></tr></thead>
      <tbody>${PREFECTURES.map((p) => `<tr><td>${esc(p.name)}</td><td>${p.population.toFixed(2)}</td><td>${((p.population / 124.0) * 100).toFixed(1)}%</td><td>${esc(p.region)}</td></tr>`).join('')}
      <tr class="total"><td>Top 10 total</td><td>${total.toFixed(2)}</td><td>${((total / 124.0) * 100).toFixed(1)}%</td><td>—</td></tr></tbody>
    </table>
    ${src('Statistics Bureau of Japan, Population Estimates, 1 October 2024; national total World Bank WDI.')}
  </section>

  <section class="panel" aria-label="Tokyo">
    <h2>Tokyo, the giant</h2>
    <p>The Greater Tokyo Area — Tokyo and its surrounding prefectures — is home
    to about 37 million people, the largest metropolitan area on Earth. Tokyo
    prefecture alone, at 14.18 million, is bigger than most countries' largest
    cities, and it keeps growing while almost every other prefecture shrinks:
    in 2024 all 47 prefectures saw their Japanese-citizen population fall
    except Tokyo, where foreign residents pushed the total up.</p>
    <p>At the other end of the scale, rural prefectures such as Akita and
    Aomori are ageing fastest, with more than a third of residents over 65.</p>
    ${src('Statistics Bureau of Japan; Ministry of Internal Affairs and Communications, 2024.')}
  </section>

  <section class="panel" aria-label="Explore more">
    <h2>Explore the data yourself</h2>
    <p>Search and sort the full top-10 table on the
    <a href="#/population">Population page</a>, or download the numbers as CSV
    from the <a href="#/sources">Sources page</a>.</p>
  </section>`;
}

export function sources() {
  return `
  <section class="hero slim">
    <p class="kicker">Sources &amp; methods · 出典と方法</p>
    <h1>Sources &amp; Methods</h1>
    <p class="lede">Every figure on this site comes from one of the sources below,
    with the year it describes shown beside it.</p>
  </section>

  <section class="panel" aria-label="Sources">
    <h2>Sources</h2>
    <table class="data">
      <thead><tr><th>Source</th><th>What it covers</th><th>Vintage</th></tr></thead>
      <tbody>${SOURCES.map((s) => `<tr><td>${esc(s.source)}</td><td>${esc(s.covers)}</td><td>${esc(s.vintage)}</td></tr>`).join('')}</tbody>
    </table>
  </section>

  <section class="panel" aria-label="Methods">
    <h2>Methods and notes</h2>
    <ul class="notes">
      <li><strong>Figures as published.</strong> Values are shown as the source
        published them; nothing is modelled, forecast or seasonally adjusted
        beyond what the source itself publishes.</li>
      <li><strong>Dollar values at market exchange rates.</strong> Nominal GDP
        and trade in dollars use market rates; the 2024 average was about
        ¥151.4 per dollar. Yen weakness, not a smaller economy, explains most
        of the fall in dollar GDP since 2019.</li>
      <li><strong>Population bases differ slightly.</strong> World Bank
        mid-year totals (124.0m for 2024) and the Statistics Bureau's
        1 October estimates are compiled differently; small gaps between them
        are normal.</li>
      <li><strong>Calendar vs fiscal year.</strong> Trade totals are calendar
        year unless marked fiscal (April–March), as the current-account and
        partner figures are.</li>
      <li><strong>Rounding.</strong> Shares may not sum to exactly 100%.</li>
    </ul>
  </section>

  <section class="panel" aria-label="Download the data">
    <h2>Download the data</h2>
    <p>Every series behind the charts, as plain CSV files you can open in any
    spreadsheet:</p>
    <ul class="downloads">
      <li><a href="data/population.csv" download>population.csv</a> — total population and age structure, 2015–2024</li>
      <li><a href="data/gdp.csv" download>gdp.csv</a> — nominal GDP and real growth, 2015–2024</li>
      <li><a href="data/cpi-unemployment.csv" download>cpi-unemployment.csv</a> — CPI inflation and unemployment, 2015–2024</li>
      <li><a href="data/trade.csv" download>trade.csv</a> — exports, imports and balance, 2022–2024</li>
      <li><a href="data/prefectures.csv" download>prefectures.csv</a> — ten largest prefectures, 2024</li>
    </ul>
    <p class="src">All files are part of this site — no download leaves it.</p>
  </section>`;
}

export function missing() {
  return `
  <section class="hero slim">
    <h1>Not found</h1>
    <p class="lede">There is no page at this address. Try one of the sections above.</p>
    <p><a href="#/">← Back to the overview</a></p>
  </section>`;
}

// Year-in-review panel content, rendered by main.js when the picker changes.
export function yearReview(year) {
  const gdp = lookup(GDP_NOMINAL, year);
  const growth = lookup(GDP_REAL_GROWTH, year);
  const cpi = lookup(CPI, year);
  const unemp = lookup(UNEMPLOYMENT, year);
  const pop = lookup(POPULATION, year);
  const cell = (label, value, sub) => `<article class="card stat">
    <h3>${esc(label)}</h3><p class="big">${esc(value)}</p><p class="sub">${esc(sub)}</p></article>`;
  return `
    ${cell('Population', `${pop.toFixed(1)}m`, 'World Bank WDI')}
    ${cell('Nominal GDP', `$${gdp.toFixed(2)}trn`, 'World Bank WDI')}
    ${cell('Real GDP growth', `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`, 'World Bank WDI')}
    ${cell('CPI inflation', `${cpi > 0 ? '+' : ''}${cpi.toFixed(1)}%`, 'Statistics Bureau')}
    ${cell('Unemployment', `${unemp.toFixed(1)}%`, 'Statistics Bureau')}`;
}

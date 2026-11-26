// Japan in Numbers — every figure with its source and year.
// Sources: World Bank World Development Indicators (WDI) 2024; IMF World
// Economic Outlook (WEO); Statistics Bureau of Japan; Ministry of Health,
// Labour and Welfare (MHLW) Vital Statistics; Ministry of Finance (MOF)
// Trade Statistics of Japan; ILOSTAT. Yen/dollar conversions use the 2024
// average rate of about 151.4 yen per dollar unless stated otherwise.

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

// Total population, millions, mid-year. World Bank WDI.
export const POPULATION = [
  { year: 2015, value: 127.1 },
  { year: 2016, value: 127.0 },
  { year: 2017, value: 126.8 },
  { year: 2018, value: 126.5 },
  { year: 2019, value: 126.3 },
  { year: 2020, value: 126.2 },
  { year: 2021, value: 125.7 },
  { year: 2022, value: 125.1 },
  { year: 2023, value: 124.5 },
  { year: 2024, value: 124.0 },
];

// Age structure, % of total population, 2024. World Bank WDI.
export const AGE_STRUCTURE_2024 = [
  { group: '0–14 years', share: 11.4, note: '14.1 million children' },
  { group: '15–64 years', share: 58.8, note: '72.9 million working age' },
  { group: '65 years and over', share: 29.8, note: '36.9 million seniors' },
];

// Nominal GDP, US$ trillion, market exchange rates. World Bank WDI.
export const GDP_NOMINAL = [
  { year: 2015, value: 4.44 },
  { year: 2016, value: 5.0 },
  { year: 2017, value: 4.93 },
  { year: 2018, value: 5.04 },
  { year: 2019, value: 5.12 },
  { year: 2020, value: 5.04 },
  { year: 2021, value: 5.03 },
  { year: 2022, value: 4.26 },
  { year: 2023, value: 4.22 },
  { year: 2024, value: 4.02 },
];

// Real GDP growth, % year on year. World Bank WDI.
export const GDP_REAL_GROWTH = [
  { year: 2015, value: 1.6 },
  { year: 2016, value: 0.8 },
  { year: 2017, value: 1.7 },
  { year: 2018, value: 0.6 },
  { year: 2019, value: -0.4 },
  { year: 2020, value: -4.2 },
  { year: 2021, value: 2.7 },
  { year: 2022, value: 1.0 },
  { year: 2023, value: 1.7 },
  { year: 2024, value: 0.1 },
];

// Consumer price inflation, % year on year (all items, national CPI).
// Statistics Bureau of Japan.
export const CPI = [
  { year: 2015, value: 0.8 },
  { year: 2016, value: -0.1 },
  { year: 2017, value: 0.5 },
  { year: 2018, value: 1.0 },
  { year: 2019, value: 0.5 },
  { year: 2020, value: 0.0 },
  { year: 2021, value: -0.2 },
  { year: 2022, value: 2.5 },
  { year: 2023, value: 3.3 },
  { year: 2024, value: 2.7 },
];

// Unemployment rate, % of labour force, seasonally adjusted annual average.
// Statistics Bureau of Japan, Labour Force Survey.
export const UNEMPLOYMENT = [
  { year: 2015, value: 3.4 },
  { year: 2016, value: 3.1 },
  { year: 2017, value: 2.8 },
  { year: 2018, value: 2.4 },
  { year: 2019, value: 2.4 },
  { year: 2020, value: 2.8 },
  { year: 2021, value: 2.8 },
  { year: 2022, value: 2.6 },
  { year: 2023, value: 2.6 },
  { year: 2024, value: 2.5 },
];

// Merchandise trade, trillion yen, calendar year. Ministry of Finance,
// Trade Statistics of Japan. 2022–2024 are the solid published years.
export const TRADE = [
  { year: 2022, exports: 98.2, imports: 118.2, balance: -20.0 },
  { year: 2023, exports: 100.9, imports: 110.2, balance: -9.3 },
  { year: 2024, exports: 107.9, imports: 113.2, balance: -5.3 },
];

// Ten largest prefectures by population, millions, 1 October 2024 estimates.
// Statistics Bureau of Japan, Population Estimates.
export const PREFECTURES = [
  { name: 'Tokyo', capital: 'Tokyo', population: 14.18, region: 'Kanto' },
  { name: 'Kanagawa', capital: 'Yokohama', population: 9.24, region: 'Kanto' },
  { name: 'Osaka', capital: 'Osaka', population: 8.81, region: 'Kansai' },
  { name: 'Aichi', capital: 'Nagoya', population: 7.48, region: 'Chubu' },
  { name: 'Saitama', capital: 'Saitama', population: 7.33, region: 'Kanto' },
  { name: 'Chiba', capital: 'Chiba', population: 6.28, region: 'Kanto' },
  { name: 'Hyogo', capital: 'Kobe', population: 5.37, region: 'Kansai' },
  { name: 'Hokkaido', capital: 'Sapporo', population: 5.11, region: 'Hokkaido' },
  { name: 'Fukuoka', capital: 'Fukuoka', population: 5.10, region: 'Kyushu' },
  { name: 'Shizuoka', capital: 'Shizuoka', population: 3.53, region: 'Chubu' },
];

// Employment shares by sector, % of total employment, 2024. ILOSTAT.
export const EMPLOYMENT_SHARES_2024 = [
  { sector: 'Services', share: 73.8 },
  { sector: 'Industry', share: 23.3 },
  { sector: 'Agriculture', share: 2.9 },
];

// Headline facts for the overview dashboard.
export const HEADLINES = [
  { label: 'Population', value: '124.0m', sub: '2024 · World Bank', detail: 'Down 0.44% on the year; peaked at 128.5m in 2010.' },
  { label: 'GDP, nominal', value: '$4.02trn', sub: '2024 · IMF WEO', detail: 'World’s 4th-largest economy; $32,443 per person.' },
  { label: 'Real GDP growth', value: '+0.1%', sub: '2024 · World Bank', detail: 'Near-flat after +1.7% in 2023.' },
  { label: 'CPI inflation', value: '+2.7%', sub: '2024 · Statistics Bureau', detail: 'Third straight year above 2% after decades near zero.' },
  { label: 'Unemployment', value: '2.5%', sub: '2024 · Statistics Bureau', detail: 'Labour force 69.3m; participation about 63%.' },
  { label: 'Life expectancy', value: '84.0 yrs', sub: '2024 · World Bank', detail: 'Among the longest-lived populations on Earth.' },
  { label: 'Fertility rate', value: '1.15', sub: '2024 · MHLW', detail: 'Record low; births 686,061 vs deaths about 1.61m.' },
  { label: 'Government debt', value: '~230%', sub: 'of GDP · IMF, 2025', detail: 'The highest public-debt ratio in the developed world.' },
];

// At-a-glance facts, overview page.
export const AT_A_GLANCE = [
  { label: 'Capital', value: 'Tokyo' },
  { label: 'Currency', value: 'Yen (¥)' },
  { label: 'Land area', value: '377,975 km²' },
  { label: 'Population density', value: '≈ 341 / km²' },
  { label: 'Urban population', value: '92.2% (2024)' },
  { label: 'Median age', value: '49.9 years (2024)' },
  { label: 'Foreign residents', value: '3.6m (2024, record)' },
  { label: 'Time zone', value: 'JST (UTC+9)' },
];

// Trade partners, fiscal year 2024. Ministry of Finance.
export const TRADE_PARTNERS = [
  { partner: 'China', exports: 18.9, imports: 25.9, note: 'Largest partner both ways' },
  { partner: 'United States', exports: 20.8, imports: 12.0, note: 'Largest export market' },
  { partner: 'South Korea', exports: 7.4, imports: 5.6, note: '' },
  { partner: 'Taiwan', exports: 6.5, imports: 4.9, note: '' },
  { partner: 'Australia', exports: 2.9, imports: 8.2, note: 'Energy and minerals' },
];

// Sources page — every source the site cites, with its vintage.
export const SOURCES = [
  { source: 'World Bank — World Development Indicators', covers: 'Population, GDP, GDP per capita, life expectancy, age structure', vintage: '2024 edition, accessed November 2026' },
  { source: 'IMF — World Economic Outlook', covers: 'Nominal GDP, GDP per capita, government gross debt', vintage: '2025 vintage; debt figure for 2025' },
  { source: 'Statistics Bureau of Japan — Population Estimates', covers: 'Prefecture populations, CPI, unemployment', vintage: '1 October 2024 estimates; CPI and Labour Force Survey annual averages' },
  { source: 'Ministry of Health, Labour and Welfare — Vital Statistics', covers: 'Births, deaths, total fertility rate', vintage: '2024 final figures, published June 2025' },
  { source: 'Ministry of Finance — Trade Statistics of Japan', covers: 'Exports, imports, trade balance, current account, partners', vintage: 'Calendar 2024 and fiscal 2024' },
  { source: 'ILOSTAT — International Labour Organization', covers: 'Employment shares by sector', vintage: '2024' },
];

export const YEN_PER_DOLLAR_2024 = 151.4;

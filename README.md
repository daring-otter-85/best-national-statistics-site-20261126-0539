# Japan in Numbers — 日本統計年鑑

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/daring-otter-85/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/daring-otter-85/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

Japan's population, economy, prices, labour and trade — official figures
with sources, 2015–2024, in one fast static site. No framework, no network
requests, no build step: plain HTML, CSS and hand-rolled SVG charts.

- **Overview** — eight headline indicators for 2024 plus a year-in-review
  picker (2015–2024) and the three trends that define the decade.
- **Population** — total population line/bar chart with a yearly table, age
  structure, births vs deaths (686,061 vs ≈1.61m in 2024), and a
  searchable, sortable table of the ten largest prefectures.
- **Economy** — nominal GDP and real growth charts, employment by sector,
  R&D and government debt.
- **Prices & Labour** — CPI inflation and unemployment, switchable series
  and chart type, plus the 2024 labour market at a glance.
- **Trade** — exports vs imports with a ¥/$ toggle, the record
  current-account surplus, and top trading partners.
- **Regions** — where Japan lives, prefecture by prefecture, and the
  37-million-strong Greater Tokyo Area.
- **Sources & Methods** — every source with its vintage, plus the full
  dataset as downloadable CSV files under `app/data/`.

Every figure carries its source and year on the page where it appears.
Sources: World Bank WDI, IMF WEO, Statistics Bureau of Japan, MHLW Vital
Statistics, Ministry of Finance Trade Statistics, ILOSTAT.

## Run it

```sh
node serve.ts   # then open http://localhost:8080
```

Or serve `app/` with any static file server and open `app/index.html`.
Hash routes (`#/population`, `#/economy`, …) work from any static host.

import fs from 'fs/promises';
import path from 'path';

const ROOT = path.resolve(process.cwd());
const REPORT_PATH = path.join(ROOT, 'src', 'data', 'report.json');
const FACTCHECK_PATH = path.join(ROOT, 'src', 'data', 'factCheckDatabase.json');

const FRED_SERIES = {
  medianListingPrice: 'MEDLISPRI27740', // Johnson City, TN (CBSA)
};

const NEWS_RSS = 'https://news.google.com/rss/search?q=Tri-Cities%20Tennessee%20real%20estate%20OR%20Johnson%20City%20housing%20market%20OR%20Kingsport%20housing%20market%20OR%20Bristol%20TN%20real%20estate&hl=en-US&gl=US&ceid=US:en';

function formatDateLong(date = new Date()) {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

async function loadJSON(filePath) {
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

async function saveJSON(filePath, data) {
  const json = JSON.stringify(data, null, 2) + '\n';
  await fs.writeFile(filePath, json, 'utf-8');
}

async function fetchCSV(seriesId) {
  const url = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${seriesId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`FRED fetch failed: ${seriesId} (${res.status})`);
  return res.text();
}

function parseFRED(csvText) {
  const lines = csvText.trim().split('\n');
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const [dateStr, valueStr] = lines[i].split(',');
    if (!dateStr) continue;
    if (!valueStr || valueStr === '.') continue;
    const value = Number(valueStr);
    if (Number.isNaN(value)) continue;
    rows.push({ date: dateStr, value });
  }
  return rows;
}

function getLatest(rows) {
  return rows[rows.length - 1];
}

function getYearAgo(rows, latestDateStr) {
  const [year, month] = latestDateStr.split('-').map(Number);
  const target = `${year - 1}-${String(month).padStart(2, '0')}-01`;
  const direct = rows.find(r => r.date === target);
  if (direct) return direct;
  // fallback: closest prior same month
  const fallback = rows
    .filter(r => r.date.startsWith(`${year - 1}-${String(month).padStart(2, '0')}`))
    .sort((a, b) => a.date.localeCompare(b.date))
    .pop();
  return fallback || rows[Math.max(0, rows.length - 13)];
}

function buildAnnualSeries(rows, years = 6) {
  const byYear = new Map();
  for (const row of rows) {
    const y = row.date.slice(0, 4);
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y).push(row.value);
  }
  const allYears = Array.from(byYear.keys()).sort();
  const recentYears = allYears.slice(-years);
  return recentYears.map((y) => {
    const vals = byYear.get(y);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    return { year: y, price: Math.round(avg) };
  });
}

function parseRSS(xmlText, maxItems = 5) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xmlText)) && items.length < maxItems) {
    const itemXml = match[1];
    const getTag = (tag) => {
      const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`);
      const m = itemXml.match(regex);
      return m ? m[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim() : '';
    };
    const title = getTag('title');
    const link = getTag('link');
    const pubDate = getTag('pubDate');
    const source = getTag('source');
    if (title && link) items.push({ title, link, pubDate, source });
  }
  return items;
}

function ensureMarketPulseSection(report, items) {
  const sectionId = 'market-pulse';
  const tldr = items.length
    ? `This week's market pulse highlights ${items.length} local headlines impacting Tri-Cities housing and development.`
    : 'No new market headlines were found this week.';

  const content = items.length
    ? items.map((item) => {
        const sourceLabel = item.source ? ` (${item.source})` : '';
        const dateLabel = item.pubDate ? ` — ${item.pubDate}` : '';
        return `${item.title}${sourceLabel}${dateLabel} — ${item.link}`;
      })
    : ['No new items found this week.'];

  const newSection = {
    id: sectionId,
    title: 'Weekly Market Pulse (Auto-Generated)',
    tldr,
    content,
  };

  const existingIndex = report.sections.findIndex((s) => s.id === sectionId);
  if (existingIndex >= 0) {
    report.sections[existingIndex] = newSection;
    return;
  }

  const insertAfter = report.sections.findIndex((s) => s.id === 'market-trends');
  if (insertAfter >= 0) {
    report.sections.splice(insertAfter + 1, 0, newSection);
  } else {
    report.sections.push(newSection);
  }
}

function updateCitations(report, items) {
  if (!items.length) return;
  const existingIds = report.citations.map((c) => c.id);
  let nextId = existingIds.length ? Math.max(...existingIds) + 1 : 1;
  const nowYear = new Date().getFullYear();
  const newCitations = items.map((item) => ({
    id: nextId++,
    title: item.title,
    author: item.source || 'News Source',
    year: nowYear,
    url: item.link,
    context: 'Weekly Market Pulse (auto-generated) — local housing and development headline.',
    excerpt: item.title,
    relevance: 'Weekly headline for the Tri-Cities market pulse section.'
  }));

  report.citations = report.citations.concat(newCitations);
}

async function main() {
  const report = await loadJSON(REPORT_PATH);
  const factCheck = await loadJSON(FACTCHECK_PATH);

  // Update metadata date
  report.metadata.date = formatDateLong();

  // Update median listing price + YoY growth
  const fredCsv = await fetchCSV(FRED_SERIES.medianListingPrice);
  const rows = parseFRED(fredCsv);
  if (rows.length) {
    const latest = getLatest(rows);
    const yearAgo = getYearAgo(rows, latest.date);
    const yoy = yearAgo ? ((latest.value - yearAgo.value) / yearAgo.value) * 100 : null;

    report.keyMetrics.medianHomePrice = Math.round(latest.value);
    report.keyMetrics.homePriceGrowth = yoy ? Math.round(yoy * 10) / 10 : report.keyMetrics.homePriceGrowth;

    // Update price trend chart
    for (const section of report.sections) {
      if (section.id === 'housing-market' && section.charts) {
        const chart = section.charts.find((c) => c.title.includes('Median Home Price Trends'));
        if (chart) {
          chart.title = 'Median Listing Price Trends (Recent Years)';
          chart.data = buildAnnualSeries(rows, 6);
        }
      }
    }
  }

  // Weekly market pulse
  try {
    const rssRes = await fetch(NEWS_RSS);
    if (rssRes.ok) {
      const rssText = await rssRes.text();
      const items = parseRSS(rssText, 5);
      ensureMarketPulseSection(report, items);
      updateCitations(report, items);
    } else {
      ensureMarketPulseSection(report, []);
    }
  } catch (err) {
    ensureMarketPulseSection(report, []);
  }

  await saveJSON(REPORT_PATH, report);
  await saveJSON(FACTCHECK_PATH, factCheck);

  console.log('✅ Report data updated');
}

main().catch((err) => {
  console.error('❌ Update failed:', err);
  process.exit(1);
});

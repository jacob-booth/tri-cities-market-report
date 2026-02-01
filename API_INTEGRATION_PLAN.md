# Real-Time API Integration Plan

## Available Free APIs

### 1. FRED (Federal Reserve Economic Data) - FREE
**Base URL:** `https://api.stlouisfed.org/fred/series/observations`

**What we can get:**
- Unemployment rate (Tennessee, Tri-Cities area)
- Median household income
- Housing price indexes

**Example endpoints:**
```
https://api.stlouisfed.org/fred/series/observations?series_id=TNUR&api_key=YOUR_KEY
```

**Rate limit:** 120 requests/minute (free tier)

---

### 2. DataUSA API - FREE
**Base URL:** `https://datausa.io/api/data`

**What we can get:**
- Population data (census)
- Demographics
- Employment stats
- Income data

**Example endpoints:**
```
https://datausa.io/api/data?drilldowns=Geography&measures=Population&Geography=16000US4737640
```

**Johnson City FIPS:** 16000US4737640  
**Kingsport FIPS:** 16000US4739520  
**Bristol FIPS:** 16000US4708600

---

### 3. Census Bureau API - FREE
**Base URL:** `https://api.census.gov/data`

**What we can get:**
- Current population estimates
- Housing data
- Economic indicators

**Example:**
```
https://api.census.gov/data/2023/acs/acs1?get=NAME,B01001_001E,B19013_001E&for=place:37640&in=state:47
```

---

### 4. Attom Data (Real Estate) - FREE TIER
**Base URL:** `https://api.gateway.attomdata.com`

**What we can get:**
- Property values
- Median home prices
- Sales data

**Rate limit:** 500 calls/month (free)

---

## Implementation Strategy

Since GitHub Pages is static, we have 2 options:

### Option A: Client-Side (Simple, limited by CORS)
- Call APIs directly from browser
- Some APIs support CORS (DataUSA, Census)
- No backend needed
- Limited by browser security

### Option B: GitHub Actions Cron (Recommended)
- Schedule GitHub Actions to fetch data every hour
- Update data files in repo
- Push updates automatically
- No backend server needed
- More reliable

I'll implement Option B since it's more reliable for production.

## API Keys Needed

1. **FRED API Key:** https://fred.stlouisfed.org/docs/api/api_key.html
2. **Census API Key:** https://api.census.gov/data/key_signup.html
3. **Attom API Key:** https://www.attomdata.com/contact/ (free tier)

## Data Mapping

| Current Metric | Real API Source | API Endpoint |
|---------------|----------------|--------------|
| Median Home Price | Attom / Zillow | Property data |
| Population Growth | Census API | Population estimates |
| Unemployment Rate | FRED | LAU data |
| Median Income | Census / DataUSA | ACS data |

## Next Steps

1. Create `.github/workflows/update-data.yml`
2. Create `scripts/fetch-real-data.js`
3. Set up GitHub secrets for API keys
4. Test locally
5. Deploy and verify

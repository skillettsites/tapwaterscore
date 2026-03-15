# TapWaterScore (tapwaterscore.com)

## What
US tap water quality lookup by ZIP code. Free basic water quality grade (A-F), with optional paid detailed reports. Powered by EPA SDWIS data.

## Commands
- `npm run dev` - local dev server
- `npm run build` - production build
- `npm run lint` - lint

## Key Paths
- `lib/epa.ts` - EPA data client: Envirofacts API, ECHO DFR API, bulk data integration
- `lib/pfas-data.ts` - UCMR5 PFAS data module (reads pfas-compact.json)
- `lib/zip-systems.ts` - Pre-built ZIP-to-water-system lookup (reads zip-to-systems.json)
- `lib/types.ts` - TypeScript types and grade definitions
- `data/processed/` - Pre-processed JSON from EPA bulk CSVs (committed to git)
- `data/raw/` - Raw EPA bulk CSVs (gitignored, download via scripts)
- `scripts/process-ucmr5.js` - Processes UCMR5 raw data into pfas-compact.json
- `scripts/process-sdwa-geo2.js` - Processes SDWA CSVs into zip-to-systems.json
- `components/ZipLookup.tsx` - ZIP code search component
- `app/page.tsx` - Homepage with ZIP lookup
- `app/zip/[zip]/page.tsx` - Water quality report page (ISR, 24h revalidation)
- `app/states/page.tsx` - Water quality by state directory (all 50 states + DC)
- `app/states/[slug]/page.tsx` - Individual state pages with ZIP lookup (SSG via generateStaticParams)
- `app/cities/page.tsx` - Water quality by city directory (200+ cities, all 50 states + DC)
- `app/cities/[state]/[city]/page.tsx` - Individual city pages (SSG via generateStaticParams)
- `lib/cities.ts` - City data: 201 cities with water source, concerns, overview, nearby cities
- `app/contaminants/page.tsx` - Contaminant guide (21 contaminants across 5 categories)
- `app/filters/page.tsx` - Filter recommendations

## Architecture
- Next.js 16 App Router, TypeScript strict, Tailwind CSS v4
- Server components with ISR (24h revalidation for ZIP report pages)
- EPA Envirofacts API (no API key, no auth, free, no rate limit published)
- ZIP -> water system mapping via EPA GEOGRAPHIC_AREA table
- Grade calculated from violation history (health-based weighted higher, recent weighted higher)
- Colour scheme: teal/cyan gradient (distinct from CarCostCheck blue)

## Data Sources
- EPA SDWIS via Envirofacts REST API: https://data.epa.gov/efservice/
  - WATER_SYSTEM table: system info
  - GEOGRAPHIC_AREA table: ZIP to PWS mapping
  - VIOLATION table: violation records
- EPA ECHO DFR API: https://echodata.epa.gov/echo/
  - Violations, lead/copper data, system search by city
- EPA SDWA Bulk CSVs (ECHO downloads): https://echo.epa.gov/files/echodownloads/
  - SDWA_GEOGRAPHIC_AREAS.csv + SDWA_PUB_WATER_SYSTEMS.csv -> data/processed/zip-to-systems.json (20,609 ZIPs)
  - Used as fast pre-built ZIP-to-PWSID lookup (falls back to API if not found)
- EPA UCMR5 Bulk Data: https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule
  - data/processed/pfas-compact.json (9,823 ZIPs with actual PFAS lab measurements)
  - 5,018 ZIPs exceed EPA MCLs for PFOA/PFOS/PFHxS/PFNA/HFPO-DA
- No API key required. Free. Public domain data.

## TODO
- Sign up for EPA Envirofacts API key if rate limited (check if needed)
- Add Google Analytics tracking ID
- Add Stripe for paid detailed reports
- ~~Build state comparison pages (programmatic SEO)~~ DONE (directory + 51 individual state pages)
- ~~Build contaminant guide pages~~ DONE
- ~~Build city-level pages (programmatic SEO)~~ DONE (201 cities across all 50 states + DC)
- Build filter recommendation pages with affiliate links
- Add water filter affiliate programme links (Epic Water Filters 15%, Crystal Quest 15%)
- ~~Investigate EPA ECHO bulk CSV downloads for richer contaminant level data~~ DONE (UCMR5 PFAS + SDWA geographic/system data integrated)
- Investigate Water Quality Portal API for additional data
- Re-run scripts/process-ucmr5.js and scripts/process-sdwa-geo2.js quarterly when EPA updates data

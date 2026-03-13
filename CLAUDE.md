# TapWaterScore (tapwaterscore.com)

## What
US tap water quality lookup by ZIP code. Free basic water quality grade (A-F), with optional paid detailed reports. Powered by EPA SDWIS data.

## Commands
- `npm run dev` - local dev server
- `npm run build` - production build
- `npm run lint` - lint

## Key Paths
- `lib/epa.ts` - EPA Envirofacts SDWIS API client (no API key needed)
- `lib/types.ts` - TypeScript types and grade definitions
- `components/ZipLookup.tsx` - ZIP code search component
- `app/page.tsx` - Homepage with ZIP lookup
- `app/zip/[zip]/page.tsx` - Water quality report page (ISR, 24h revalidation)
- `app/states/` - Water quality by state (TODO)
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
- No API key required. Free. Public domain data.

## TODO
- Sign up for EPA Envirofacts API key if rate limited (check if needed)
- Add Google Analytics tracking ID
- Add Stripe for paid detailed reports
- Build state comparison pages (programmatic SEO)
- ~~Build contaminant guide pages~~ DONE
- Build filter recommendation pages with affiliate links
- Add water filter affiliate programme links (Epic Water Filters 15%, Crystal Quest 15%)
- Investigate EPA ECHO bulk CSV downloads for richer contaminant level data
- Investigate Water Quality Portal API for additional data

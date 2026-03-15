/**
 * Process SDWA Violations CSV into a compact ZIP-level violations database.
 *
 * Input:
 *   data/raw/SDWA_VIOLATIONS_ENFORCEMENT.csv
 *   (extracted from SDWA_latest_downloads.zip downloaded from
 *    https://echo.epa.gov/files/echodownloads/SDWA_latest_downloads.zip)
 *   data/processed/zip-to-systems.json (PWSID -> ZIP mapping)
 *
 * Output:
 *   data/processed/violations-by-zip.json
 *
 * To download the source data:
 *   1. Download https://echo.epa.gov/files/echodownloads/SDWA_latest_downloads.zip (~457MB)
 *   2. Extract SDWA_VIOLATIONS_ENFORCEMENT.csv into data/raw/
 *   3. Run: node scripts/process-violations.js
 *
 * The output JSON uses compact keys to minimise file size:
 *   { "90210": { v: 5, h: 2, r: 1, f: "2015-01", l: "2024-06", c: [["Lead",2],["Nitrate",1]], t: "improving" } }
 *
 *   v = total violation count
 *   h = health-based violation count
 *   r = recent health violations (last 3 years)
 *   f = first violation date (YYYY-MM)
 *   l = last violation date (YYYY-MM)
 *   c = top contaminants array: [[name, count], ...]
 *   t = trend: "i" (improving), "w" (worsening), "s" (stable), "n" (new/insufficient data)
 */

const fs = require('fs');
const readline = require('readline');
const path = require('path');

const RAW_DIR = path.join(__dirname, '..', 'data', 'raw');
const OUT_DIR = path.join(__dirname, '..', 'data', 'processed');
const VIOLATIONS_CSV = path.join(RAW_DIR, 'SDWA_VIOLATIONS_ENFORCEMENT.csv');
const ZIP_SYSTEMS_JSON = path.join(OUT_DIR, 'zip-to-systems.json');

// Health-based violation category codes
const HEALTH_CATEGORIES = new Set(['MCL', 'MRDL', 'TT']);

// Contaminant code to name mapping (common ones)
const CONTAMINANT_NAMES = {
  '1005': 'Barium',
  '1010': 'Cadmium',
  '1015': 'Chromium',
  '1020': 'Fluoride',
  '1024': 'Cyanide',
  '1025': 'Lead',
  '1030': 'Mercury',
  '1035': 'Nitrate',
  '1036': 'Nitrite',
  '1038': 'Nitrate-Nitrite',
  '1040': 'Selenium',
  '1041': 'Sodium',
  '1045': 'Silver',
  '1074': 'Antimony',
  '1075': 'Beryllium',
  '1085': 'Thallium',
  '1094': 'Copper',
  '2039': 'Arsenic',
  '2050': 'Atrazine',
  '2326': 'Lindane',
  '2456': 'Total THMs',
  '2950': 'Total HAAs',
  '2964': 'Combined Radium',
  '2965': 'Gross Alpha',
  '2968': 'Uranium',
  '2984': 'Total Coliform',
  '3013': 'Fecal Coliform',
  '3014': 'E. coli',
  '3100': 'Turbidity',
  '3200': 'Surface Water Treatment',
  '3300': 'Groundwater Rule',
  '7000': 'PFOA',
  '7001': 'PFOS',
  '7500': 'GenX',
};

function parseCsvLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

function parseDate(dateStr) {
  if (!dateStr) return null;
  // Dates come as MM/DD/YYYY or YYYY-MM-DD or similar
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [m, d, y] = parts;
    return `${y}-${m.padStart(2, '0')}`;
  }
  // Try ISO format
  if (dateStr.length >= 7) {
    return dateStr.slice(0, 7);
  }
  return null;
}

function getContaminantName(code) {
  return CONTAMINANT_NAMES[code] || null;
}

async function main() {
  console.log('=== SDWA Violations Processor ===\n');

  // Check input files exist
  if (!fs.existsSync(VIOLATIONS_CSV)) {
    console.error(`Error: ${VIOLATIONS_CSV} not found.`);
    console.error('');
    console.error('To get the data:');
    console.error('  1. Download https://echo.epa.gov/files/echodownloads/SDWA_latest_downloads.zip');
    console.error('  2. Extract SDWA_VIOLATIONS_ENFORCEMENT.csv into data/raw/');
    console.error('  3. Re-run this script.');
    process.exit(1);
  }

  if (!fs.existsSync(ZIP_SYSTEMS_JSON)) {
    console.error(`Error: ${ZIP_SYSTEMS_JSON} not found. Run process-sdwa-geo2.js first.`);
    process.exit(1);
  }

  // Step 1: Build PWSID -> ZIP mapping from zip-to-systems.json (reverse lookup)
  console.log('Building PWSID -> ZIP reverse lookup...');
  const zipSystems = JSON.parse(fs.readFileSync(ZIP_SYSTEMS_JSON, 'utf-8'));
  const pwsidToZips = new Map();

  for (const [zip, systems] of Object.entries(zipSystems)) {
    for (const sys of systems) {
      const pwsid = sys.id;
      if (pwsidToZips.has(pwsid)) {
        pwsidToZips.get(pwsid).push(zip);
      } else {
        pwsidToZips.set(pwsid, [zip]);
      }
    }
  }
  console.log(`  ${pwsidToZips.size} PWSIDs mapped to ${Object.keys(zipSystems).length} ZIP codes\n`);

  // Step 2: Read violations CSV and aggregate by PWSID
  console.log('Reading violations CSV...');
  const rl = readline.createInterface({
    input: fs.createReadStream(VIOLATIONS_CSV),
    crlfDelay: Infinity,
  });

  let headers = null;
  let headerIdx = {};
  let rowCount = 0;
  let violationRows = 0;
  let skippedEnforcementOnly = 0;

  // Aggregate by PWSID
  // Each PWSID tracks: total violations, health violations, dates, contaminants by year
  const pwsidData = new Map();

  for await (const line of rl) {
    if (headers === null) {
      headers = parseCsvLine(line);
      // Build column index
      for (let i = 0; i < headers.length; i++) {
        headerIdx[headers[i]] = i;
      }
      console.log(`  Columns: ${headers.length}`);
      console.log(`  Key columns: PWSID=${headerIdx['PWSID']}, VIOLATION_ID=${headerIdx['VIOLATION_ID']}, VIOLATION_CATEGORY_CODE=${headerIdx['VIOLATION_CATEGORY_CODE']}, IS_HEALTH_BASED_IND=${headerIdx['IS_HEALTH_BASED_IND']}, CONTAMINANT_CODE=${headerIdx['CONTAMINANT_CODE']}\n`);
      continue;
    }

    rowCount++;
    if (rowCount % 500000 === 0) {
      console.log(`  ... processed ${(rowCount / 1000000).toFixed(1)}M rows`);
    }

    const fields = parseCsvLine(line);

    const pwsid = fields[headerIdx['PWSID']];
    const violationId = fields[headerIdx['VIOLATION_ID']];
    const violationCategoryCode = fields[headerIdx['VIOLATION_CATEGORY_CODE']];
    const isHealthBased = fields[headerIdx['IS_HEALTH_BASED_IND']];
    const contaminantCode = fields[headerIdx['CONTAMINANT_CODE']];
    const beginDate = fields[headerIdx['NON_COMPL_PER_BEGIN_DATE']];
    const endDate = fields[headerIdx['NON_COMPL_PER_END_DATE']];
    const violationStatus = fields[headerIdx['VIOLATION_STATUS']];

    // Skip rows that are enforcement-only (no violation ID)
    if (!violationId) {
      skippedEnforcementOnly++;
      continue;
    }

    if (!pwsid) continue;

    violationRows++;

    const parsedEnd = parseDate(endDate) || parseDate(beginDate);
    const parsedBegin = parseDate(beginDate);
    const year = parsedEnd ? parseInt(parsedEnd.slice(0, 4)) : null;
    const isHealth = isHealthBased === 'Y' || HEALTH_CATEGORIES.has(violationCategoryCode);

    let entry = pwsidData.get(pwsid);
    if (!entry) {
      entry = {
        violations: new Set(), // Track unique violation IDs
        totalViolations: 0,
        healthViolations: 0,
        firstDate: null,
        lastDate: null,
        contaminants: new Map(), // contaminant name -> count
        byHalf: new Map(), // "early" (>5yr ago) vs "recent" (last 5yr) health violations
      };
      pwsidData.set(pwsid, entry);
    }

    // Deduplicate by violation ID (the CSV can have multiple rows per violation due to enforcement joins)
    if (entry.violations.has(violationId)) continue;
    entry.violations.add(violationId);

    entry.totalViolations++;
    if (isHealth) {
      entry.healthViolations++;
    }

    // Track dates
    if (parsedEnd) {
      if (!entry.firstDate || parsedEnd < entry.firstDate) entry.firstDate = parsedEnd;
      if (!entry.lastDate || parsedEnd > entry.lastDate) entry.lastDate = parsedEnd;
    }
    if (parsedBegin) {
      if (!entry.firstDate || parsedBegin < entry.firstDate) entry.firstDate = parsedBegin;
    }

    // Track contaminants (health-based only for top concerns)
    const contaminantName = getContaminantName(contaminantCode);
    if (contaminantName) {
      entry.contaminants.set(contaminantName, (entry.contaminants.get(contaminantName) || 0) + 1);
    }

    // Track trend: violations in first half vs second half of history
    if (year && isHealth) {
      const currentYear = new Date().getFullYear();
      const bucket = year >= currentYear - 3 ? 'recent' : year >= currentYear - 7 ? 'mid' : 'old';
      entry.byHalf.set(bucket, (entry.byHalf.get(bucket) || 0) + 1);
    }
  }

  console.log(`\n  Total rows: ${rowCount.toLocaleString()}`);
  console.log(`  Violation rows: ${violationRows.toLocaleString()}`);
  console.log(`  Enforcement-only rows skipped: ${skippedEnforcementOnly.toLocaleString()}`);
  console.log(`  Unique PWSIDs with violations: ${pwsidData.size.toLocaleString()}`);

  // Count unique violations
  let totalUniqueViolations = 0;
  for (const entry of pwsidData.values()) {
    totalUniqueViolations += entry.violations.size;
  }
  console.log(`  Unique violations: ${totalUniqueViolations.toLocaleString()}\n`);

  // Step 3: Map PWSID violations to ZIP codes
  console.log('Mapping violations to ZIP codes...');
  const zipViolations = new Map();

  let mappedPwsids = 0;
  let unmappedPwsids = 0;

  for (const [pwsid, data] of pwsidData) {
    const zips = pwsidToZips.get(pwsid);
    if (!zips) {
      unmappedPwsids++;
      continue;
    }
    mappedPwsids++;

    for (const zip of zips) {
      let existing = zipViolations.get(zip);
      if (!existing) {
        existing = {
          totalViolations: 0,
          healthViolations: 0,
          recentHealthViolations: 0,
          firstDate: null,
          lastDate: null,
          contaminants: new Map(),
          trend: 'n',
        };
        zipViolations.set(zip, existing);
      }

      existing.totalViolations += data.totalViolations;
      existing.healthViolations += data.healthViolations;

      // Recent health violations (last 3 years)
      existing.recentHealthViolations += (data.byHalf.get('recent') || 0);

      // Dates
      if (data.firstDate) {
        if (!existing.firstDate || data.firstDate < existing.firstDate) {
          existing.firstDate = data.firstDate;
        }
      }
      if (data.lastDate) {
        if (!existing.lastDate || data.lastDate > existing.lastDate) {
          existing.lastDate = data.lastDate;
        }
      }

      // Merge contaminants
      for (const [name, count] of data.contaminants) {
        existing.contaminants.set(name, (existing.contaminants.get(name) || 0) + count);
      }

      // Calculate trend from the half-decade buckets
      const recent = data.byHalf.get('recent') || 0;
      const mid = data.byHalf.get('mid') || 0;
      const old = data.byHalf.get('old') || 0;
      const older = mid + old;

      if (recent === 0 && older === 0) {
        // No health violations, keep existing trend
      } else if (recent === 0 && older > 0) {
        existing.trend = 'i'; // improving: had violations before, none recently
      } else if (recent > 0 && older === 0) {
        existing.trend = 'n'; // new: only recent violations
      } else if (recent > older) {
        existing.trend = 'w'; // worsening
      } else if (recent < older) {
        existing.trend = 'i'; // improving
      } else {
        existing.trend = 's'; // stable
      }
    }
  }

  console.log(`  Mapped PWSIDs: ${mappedPwsids.toLocaleString()}`);
  console.log(`  Unmapped PWSIDs: ${unmappedPwsids.toLocaleString()}`);
  console.log(`  ZIP codes with violations: ${zipViolations.size.toLocaleString()}\n`);

  // Step 4: Build compact output
  console.log('Building compact output...');
  const output = {};

  for (const [zip, data] of zipViolations) {
    // Sort contaminants by count, keep top 5
    const topContaminants = [...data.contaminants.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => [name, count]);

    output[zip] = {
      v: data.totalViolations,
      h: data.healthViolations,
      r: data.recentHealthViolations,
      f: data.firstDate || '',
      l: data.lastDate || '',
      c: topContaminants,
      t: data.trend,
    };
  }

  // Sort by ZIP for deterministic output
  const sorted = {};
  for (const key of Object.keys(output).sort()) {
    sorted[key] = output[key];
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, 'violations-by-zip.json');
  fs.writeFileSync(outPath, JSON.stringify(sorted), 'utf-8');

  const size = fs.statSync(outPath).size;
  console.log(`  Output: violations-by-zip.json (${(size / 1024 / 1024).toFixed(2)} MB)`);

  // Stats
  let withHealth = 0;
  let withRecent = 0;
  let improving = 0;
  let worsening = 0;
  for (const d of Object.values(sorted)) {
    if (d.h > 0) withHealth++;
    if (d.r > 0) withRecent++;
    if (d.t === 'i') improving++;
    if (d.t === 'w') worsening++;
  }

  console.log(`\n=== Summary ===`);
  console.log(`  ZIP codes with any violations: ${Object.keys(sorted).length.toLocaleString()}`);
  console.log(`  ZIP codes with health violations: ${withHealth.toLocaleString()}`);
  console.log(`  ZIP codes with recent health violations: ${withRecent.toLocaleString()}`);
  console.log(`  Trend improving: ${improving.toLocaleString()}`);
  console.log(`  Trend worsening: ${worsening.toLocaleString()}`);
  console.log('\nDone.');
}

main().catch(console.error);

/**
 * Process SDWA Geographic Areas CSV into a ZIP-to-PWSID lookup (v2).
 *
 * Input:
 *   data/raw/SDWA_GEOGRAPHIC_AREAS.csv
 *   data/raw/SDWA_PUB_WATER_SYSTEMS.csv
 *
 * Output:
 *   data/processed/zip-to-systems.json
 *
 * Run: node scripts/process-sdwa-geo2.js
 */

const fs = require('fs');
const readline = require('readline');
const path = require('path');

const RAW_DIR = path.join(__dirname, '..', 'data', 'raw');
const OUT_DIR = path.join(__dirname, '..', 'data', 'processed');

function parseCsvLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

async function loadWaterSystems() {
  console.log('Loading water systems...');
  const systems = new Map();

  const rl = readline.createInterface({
    input: fs.createReadStream(path.join(RAW_DIR, 'SDWA_PUB_WATER_SYSTEMS.csv')),
    crlfDelay: Infinity,
  });

  let headers = null;
  let count = 0;
  let active = 0;

  for await (const line of rl) {
    const fields = parseCsvLine(line);
    if (headers === null) { headers = fields; continue; }
    count++;

    const pwsid = fields[1];
    const name = fields[2];
    const activityCode = fields[7]; // A = Active
    const typeCode = fields[9]; // CWS, NTNCWS, TNCWS
    const gwSwCode = fields[12];
    const pop = parseInt(fields[15]) || 0;
    const zipCode = (fields[38] || '').trim().slice(0, 5); // System's own ZIP
    const stateCode = fields[41];

    // Only active systems
    if (activityCode !== 'A') continue;
    active++;

    const existing = systems.get(pwsid);
    if (existing && existing.pop >= pop) continue;

    systems.set(pwsid, {
      name,
      pop,
      source: gwSwCode || 'U',
      type: typeCode,
      zip: zipCode,
      state: stateCode,
    });
  }

  console.log(`  ${active} active systems, ${systems.size} unique PWSIDs from ${count} rows`);
  return systems;
}

async function processGeographicAreas(systems) {
  console.log('Processing geographic areas (ZC type only)...');
  const zipToSystems = new Map();

  const rl = readline.createInterface({
    input: fs.createReadStream(path.join(RAW_DIR, 'SDWA_GEOGRAPHIC_AREAS.csv')),
    crlfDelay: Infinity,
  });

  let headers = null;
  let zcCount = 0;

  for await (const line of rl) {
    const fields = parseCsvLine(line);
    if (headers === null) { headers = fields; continue; }

    const pwsid = fields[1];
    const areaTypeCode = fields[3];
    const zipServed = (fields[7] || '').trim();

    // Only ZC (ZIP Code) entries
    if (areaTypeCode !== 'ZC') continue;
    if (!/^\d{5}$/.test(zipServed)) continue;
    zcCount++;

    if (zipToSystems.has(zipServed)) {
      zipToSystems.get(zipServed).add(pwsid);
    } else {
      zipToSystems.set(zipServed, new Set([pwsid]));
    }
  }

  console.log(`  ${zcCount} ZC entries, ${zipToSystems.size} unique ZIPs`);

  // Also add ZIP codes from the water system records themselves
  // Many systems list their own ZIP which gives us another mapping
  console.log('Adding system self-reported ZIP codes...');
  let selfZipCount = 0;
  for (const [pwsid, sys] of systems) {
    if (sys.type !== 'CWS') continue;
    if (!/^\d{5}$/.test(sys.zip)) continue;

    if (zipToSystems.has(sys.zip)) {
      zipToSystems.get(sys.zip).add(pwsid);
    } else {
      zipToSystems.set(sys.zip, new Set([pwsid]));
      selfZipCount++;
    }
  }

  console.log(`  Added ${selfZipCount} new ZIPs from system addresses`);
  console.log(`  Total: ${zipToSystems.size} unique ZIP codes`);

  return zipToSystems;
}

async function main() {
  const systems = await loadWaterSystems();
  const zipToSystems = await processGeographicAreas(systems);

  console.log('Building output...');

  const output = {};
  let totalMappings = 0;
  let cwsOnly = 0;

  for (const [zip, pwsids] of zipToSystems) {
    const sysList = [];
    for (const pwsid of pwsids) {
      const sys = systems.get(pwsid);
      if (sys && sys.type === 'CWS') {
        sysList.push({
          id: pwsid,
          n: sys.name,
          p: sys.pop,
          s: sys.source,
        });
        cwsOnly++;
      }
    }

    if (sysList.length === 0) continue;

    // Sort by population descending, keep top 5
    sysList.sort((a, b) => b.p - a.p);
    output[zip] = sysList.slice(0, 5);
    totalMappings += Math.min(sysList.length, 5);
  }

  console.log(`  ${Object.keys(output).length} ZIP codes with CWS mappings`);
  console.log(`  ${totalMappings} total mappings`);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, 'zip-to-systems.json');
  fs.writeFileSync(outPath, JSON.stringify(output), 'utf-8');

  const size = fs.statSync(outPath).size;
  console.log(`  Output: zip-to-systems.json (${(size / 1024 / 1024).toFixed(1)} MB)`);
  console.log('Done.');
}

main().catch(console.error);

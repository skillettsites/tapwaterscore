/**
 * Process UCMR5 PFAS data into a ZIP-code-level lookup for TapWaterScore.
 *
 * Input:
 *   data/raw/UCMR5_All.txt - Full UCMR5 occurrence data
 *   data/raw/UCMR5_ZIPCodes.txt - PWSID to ZIP code mapping
 *
 * Output:
 *   data/processed/pfas-by-zip.json - ZIP code -> PFAS detection summary
 *   data/processed/pfas-by-pwsid.json - PWSID -> PFAS detection details
 *
 * Run: node scripts/process-ucmr5.js
 */

const fs = require('fs');
const readline = require('readline');
const path = require('path');

const RAW_DIR = path.join(__dirname, '..', 'data', 'raw');
const OUT_DIR = path.join(__dirname, '..', 'data', 'processed');

// EPA MCLs for regulated PFAS (parts per trillion, i.e., ng/L)
// Final rule published April 2024, effective 2029
const PFAS_MCLS = {
  'PFOA': 4.0,     // 4 ppt
  'PFOS': 4.0,     // 4 ppt
  'PFHxS': 10.0,   // 10 ppt
  'PFNA': 10.0,    // 10 ppt
  'HFPO-DA': 10.0, // GenX, 10 ppt
  // Hazard Index applies to PFHxS + PFNA + HFPO-DA + PFBS (combined)
};

// Health advisory levels for other PFAS (ppt)
const PFAS_HEALTH_ADVISORIES = {
  'PFBS': 2000,
  'PFHpA': null, // No established limit
  'PFHxA': null,
  'PFBA': null,
  'PFPeA': null,
};

// All PFAS contaminants we track
const ALL_PFAS = [
  'PFOA', 'PFOS', 'PFHxS', 'PFNA', 'HFPO-DA',
  'PFBS', 'PFBA', 'PFHxA', 'PFHpA', 'PFPeA',
  'PFDA', 'PFUnA', 'PFDoA', 'PFHpS', 'PFPeS',
  '6:2 FTS', '8:2 FTS', '4:2 FTS',
  'NFDHA', 'PFMPA', 'PFMBA', 'ADONA',
  'NMeFOSAA', 'NEtFOSAA', '9Cl-PF3ONS', '11Cl-PF3OUdS',
  'PFTA', 'PFTrDA', 'lithium',
];

async function processUCMR5() {
  console.log('Step 1: Loading PWSID -> ZIP mappings...');
  const pwsToZips = new Map();
  const zipLines = fs.readFileSync(path.join(RAW_DIR, 'UCMR5_ZIPCodes.txt'), 'utf-8').split('\n');
  for (let i = 1; i < zipLines.length; i++) {
    const parts = zipLines[i].split('\t');
    if (parts.length >= 2) {
      const pwsid = parts[0].trim();
      const zip = parts[1].trim();
      if (pwsid && zip) {
        if (pwsToZips.has(pwsid)) {
          pwsToZips.get(pwsid).add(zip);
        } else {
          pwsToZips.set(pwsid, new Set([zip]));
        }
      }
    }
  }
  console.log(`  Loaded ${pwsToZips.size} water systems with ZIP mappings`);

  console.log('Step 2: Processing UCMR5 detections...');
  // Per-PWSID: aggregate max detection level for each contaminant
  const pwsData = new Map(); // PWSID -> { name, state, contaminants: { name: { maxValue, count, unit } } }

  const rl = readline.createInterface({
    input: fs.createReadStream(path.join(RAW_DIR, 'UCMR5_All.txt')),
    crlfDelay: Infinity,
  });

  let headers = null;
  let processed = 0;
  let detections = 0;

  for await (const line of rl) {
    const fields = line.split('\t');
    if (headers === null) {
      headers = fields;
      continue;
    }
    processed++;

    const pwsid = fields[0];
    const pwsName = fields[1];
    const contaminant = fields[13];
    const units = fields[15]; // ug/L
    const sign = fields[17];
    const valueStr = fields[18];
    const state = fields[21];

    // Only count actual detections (sign '=' means detected)
    if (sign !== '=') continue;
    const value = parseFloat(valueStr);
    if (isNaN(value)) continue;

    detections++;

    // Convert ug/L to ppt (ng/L): multiply by 1000
    const valuePPT = units && units.includes('g/L') ? value * 1000 : value;

    if (pwsData.has(pwsid)) {
      const sys = pwsData.get(pwsid);
      if (sys.contaminants[contaminant]) {
        sys.contaminants[contaminant].maxValue = Math.max(sys.contaminants[contaminant].maxValue, valuePPT);
        sys.contaminants[contaminant].count++;
        sys.contaminants[contaminant].totalValue += valuePPT;
      } else {
        sys.contaminants[contaminant] = { maxValue: valuePPT, count: 1, totalValue: valuePPT };
      }
    } else {
      pwsData.set(pwsid, {
        name: pwsName,
        state: state,
        contaminants: {
          [contaminant]: { maxValue: valuePPT, count: 1, totalValue: valuePPT },
        },
      });
    }

    if (processed % 500000 === 0) {
      console.log(`  Processed ${processed} rows, ${detections} detections...`);
    }
  }

  console.log(`  Total: ${processed} rows, ${detections} detections across ${pwsData.size} water systems`);

  console.log('Step 3: Building per-PWSID summary...');
  const pfasByPwsid = {};
  for (const [pwsid, data] of pwsData) {
    // Skip lithium (not PFAS)
    const pfasContaminants = {};
    let totalPfas = 0;
    let exceedsMcl = false;
    const pfasNames = [];

    for (const [name, info] of Object.entries(data.contaminants)) {
      if (name === 'lithium') continue;
      const avg = info.totalValue / info.count;
      pfasContaminants[name] = {
        max: Math.round(info.maxValue * 1000) / 1000,
        avg: Math.round(avg * 1000) / 1000,
        samples: info.count,
      };
      totalPfas += avg;
      pfasNames.push(name);

      const mcl = PFAS_MCLS[name];
      if (mcl && info.maxValue > mcl) {
        exceedsMcl = true;
      }
    }

    if (Object.keys(pfasContaminants).length === 0) continue;

    pfasByPwsid[pwsid] = {
      name: data.name,
      state: data.state,
      pfasCount: Object.keys(pfasContaminants).length,
      totalPfasPPT: Math.round(totalPfas * 100) / 100,
      exceedsMcl,
      contaminants: pfasContaminants,
    };
  }

  console.log(`  ${Object.keys(pfasByPwsid).length} water systems with PFAS detections`);

  console.log('Step 4: Building per-ZIP summary...');
  const pfasByZip = {};

  for (const [pwsid, data] of Object.entries(pfasByPwsid)) {
    const zips = pwsToZips.get(pwsid);
    if (zips === undefined) continue;

    for (const zip of zips) {
      if (pfasByZip[zip]) {
        // Merge: use the worst-case system for this ZIP
        const existing = pfasByZip[zip];
        if (data.totalPfasPPT > existing.totalPfasPPT) {
          existing.totalPfasPPT = data.totalPfasPPT;
          existing.primaryPwsid = pwsid;
          existing.primaryName = data.name;
        }
        existing.exceedsMcl = existing.exceedsMcl || data.exceedsMcl;
        existing.pfasCount = Math.max(existing.pfasCount, data.pfasCount);

        // Merge contaminant maximums
        for (const [name, info] of Object.entries(data.contaminants)) {
          if (existing.contaminants[name]) {
            existing.contaminants[name].max = Math.max(existing.contaminants[name].max, info.max);
          } else {
            existing.contaminants[name] = { ...info };
          }
        }
        existing.systemCount++;
      } else {
        pfasByZip[zip] = {
          primaryPwsid: pwsid,
          primaryName: data.name,
          state: data.state,
          pfasCount: data.pfasCount,
          totalPfasPPT: data.totalPfasPPT,
          exceedsMcl: data.exceedsMcl,
          contaminants: { ...data.contaminants },
          systemCount: 1,
        };
      }
    }
  }

  console.log(`  ${Object.keys(pfasByZip).length} ZIP codes with PFAS data`);

  // Count exceedances
  const exceedCount = Object.values(pfasByZip).filter(z => z.exceedsMcl).length;
  console.log(`  ${exceedCount} ZIP codes with MCL exceedances`);

  console.log('Step 5: Writing output files...');
  fs.mkdirSync(OUT_DIR, { recursive: true });

  fs.writeFileSync(
    path.join(OUT_DIR, 'pfas-by-zip.json'),
    JSON.stringify(pfasByZip),
    'utf-8'
  );

  fs.writeFileSync(
    path.join(OUT_DIR, 'pfas-by-pwsid.json'),
    JSON.stringify(pfasByPwsid),
    'utf-8'
  );

  // Also create a compact version for the Next.js app (just the key data per ZIP)
  const compact = {};
  for (const [zip, data] of Object.entries(pfasByZip)) {
    // Only include the top contaminants by max level
    const topContaminants = Object.entries(data.contaminants)
      .sort((a, b) => b[1].max - a[1].max)
      .slice(0, 8)
      .map(([name, info]) => ({
        n: name,
        max: info.max,
        mcl: PFAS_MCLS[name] || null,
      }));

    compact[zip] = {
      p: data.primaryPwsid,
      n: data.primaryName,
      s: data.state,
      c: data.pfasCount,
      t: data.totalPfasPPT,
      e: data.exceedsMcl ? 1 : 0,
      d: topContaminants,
    };
  }

  fs.writeFileSync(
    path.join(OUT_DIR, 'pfas-compact.json'),
    JSON.stringify(compact),
    'utf-8'
  );

  const compactSize = fs.statSync(path.join(OUT_DIR, 'pfas-compact.json')).size;
  const fullSize = fs.statSync(path.join(OUT_DIR, 'pfas-by-zip.json')).size;
  console.log(`\nOutput files:`);
  console.log(`  pfas-by-zip.json: ${(fullSize / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  pfas-compact.json: ${(compactSize / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  pfas-by-pwsid.json: ${(fs.statSync(path.join(OUT_DIR, 'pfas-by-pwsid.json')).size / 1024 / 1024).toFixed(1)} MB`);
  console.log('\nDone.');
}

processUCMR5().catch(console.error);

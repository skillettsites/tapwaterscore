/**
 * Pre-built ZIP-to-water-system lookup from SDWA bulk data.
 *
 * Source: EPA ECHO SDWA downloads (SDWA_GEOGRAPHIC_AREAS.csv + SDWA_PUB_WATER_SYSTEMS.csv)
 * Processed by: scripts/process-sdwa-geo2.js
 *
 * Covers ~20,000 ZIP codes with direct system mappings.
 * Used as a fast first-pass lookup before falling back to API calls.
 */

import zipData from "@/data/processed/zip-to-systems.json";

interface SystemEntry {
  id: string;  // PWSID
  n: string;   // Name
  p: number;   // Population served
  s: string;   // Source type (GW, SW, GU)
}

const data = zipData as Record<string, SystemEntry[]>;

export interface ZipSystemMatch {
  pwsId: string;
  name: string;
  populationServed: number;
  sourceCode: string;
}

/**
 * Look up water systems for a ZIP code from the pre-built database.
 * Returns null if no data exists (caller should fall back to API).
 */
export function getSystemsForZip(zip: string): ZipSystemMatch[] | null {
  const systems = data[zip];
  if (!systems || systems.length === 0) return null;

  return systems.map((s) => ({
    pwsId: s.id,
    name: s.n,
    populationServed: s.p,
    sourceCode: s.s,
  }));
}

/**
 * Check if a ZIP code exists in the pre-built database.
 */
export function hasZipData(zip: string): boolean {
  return zip in data;
}

/**
 * Get the total number of ZIP codes in the database.
 */
export function getZipCount(): number {
  return Object.keys(data).length;
}

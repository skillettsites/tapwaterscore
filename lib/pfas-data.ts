/**
 * PFAS data from EPA UCMR5 bulk download.
 *
 * Source: https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule
 * Processed by: scripts/process-ucmr5.js
 *
 * Covers ~10,000 ZIP codes with PFAS testing data from UCMR5.
 * Data includes actual measured levels (not just violations).
 */

import pfasData from "@/data/processed/pfas-compact.json";

// EPA MCLs for regulated PFAS (parts per trillion)
// Final PFAS rule published April 2024, compliance deadline 2029
export const PFAS_MCLS: Record<string, number> = {
  PFOA: 4.0,
  PFOS: 4.0,
  PFHxS: 10.0,
  PFNA: 10.0,
  "HFPO-DA": 10.0, // GenX
};

export interface PfasContaminant {
  name: string;
  maxPPT: number;
  mclPPT: number | null;
  exceedsMcl: boolean;
}

export interface PfasReport {
  detected: boolean;
  primarySystemId: string;
  primarySystemName: string;
  state: string;
  pfasCount: number;
  totalPfasPPT: number;
  exceedsMcl: boolean;
  contaminants: PfasContaminant[];
}

interface CompactEntry {
  p: string; // primaryPwsid
  n: string; // primaryName
  s: string; // state
  c: number; // pfasCount
  t: number; // totalPfasPPT
  e: number; // exceedsMcl (0 or 1)
  d: Array<{ n: string; max: number; mcl: number | null }>;
}

const data = pfasData as Record<string, CompactEntry>;

/**
 * Get PFAS data for a ZIP code from the UCMR5 bulk dataset.
 * Returns null if no PFAS testing data exists for this ZIP.
 */
export function getPfasData(zip: string): PfasReport | null {
  const entry = data[zip];
  if (!entry) return null;

  return {
    detected: true,
    primarySystemId: entry.p,
    primarySystemName: entry.n,
    state: entry.s,
    pfasCount: entry.c,
    totalPfasPPT: entry.t,
    exceedsMcl: entry.e === 1,
    contaminants: entry.d.map((c) => ({
      name: c.n,
      maxPPT: c.max,
      mclPPT: c.mcl,
      exceedsMcl: c.mcl !== null && c.max > c.mcl,
    })),
  };
}

/**
 * Check if PFAS data exists for a ZIP code (without loading full details).
 */
export function hasPfasData(zip: string): boolean {
  return zip in data;
}

/**
 * Get the total number of ZIP codes with PFAS data.
 */
export function getPfasZipCount(): number {
  return Object.keys(data).length;
}

/**
 * Get the number of ZIP codes with MCL exceedances.
 */
export function getPfasExceedanceCount(): number {
  return Object.values(data).filter((d) => d.e === 1).length;
}

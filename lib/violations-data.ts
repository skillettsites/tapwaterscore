/**
 * Historical violation data from SDWA bulk download.
 *
 * Source: EPA ECHO SDWA downloads (SDWA_VIOLATIONS_ENFORCEMENT.csv)
 * Processed by: scripts/process-violations.js
 *
 * Provides 10+ years of violation history per ZIP code, grouped by water system.
 * This supplements the ECHO DFR API which only returns ~5 years of data.
 */

import violationsData from "@/data/processed/violations-by-zip.json";

interface CompactViolationEntry {
  v: number;   // total violations
  h: number;   // health-based violations (MCL, MRDL, TT)
  r: number;   // recent health violations (last 3 years)
  f: string;   // first violation date (YYYY-MM)
  l: string;   // last violation date (YYYY-MM)
  c: Array<[string, number]>; // top contaminants: [[name, count], ...]
  t: string;   // trend: "i" (improving), "w" (worsening), "s" (stable), "n" (new)
}

const data = violationsData as unknown as Record<string, CompactViolationEntry>;

export type ViolationTrend = "improving" | "worsening" | "stable" | "new" | "none";

export interface ViolationHistory {
  totalViolations: number;
  healthViolations: number;
  recentHealthViolations: number;
  firstViolationDate: string;
  lastViolationDate: string;
  yearsCovered: number;
  topContaminants: Array<{ name: string; count: number }>;
  trend: ViolationTrend;
  trendLabel: string;
}

const TREND_MAP: Record<string, ViolationTrend> = {
  i: "improving",
  w: "worsening",
  s: "stable",
  n: "new",
};

const TREND_LABELS: Record<ViolationTrend, string> = {
  improving: "Fewer violations in recent years",
  worsening: "More violations in recent years",
  stable: "Consistent violation rate",
  new: "Violations only in recent years",
  none: "No violation history",
};

/**
 * Get historical violation data for a ZIP code.
 * Returns null if no violation data exists for this ZIP.
 */
export function getViolationsForZip(zip: string): ViolationHistory | null {
  const entry = data[zip];
  if (!entry) return null;

  const trend = TREND_MAP[entry.t] || "stable";
  const firstYear = entry.f ? parseInt(entry.f.slice(0, 4)) : null;
  const lastYear = entry.l ? parseInt(entry.l.slice(0, 4)) : null;
  const yearsCovered = firstYear && lastYear ? lastYear - firstYear + 1 : 0;

  return {
    totalViolations: entry.v,
    healthViolations: entry.h,
    recentHealthViolations: entry.r,
    firstViolationDate: entry.f,
    lastViolationDate: entry.l,
    yearsCovered,
    topContaminants: entry.c.map(([name, count]) => ({ name, count })),
    trend,
    trendLabel: TREND_LABELS[trend],
  };
}

/**
 * Check if historical violation data exists for a ZIP code.
 */
export function hasViolationData(zip: string): boolean {
  return zip in data;
}

/**
 * Get the total number of ZIP codes with violation data.
 */
export function getViolationZipCount(): number {
  return Object.keys(data).length;
}

/**
 * Get the number of ZIP codes with health-based violations.
 */
export function getHealthViolationZipCount(): number {
  return Object.values(data).filter((d) => d.h > 0).length;
}

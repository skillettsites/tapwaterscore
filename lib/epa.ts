/**
 * EPA Water Quality Data Client
 *
 * Uses three data sources:
 *
 * 1. EPA Envirofacts SDWIS API (ZIP to water system mapping)
 *    Base: https://data.epa.gov/efservice/
 *    No API key. Free. Public domain.
 *
 * 2. EPA ECHO DFR (Detailed Facility Report) API (violations, lead/copper, system details)
 *    Base: https://echodata.epa.gov/echo/
 *    No API key. Free. Covers ALL US water systems (not just EPA direct-primacy).
 *    This is the primary data source for violations and contaminant data.
 *
 * 3. EPA UCMR5 Bulk Data (PFAS levels from actual lab measurements)
 *    Processed from: https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule
 *    Pre-processed into data/processed/pfas-compact.json by scripts/process-ucmr5.js
 *    Covers ~10,000 ZIP codes with actual PFAS measurement data.
 *
 * ZIP mapping note: The Envirofacts GEOGRAPHIC_AREA table is sparsely populated
 * for state-primacy systems. As a fallback, we also search ECHO by city+state
 * using a ZIP-to-city lookup.
 */

import { getPfasData, type PfasReport } from "./pfas-data";
import { getSystemsForZip } from "./zip-systems";

const ENVIROFACTS_BASE = "https://data.epa.gov/efservice";
const ECHO_BASE = "https://echodata.epa.gov/echo";

// ── ZIP to Water System Mapping ──

interface EpaGeographicArea {
  PWSID: string;
  GEO_ID: string;
  PWS_NAME?: string;
  AREA_TYPE_CODE: string;
  STATE_CODE: string;
  ZIP_CODE_SERVED?: string;
  CITY_SERVED?: string;
  COUNTY_SERVED?: string;
}

interface EpaWaterSystem {
  PWSID: string;
  PWS_NAME: string;
  STATE_CODE: string;
  COUNTY_SERVED?: string;
  CITY_SERVED?: string;
  POPULATION_SERVED_COUNT: number;
  PRIMARY_SOURCE_CODE: string;
  GW_SW_CODE: string;
  PWS_TYPE_CODE: string;
  PWS_ACTIVITY_CODE?: string;
}

async function fetchJson<T>(url: string, revalidate = 86400): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) {
      console.error(`API error: ${res.status} for ${url}`);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error(`Fetch error for ${url}:`, e);
    return null;
  }
}

async function fetchArray<T>(url: string): Promise<T[]> {
  const data = await fetchJson<T[]>(url);
  return Array.isArray(data) ? data : [];
}

/**
 * Find water systems serving a ZIP code using Envirofacts GEOGRAPHIC_AREA table
 */
async function getSystemsByZipEnvirofacts(zip: string): Promise<EpaWaterSystem[]> {
  const areas = await fetchArray<EpaGeographicArea>(
    `${ENVIROFACTS_BASE}/GEOGRAPHIC_AREA/AREA_TYPE_CODE/ZC/GEO_ID/${zip}/JSON`
  );

  // Also try the ZIP field directly
  if (areas.length === 0) {
    const areas2 = await fetchArray<EpaGeographicArea>(
      `${ENVIROFACTS_BASE}/GEOGRAPHIC_AREA/ZIP_CODE_SERVED/${zip}/JSON`
    );
    areas.push(...areas2);
  }

  if (areas.length === 0) return [];

  const pwsIds = [...new Set(areas.map((a) => a.PWSID))];
  const systems: EpaWaterSystem[] = [];

  for (const pwsId of pwsIds.slice(0, 10)) {
    const results = await fetchArray<EpaWaterSystem>(
      `${ENVIROFACTS_BASE}/WATER_SYSTEM/PWSID/${pwsId}/JSON`
    );
    systems.push(...results);
  }

  return systems.filter(
    (s) => s.PWS_TYPE_CODE === "CWS" || s.PWS_ACTIVITY_CODE === "A" || systems.length <= 1
  );
}

interface EchoSystemResult {
  PWSId: string;
  PWSName: string;
  StateCode: string;
  CountiesServed: string;
  PopulationServedCount: string;
  PrimarySourceCode: string;
  GwSwCode: string;
  PWSTypeCode: string;
  PWSActivityCode: string;
}

/**
 * Find water systems via ECHO search by city+state
 * This covers state-primacy systems that Envirofacts misses
 * Returns full system info directly from ECHO (no need to re-fetch from Envirofacts)
 */
async function getSystemsByEchoSearch(city: string, state: string): Promise<EchoSystemResult[]> {
  const url = `${ECHO_BASE}/sdw_rest_services.get_systems?output=JSON&p_ct=${encodeURIComponent(city)}&p_st=${state}&p_act=Y`;
  const data = await fetchJson<{ Results?: { QueryID?: string; QueryRows?: string } }>(url);

  if (!data?.Results?.QueryID || data.Results.QueryRows === "0") return [];

  const qid = data.Results.QueryID;
  const qidUrl = `${ECHO_BASE}/sdw_rest_services.get_qid?qid=${qid}&output=JSON`;
  const qidData = await fetchJson<{
    Results?: { WaterSystems?: EchoSystemResult[] };
  }>(qidUrl);

  return qidData?.Results?.WaterSystems || [];
}

// ── ECHO DFR Endpoints (Rich Data) ──

interface EchoViolation {
  ViolationID: string;
  ContaminantName: string;
  ContaminantCode: string;
  ViolationCategoryCode: string;
  ViolationCategoryDesc: string;
  IsHealthBased: string;
  ViolationMeasure: string;
  UnitOfMeasure: string;
  StateMCL: string;
  FederalMCL: string;
  CompliancePeriodBeginDate: string;
  CompliancePeriodEndDate: string;
  Status: string;
  ResolvedDate: string;
  EnforcementActions?: Array<{
    EnforcementDate: string;
    EnforcementActionTypeDesc: string;
  }>;
}

interface EchoLeadCopper {
  PB90Value: string;
  PB90Units: string;
  PB90Dates: string;
  CU90Value: string;
  CU90Units: string;
  CU90Dates: string;
  PbALE: string;
  CuALE: string;
}

/**
 * Get violations from ECHO DFR (much richer than Envirofacts)
 */
async function getEchoViolations(pwsId: string): Promise<EchoViolation[]> {
  const url = `${ECHO_BASE}/dfr_rest_services.get_sdwa_violations?p_id=${pwsId}&output=JSON`;
  const data = await fetchJson<{
    Results?: {
      SDWAViolations?: {
        Sources?: Array<{
          Violations?: EchoViolation[];
        }>;
      };
    };
  }>(url);

  const sources = data?.Results?.SDWAViolations?.Sources || [];
  const violations: EchoViolation[] = [];
  for (const source of sources) {
    if (source.Violations) {
      violations.push(...source.Violations);
    }
  }
  return violations;
}

/**
 * Get lead and copper data from ECHO DFR
 */
async function getEchoLeadCopper(pwsId: string): Promise<EchoLeadCopper | null> {
  const url = `${ECHO_BASE}/dfr_rest_services.get_sdwa_lead_and_copper?p_id=${pwsId}&output=JSON`;
  const data = await fetchJson<{
    Results?: {
      LeadAndCopper?: {
        Sources?: Array<{
          LeadSamples?: Array<{ PB90Value?: string; PB90Units?: string; PB90Dates?: string }>;
          CopperSamples?: Array<{ CU90Value?: string; CU90Units?: string; CU90Dates?: string }>;
          PbALE?: string;
          CuALE?: string;
        }>;
      };
    };
  }>(url);

  const sources = data?.Results?.LeadAndCopper?.Sources || [];
  if (sources.length === 0) return null;

  const source = sources[0];
  const leadSample = source.LeadSamples?.[0];
  const copperSample = source.CopperSamples?.[0];

  return {
    PB90Value: leadSample?.PB90Value || "",
    PB90Units: leadSample?.PB90Units || "mg/L",
    PB90Dates: leadSample?.PB90Dates || "",
    CU90Value: copperSample?.CU90Value || "",
    CU90Units: copperSample?.CU90Units || "mg/L",
    CU90Dates: copperSample?.CU90Dates || "",
    PbALE: source.PbALE || "0.015",
    CuALE: source.CuALE || "1.3",
  };
}

// ── ZIP-to-City mapping (simple built-in for common ZIPs) ──
// TODO: Replace with a proper ZIP-to-city database or API

async function zipToCity(zip: string): Promise<{ city: string; state: string } | null> {
  // Zippopotam.us: free, no API key, reliable ZIP-to-city lookup
  const url = `https://api.zippopotam.us/us/${zip}`;

  try {
    const res = await fetch(url, { next: { revalidate: 604800 } }); // Cache 7 days
    if (!res.ok) return null;
    const data = await res.json();
    const place = data?.places?.[0];
    if (place?.["place name"] && place?.["state abbreviation"]) {
      return { city: place["place name"], state: place["state abbreviation"] };
    }
  } catch {
    // Fallback silently
  }

  return null;
}

// ── Main Report Builder ──

export interface WaterReportData {
  systems: Array<{
    pwsId: string;
    name: string;
    state: string;
    county: string;
    populationServed: number;
    sourceType: string;
  }>;
  primarySystem: {
    pwsId: string;
    name: string;
    state: string;
    county: string;
    populationServed: number;
    sourceType: string;
  } | null;
  violations: Array<{
    violationId: string;
    contaminantName: string;
    contaminantCode: string;
    category: string;
    categoryDesc: string;
    isHealthBased: boolean;
    measure: string;
    unit: string;
    stateMcl: string;
    federalMcl: string;
    periodBegin: string;
    periodEnd: string;
    status: string;
  }>;
  leadCopper: {
    lead90th: number | null;
    leadUnit: string;
    leadDate: string;
    leadActionLevel: number;
    leadExceeds: boolean;
    copper90th: number | null;
    copperUnit: string;
    copperDate: string;
    copperActionLevel: number;
    copperExceeds: boolean;
  } | null;
  grade: "A" | "B" | "C" | "D" | "F";
  gradeScore: number;
  violationCount: number;
  healthViolationCount: number;
  recentHealthViolationCount: number;
  topConcerns: Array<{
    name: string;
    violationCount: number;
    isHealthBased: boolean;
    category: string;
  }>;
  hasPfas: boolean;
  hasLead: boolean;
  pfasReport: PfasReport | null;
  zipCode: string;
  lastUpdated: string;
}

export async function getWaterReport(zip: string): Promise<WaterReportData | null> {
  // Step 1: Try pre-built bulk data first (instant, no API calls)
  const bulkSystems = getSystemsForZip(zip);
  let systems: EpaWaterSystem[] = [];

  if (bulkSystems && bulkSystems.length > 0) {
    // Use bulk data as primary source
    for (const bs of bulkSystems) {
      systems.push({
        PWSID: bs.pwsId,
        PWS_NAME: bs.name,
        STATE_CODE: bs.pwsId.slice(0, 2), // First 2 chars of PWSID are state FIPS
        COUNTY_SERVED: "",
        POPULATION_SERVED_COUNT: bs.populationServed,
        PRIMARY_SOURCE_CODE: bs.sourceCode,
        GW_SW_CODE: bs.sourceCode,
        PWS_TYPE_CODE: "CWS",
        PWS_ACTIVITY_CODE: "A",
        CITY_SERVED: "",
      });
    }
  }

  // Step 2: If bulk data has no results, fall back to Envirofacts API
  if (systems.length === 0) {
    systems = await getSystemsByZipEnvirofacts(zip);
  }

  // Step 3: If Envirofacts also returns nothing (common for state-primacy), try ECHO via city
  if (systems.length === 0) {
    const location = await zipToCity(zip);
    if (location) {
      const echoSystems = await getSystemsByEchoSearch(location.city, location.state);
      // Convert ECHO results to our internal format
      for (const es of echoSystems.slice(0, 10)) {
        systems.push({
          PWSID: es.PWSId,
          PWS_NAME: es.PWSName,
          STATE_CODE: es.StateCode,
          COUNTY_SERVED: es.CountiesServed,
          POPULATION_SERVED_COUNT: parseInt(es.PopulationServedCount) || 0,
          PRIMARY_SOURCE_CODE: es.PrimarySourceCode,
          GW_SW_CODE: es.GwSwCode,
          PWS_TYPE_CODE: es.PWSTypeCode,
          PWS_ACTIVITY_CODE: es.PWSActivityCode,
        });
      }
    }
  }

  if (systems.length === 0) {
    return null;
  }

  // Use the largest community water system as the primary
  const cwsSystems = systems.filter((s) => s.PWS_TYPE_CODE === "CWS");
  const pool = cwsSystems.length > 0 ? cwsSystems : systems;
  const primary = pool.reduce((best, sys) =>
    (sys.POPULATION_SERVED_COUNT || 0) > (best.POPULATION_SERVED_COUNT || 0) ? sys : best
  );

  // Step 3: Get violations from ECHO DFR (richer data than Envirofacts)
  const echoViolations = await getEchoViolations(primary.PWSID);

  const violations = echoViolations.map((v) => ({
    violationId: v.ViolationID,
    contaminantName: v.ContaminantName || getContaminantName(v.ContaminantCode),
    contaminantCode: v.ContaminantCode,
    category: v.ViolationCategoryCode,
    categoryDesc: v.ViolationCategoryDesc || formatViolationCategory(v.ViolationCategoryCode),
    isHealthBased: v.IsHealthBased === "Y" || v.IsHealthBased === "Yes",
    measure: v.ViolationMeasure,
    unit: v.UnitOfMeasure,
    stateMcl: v.StateMCL,
    federalMcl: v.FederalMCL,
    periodBegin: v.CompliancePeriodBeginDate,
    periodEnd: v.CompliancePeriodEndDate,
    status: v.Status,
  }));

  // Step 4: Get lead and copper data
  const lcData = await getEchoLeadCopper(primary.PWSID);
  let leadCopper = null;
  if (lcData) {
    const lead90 = parseFloat(lcData.PB90Value);
    const copper90 = parseFloat(lcData.CU90Value);
    const leadAL = parseFloat(lcData.PbALE) || 0.015;
    const copperAL = parseFloat(lcData.CuALE) || 1.3;

    leadCopper = {
      lead90th: isNaN(lead90) ? null : lead90,
      leadUnit: lcData.PB90Units || "mg/L",
      leadDate: lcData.PB90Dates,
      leadActionLevel: leadAL,
      leadExceeds: !isNaN(lead90) && lead90 > leadAL,
      copper90th: isNaN(copper90) ? null : copper90,
      copperUnit: lcData.CU90Units || "mg/L",
      copperDate: lcData.CU90Dates,
      copperActionLevel: copperAL,
      copperExceeds: !isNaN(copper90) && copper90 > copperAL,
    };
  }

  // Step 5: Get PFAS data from UCMR5 bulk dataset
  const pfasReport = getPfasData(zip);

  // Step 6: Calculate grade
  const healthViolations = violations.filter((v) => v.isHealthBased);
  const currentYear = new Date().getFullYear();
  const recentViolations = violations.filter((v) => {
    const year = parseInt(v.periodEnd?.slice(0, 4) || "0");
    return year >= currentYear - 5;
  });
  const recentHealthViolations = recentViolations.filter((v) => v.isHealthBased);

  let score = 100;
  score -= recentHealthViolations.length * 15;
  score -= (healthViolations.length - recentHealthViolations.length) * 5;
  score -= (recentViolations.length - recentHealthViolations.length) * 3;
  score -= (violations.length - recentViolations.length) * 1;

  // Lead/copper exceedances
  if (leadCopper?.leadExceeds) score -= 20;
  if (leadCopper?.copperExceeds) score -= 10;

  // PFAS exceedances from UCMR5 lab data
  if (pfasReport?.exceedsMcl) score -= 10;

  score = Math.max(0, Math.min(100, score));

  const grade = score >= 90 ? "A" as const
    : score >= 75 ? "B" as const
    : score >= 55 ? "C" as const
    : score >= 35 ? "D" as const
    : "F" as const;

  // Top concerns by contaminant
  const contaminantMap = new Map<string, { count: number; isHealthBased: boolean; category: string }>();
  for (const v of violations) {
    const name = v.contaminantName;
    const existing = contaminantMap.get(name);
    if (existing) {
      existing.count++;
      if (v.isHealthBased) existing.isHealthBased = true;
    } else {
      contaminantMap.set(name, { count: 1, isHealthBased: v.isHealthBased, category: v.categoryDesc });
    }
  }

  const topConcerns = [...contaminantMap.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([name, data]) => ({
      name,
      violationCount: data.count,
      isHealthBased: data.isHealthBased,
      category: data.category,
    }));

  // PFAS check: use UCMR5 data (actual measurements) or violation records
  const pfasTerms = ["PFOA", "PFOS", "PFAS", "GenX", "PFBS", "PFHxS", "PFNA", "PFDA"];
  const hasPfasViolation = violations.some((v) =>
    pfasTerms.some((term) => v.contaminantName.toUpperCase().includes(term))
  );
  const hasPfas = hasPfasViolation || (pfasReport !== null && pfasReport.detected);

  // Lead check
  const hasLead = (leadCopper?.lead90th != null && leadCopper.lead90th > 0) ||
    violations.some((v) => v.contaminantName.toLowerCase().includes("lead"));

  const mapSystem = (s: EpaWaterSystem) => ({
    pwsId: s.PWSID,
    name: s.PWS_NAME,
    state: s.STATE_CODE,
    county: s.COUNTY_SERVED || "",
    populationServed: s.POPULATION_SERVED_COUNT || 0,
    sourceType: s.GW_SW_CODE === "GW" ? "Ground water"
      : s.GW_SW_CODE === "SW" ? "Surface water"
      : s.GW_SW_CODE === "GU" ? "Ground water under influence"
      : s.GW_SW_CODE || "Unknown",
  });

  return {
    systems: systems.map(mapSystem),
    primarySystem: mapSystem(primary),
    violations,
    leadCopper,
    grade,
    gradeScore: score,
    violationCount: violations.length,
    healthViolationCount: healthViolations.length,
    recentHealthViolationCount: recentHealthViolations.length,
    topConcerns,
    hasPfas,
    hasLead,
    pfasReport,
    zipCode: zip,
    lastUpdated: new Date().toISOString().slice(0, 10),
  };
}

// ── Helpers ──

function getContaminantName(code: string): string {
  const names: Record<string, string> = {
    "1005": "Barium",
    "1010": "Cadmium",
    "1015": "Chromium",
    "1020": "Fluoride",
    "1024": "Cyanide",
    "1025": "Lead",
    "1030": "Mercury",
    "1035": "Nitrate",
    "1036": "Nitrite",
    "1038": "Nitrate-Nitrite",
    "1040": "Selenium",
    "1045": "Silver",
    "1074": "Antimony",
    "1075": "Beryllium",
    "1085": "Thallium",
    "1094": "Copper",
    "2039": "Arsenic",
    "2050": "Atrazine",
    "2456": "Total Trihalomethanes",
    "2950": "Total Haloacetic Acids",
    "2964": "Combined Radium",
    "2965": "Gross Alpha",
    "2968": "Uranium",
    "2984": "Total Coliform",
    "3014": "E. coli",
    "3100": "Turbidity",
    "7000": "PFOA",
    "7001": "PFOS",
    "7500": "GenX",
  };
  return names[code] || `Contaminant ${code}`;
}

function formatViolationCategory(code: string): string {
  const categories: Record<string, string> = {
    MCL: "Maximum Contaminant Level",
    MRDL: "Maximum Residual Disinfectant Level",
    TT: "Treatment Technique",
    MON: "Monitoring",
    RPT: "Reporting",
    MR: "Monitoring & Reporting",
    Other: "Other",
  };
  return categories[code] || code;
}

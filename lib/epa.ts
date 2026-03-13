/**
 * EPA Envirofacts SDWIS API client
 *
 * Base URL: https://data.epa.gov/efservice/
 * No API key required. Free. No authentication.
 *
 * Tables we use:
 * - WATER_SYSTEM: info about each public water system
 * - GEOGRAPHIC_AREA: ZIP code to water system mapping
 * - VIOLATION: violation records
 * - LCR_SAMPLE_RESULT: Lead and Copper Rule sample results
 *
 * Format: append /JSON to get JSON response
 * Filtering: /column/value/ in the URL path
 * Pagination: /rows/start:end
 */

const EPA_BASE = "https://data.epa.gov/efservice";

interface EpaWaterSystem {
  PWSID: string;
  PWS_NAME: string;
  PRIMACY_AGENCY_CODE: string;
  EPA_REGION: string;
  PWS_TYPE_CODE: string;
  POPULATION_SERVED_COUNT: number;
  PRIMARY_SOURCE_CODE: string;
  GW_SW_CODE: string;
  STATE_CODE: string;
  COUNTY_SERVED?: string;
  CITY_SERVED?: string;
  ZIP_CODE?: string;
}

interface EpaGeographicArea {
  PWSID: string;
  GEO_ID: string;
  PWS_NAME?: string;
  AREA_TYPE_CODE: string;
  STATE_CODE: string;
  ANSI_ENTITY_CODE?: string;
}

interface EpaViolation {
  PWSID: string;
  VIOLATION_ID: string;
  CONTAMINANT_CODE: string;
  CONTAMINANT_NAME?: string;
  VIOLATION_TYPE_CODE: string;
  COMPLIANCE_PERIOD_BEGIN_DATE: string;
  COMPLIANCE_PERIOD_END_DATE: string;
  IS_HEALTH_BASED_IND: string;
  VIOLATION_CATEGORY_CODE?: string;
  ENFORCEMENT_ACTION?: string;
}

async function epaFetch<T>(path: string): Promise<T[]> {
  const url = `${EPA_BASE}${path}/JSON`;
  const res = await fetch(url, {
    next: { revalidate: 86400 }, // Cache for 24 hours
  });

  if (!res.ok) {
    console.error(`EPA API error: ${res.status} for ${url}`);
    return [];
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

/**
 * Find water systems serving a ZIP code
 */
export async function getWaterSystemsByZip(zip: string): Promise<EpaWaterSystem[]> {
  // GEOGRAPHIC_AREA table maps ZIP codes to water system IDs
  const areas = await epaFetch<EpaGeographicArea>(
    `/GEOGRAPHIC_AREA/AREA_TYPE_CODE/Z/GEO_ID/${zip}`
  );

  if (areas.length === 0) return [];

  // Get unique PWS IDs
  const pwsIds = [...new Set(areas.map((a) => a.PWSID))];

  // Fetch details for each water system
  const systems: EpaWaterSystem[] = [];
  for (const pwsId of pwsIds.slice(0, 10)) {
    const results = await epaFetch<EpaWaterSystem>(
      `/WATER_SYSTEM/PWSID/${pwsId}`
    );
    systems.push(...results);
  }

  // Filter to active community water systems
  return systems.filter(
    (s) => s.PWS_TYPE_CODE === "CWS" || systems.length <= 1
  );
}

/**
 * Get violations for a water system
 */
export async function getViolations(pwsId: string): Promise<EpaViolation[]> {
  return epaFetch<EpaViolation>(
    `/VIOLATION/PWSID/${pwsId}/rows/0:100`
  );
}

/**
 * Get all violations for a water system, returns mapped violations
 */
export async function getSystemViolations(pwsId: string) {
  const raw = await getViolations(pwsId);

  return raw.map((v) => ({
    violationId: v.VIOLATION_ID,
    pwsId: v.PWSID,
    contaminantCode: v.CONTAMINANT_CODE,
    contaminantName: v.CONTAMINANT_NAME || getContaminantName(v.CONTAMINANT_CODE),
    violationType: v.VIOLATION_TYPE_CODE,
    compliancePeriodBegin: v.COMPLIANCE_PERIOD_BEGIN_DATE,
    compliancePeriodEnd: v.COMPLIANCE_PERIOD_END_DATE,
    isHealthBased: v.IS_HEALTH_BASED_IND === "Y",
    enforcementAction: v.ENFORCEMENT_ACTION,
  }));
}

/**
 * Build a complete water report for a ZIP code
 */
export async function getWaterReport(zip: string) {
  const systems = await getWaterSystemsByZip(zip);

  if (systems.length === 0) {
    return null;
  }

  // Use the largest system (most people served) as the primary
  const primary = systems.reduce((best, sys) =>
    (sys.POPULATION_SERVED_COUNT || 0) > (best.POPULATION_SERVED_COUNT || 0) ? sys : best
  );

  // Get violations for the primary system
  const violations = await getSystemViolations(primary.PWSID);

  // Calculate grade
  const healthViolations = violations.filter((v) => v.isHealthBased);
  const recentViolations = violations.filter((v) => {
    const year = parseInt(v.compliancePeriodEnd?.slice(0, 4) || "0");
    return year >= new Date().getFullYear() - 5;
  });
  const recentHealthViolations = recentViolations.filter((v) => v.isHealthBased);

  let score = 100;
  // Deduct for health violations (recent are worse)
  score -= recentHealthViolations.length * 15;
  score -= (healthViolations.length - recentHealthViolations.length) * 5;
  // Deduct for other violations
  score -= (recentViolations.length - recentHealthViolations.length) * 3;
  score -= (violations.length - recentViolations.length) * 1;
  // Floor at 0
  score = Math.max(0, Math.min(100, score));

  const grade = score >= 90 ? "A" as const
    : score >= 75 ? "B" as const
    : score >= 55 ? "C" as const
    : score >= 35 ? "D" as const
    : "F" as const;

  // Group violations by contaminant to find top concerns
  const contaminantCounts = new Map<string, number>();
  for (const v of violations) {
    const name = v.contaminantName || v.contaminantCode;
    contaminantCounts.set(name, (contaminantCounts.get(name) || 0) + 1);
  }

  const topConcerns = [...contaminantCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      violationCount: count,
      isHealthBased: violations.some(
        (v) => (v.contaminantName || v.contaminantCode) === name && v.isHealthBased
      ),
    }));

  // Check for PFAS-related violations
  const pfasTerms = ["PFOA", "PFOS", "PFAS", "GenX", "PFBS", "PFHxS", "PFNA", "PFDA"];
  const pfasViolations = violations.filter((v) =>
    pfasTerms.some((term) =>
      (v.contaminantName || "").toUpperCase().includes(term)
    )
  );

  return {
    systems: systems.map((s) => ({
      pwsId: s.PWSID,
      name: s.PWS_NAME,
      state: s.STATE_CODE,
      county: s.COUNTY_SERVED || "",
      populationServed: s.POPULATION_SERVED_COUNT || 0,
      sourceType: s.GW_SW_CODE === "GW" ? "Ground water"
        : s.GW_SW_CODE === "SW" ? "Surface water"
        : s.GW_SW_CODE === "GU" ? "Ground water under influence"
        : s.GW_SW_CODE || "Unknown",
      primarySource: s.PRIMARY_SOURCE_CODE || "",
    })),
    primarySystem: {
      pwsId: primary.PWSID,
      name: primary.PWS_NAME,
      state: primary.STATE_CODE,
      county: primary.COUNTY_SERVED || "",
      populationServed: primary.POPULATION_SERVED_COUNT || 0,
      sourceType: primary.GW_SW_CODE === "GW" ? "Ground water"
        : primary.GW_SW_CODE === "SW" ? "Surface water"
        : primary.GW_SW_CODE === "GU" ? "Ground water under influence"
        : primary.GW_SW_CODE || "Unknown",
      primarySource: primary.PRIMARY_SOURCE_CODE || "",
    },
    violations,
    grade,
    gradeScore: score,
    violationCount: violations.length,
    healthViolationCount: healthViolations.length,
    topConcerns,
    hasPfas: pfasViolations.length > 0,
    pfasViolations,
    zipCode: zip,
    lastUpdated: new Date().toISOString().slice(0, 10),
  };
}

// Common contaminant code to name mapping
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

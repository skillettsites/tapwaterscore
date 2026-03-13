export interface WaterSystem {
  pwsId: string;
  name: string;
  state: string;
  county: string;
  populationServed: number;
  sourceType: string; // "Ground water" | "Surface water" | "Ground water under influence"
  primarySource: string;
}

export interface Violation {
  violationId: string;
  pwsId: string;
  contaminantCode: string;
  contaminantName: string;
  violationType: string;
  compliancePeriodBegin: string;
  compliancePeriodEnd: string;
  enforcementAction?: string;
  isHealthBased: boolean;
}

export interface Contaminant {
  code: string;
  name: string;
  level: number | null;
  unit: string;
  mcl: number | null; // EPA Maximum Contaminant Level (legal limit)
  mclg: number | null; // EPA Maximum Contaminant Level Goal (health goal)
  healthGuideline: number | null; // Stricter health-based guideline
  exceedsMcl: boolean;
  exceedsHealthGuideline: boolean;
  category: ContaminantCategory;
  healthEffects: string;
  sources: string;
  filterTypes: string[];
}

export type ContaminantCategory =
  | "pfas"
  | "heavy_metals"
  | "disinfection_byproducts"
  | "pesticides"
  | "radioactive"
  | "microorganisms"
  | "inorganic"
  | "organic"
  | "other";

export type WaterGrade = "A" | "B" | "C" | "D" | "F";

export interface WaterReport {
  systems: WaterSystem[];
  primarySystem: WaterSystem | null;
  contaminants: Contaminant[];
  violations: Violation[];
  grade: WaterGrade;
  gradeScore: number; // 0-100
  violationCount: number;
  healthViolationCount: number;
  topConcerns: Contaminant[];
  hasPfas: boolean;
  pfasContaminants: Contaminant[];
  zipCode: string;
  stateAvgScore: number | null;
  nationalAvgScore: number | null;
  lastUpdated: string;
}

export interface GradeInfo {
  grade: WaterGrade;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export const GRADE_INFO: Record<WaterGrade, GradeInfo> = {
  A: {
    grade: "A",
    label: "Excellent",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    description: "No violations and all contaminants well below health guidelines.",
  },
  B: {
    grade: "B",
    label: "Good",
    color: "text-teal-700",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    description: "Minor issues detected but within safe limits.",
  },
  C: {
    grade: "C",
    label: "Fair",
    color: "text-yellow-700",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    description: "Some contaminants near or above health guidelines. Consider filtration.",
  },
  D: {
    grade: "D",
    label: "Poor",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    description: "Multiple contaminants above health guidelines or recent violations.",
  },
  F: {
    grade: "F",
    label: "Failing",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    description: "Serious health-based violations or contaminants well above safe levels.",
  },
};

export type ColorSpace = "RGB" | "CMYK" | "LAB" | "SPOT";

export interface PantoneReference {
  system: "PMS" | "Pantone Solid Coated" | "Pantone Solid Uncoated" | "Pantone Matching System";
  code: string;
  name?: string;
}

export interface CmykValue {
  c: number;
  m: number;
  y: number;
  k: number;
}

export interface RgbValue {
  r: number;
  g: number;
  b: number;
}

export interface SpotColorDefinition {
  name: string;
  pantone?: PantoneReference;
  fallbackCmyk?: CmykValue;
  fallbackRgb?: RgbValue;
  preserveAsSpot: boolean;
}

export interface ProductionColorProfile {
  id: string;
  clientId: string;
  projectId?: string;
  name: string;
  primarySpace: ColorSpace;
  iccProfile?: string;
  outputCondition?: string;
  processColors?: {
    cmyk?: CmykValue;
    rgb?: RgbValue;
  };
  spotColors: SpotColorDefinition[];
  notes?: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface PreflightColorIssue {
  severity: "info" | "warning" | "error";
  code:
    | "RGB_IN_PRINT_JOB"
    | "SPOT_CONVERTED_TO_PROCESS"
    | "MISSING_ICC_PROFILE"
    | "UNAPPROVED_PANTONE"
    | "MISSING_OUTPUT_CONDITION";
  message: string;
}

export function runColorPreflight(profile: ProductionColorProfile): PreflightColorIssue[] {
  const issues: PreflightColorIssue[] = [];

  if (!profile.iccProfile) {
    issues.push({
      severity: "warning",
      code: "MISSING_ICC_PROFILE",
      message: "No ICC profile is assigned to this production profile.",
    });
  }

  if (!profile.outputCondition) {
    issues.push({
      severity: "info",
      code: "MISSING_OUTPUT_CONDITION",
      message: "No print output condition is recorded for this job.",
    });
  }

  for (const spot of profile.spotColors) {
    if (!spot.preserveAsSpot) {
      issues.push({
        severity: "warning",
        code: "SPOT_CONVERTED_TO_PROCESS",
        message: `${spot.name} is configured to convert from spot to process color.`,
      });
    }

    if (!spot.pantone) {
      issues.push({
        severity: "info",
        code: "UNAPPROVED_PANTONE",
        message: `${spot.name} does not include a Pantone/PMS reference.`,
      });
    }
  }

  return issues;
}

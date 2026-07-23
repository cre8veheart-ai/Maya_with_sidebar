export interface BetaProfile {
  name: string;
  title: string;
  company: string;
  industry: string;
  companySize: string;
  primaryRole: string;
  useCase: string;
  approvedAt: string;
  inviteCodes: string[];
}

const BETA_KEY = "maya_beta_status";
const PROFILE_KEY = "maya_beta_profile";
const SURVEY_KEY = "maya_beta_last_survey";

export function getBetaStatus(): "approved" | "pending" {
  if (typeof window === "undefined") return "pending";
  return localStorage.getItem(BETA_KEY) === "approved" ? "approved" : "pending";
}

export function saveBetaProfile(profile: BetaProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(BETA_KEY, "approved");
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getBetaProfile(): BetaProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as BetaProfile) : null;
  } catch {
    return null;
  }
}

export function needsSurvey(): boolean {
  if (typeof window === "undefined") return false;
  const last = localStorage.getItem(SURVEY_KEY);
  if (!last) return true;
  const daysDiff = (Date.now() - new Date(last).getTime()) / 86_400_000;
  return daysDiff >= 30;
}

export function recordSurvey(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SURVEY_KEY, new Date().toISOString());
}

export function getLastSurveyDate(): Date | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SURVEY_KEY);
  return raw ? new Date(raw) : null;
}

export function clearBetaData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(BETA_KEY);
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(SURVEY_KEY);
}

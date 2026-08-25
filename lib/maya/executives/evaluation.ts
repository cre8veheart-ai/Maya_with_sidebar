export type ExecutiveEvalOutcome = "pass" | "partial" | "fail" | "blocked";

export interface ExecutiveEvalRecord {
  id: string;
  moduleId: string;
  testId: string;
  outcome: ExecutiveEvalOutcome;
  confidence: number;
  evidence: string;
  notes?: string;
  createdAt: string;
}

export interface ExecutiveEvalSummary {
  total: number;
  pass: number;
  partial: number;
  fail: number;
  blocked: number;
  score: number;
  promotionReady: boolean;
}

export const EXECUTIVE_EVAL_STORAGE_KEY = "maya.executive-evals.v1";

export function summarizeExecutiveEvals(records: readonly ExecutiveEvalRecord[]): ExecutiveEvalSummary {
  const counts = records.reduce(
    (acc, record) => {
      acc[record.outcome] += 1;
      return acc;
    },
    { pass: 0, partial: 0, fail: 0, blocked: 0 },
  );

  const weighted = counts.pass + counts.partial * 0.5;
  const denominator = Math.max(records.length, 1);
  const score = records.length ? Math.round((weighted / denominator) * 100) : 0;

  return {
    total: records.length,
    ...counts,
    score,
    promotionReady:
      records.length > 0 &&
      counts.fail === 0 &&
      counts.blocked === 0 &&
      counts.partial === 0 &&
      records.every((record) => record.confidence >= 0.7 && record.evidence.trim().length > 0),
  };
}

export function outcomeRequiresPatch(outcome: ExecutiveEvalOutcome) {
  return outcome === "fail" || outcome === "partial";
}

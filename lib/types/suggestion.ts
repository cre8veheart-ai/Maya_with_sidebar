// ── Multi-user Suggestion Cloud ───────────────────────────────────────────────
// A shared pool where any vault-access user can submit, view, and vote on
// suggestions — strategic ideas, operational improvements, team proposals.
// Visibility controls let execs keep some suggestions exec-only.

export type SuggestionCategory =
  | "strategic"
  | "operational"
  | "product"
  | "talent"
  | "financial"
  | "other";

export type SuggestionStatus =
  | "open"
  | "under-review"
  | "accepted"
  | "declined";

export type SuggestionVisibility = "team" | "exec-only";

export interface SuggestionVotes {
  up: string[];   // userIds who upvoted
  down: string[]; // userIds who downvoted
}

export interface Suggestion {
  id: string;
  title: string;
  body: string;
  submittedBy: string;   // displayName of submitter
  submittedAt: string;   // ISO 8601
  category: SuggestionCategory;
  status: SuggestionStatus;
  votes: SuggestionVotes;
  visibility: SuggestionVisibility;
  tags: string[];
  updatedAt: string;     // ISO 8601
}

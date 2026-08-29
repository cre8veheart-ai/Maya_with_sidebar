export type MayaAgentId =
  | "max"
  | "dana"
  | "ari"
  | "sam"
  | "cmo"
  | "cio"
  | "cro"
  | "cd"
  | "hr"
  | "legal"
  | "mimi"
  | "admin"
  | "custom";

export type MayaAgentLayer = "executive" | "specialist" | "administrative" | "custom";
export type MayaAuthority = "advise" | "draft" | "coordinate" | "execute-with-approval";

export interface MayaAgent {
  id: MayaAgentId;
  name: string;
  title: string;
  layer: MayaAgentLayer;
  mission: string;
  owns: string[];
  routesTo: MayaAgentId[];
  authority: MayaAuthority[];
  status: "active" | "waiting" | "closed";
}

export const MAYA_AGENTS: MayaAgent[] = [
  { id: "max", name: "Max", title: "CEO", layer: "executive", mission: "Set enterprise direction, priorities, and final executive decisions.", owns: ["strategy", "prioritization", "capital allocation", "executive synthesis"], routesTo: ["dana", "ari", "sam", "cmo", "cio", "cro"], authority: ["advise", "draft", "coordinate"], status: "active" },
  { id: "dana", name: "Dana", title: "CFO", layer: "executive", mission: "Protect financial integrity and require spending to earn its place.", owns: ["budgets", "forecasting", "cash flow", "scenario analysis", "forensic spend review", "portfolio economics"], routesTo: ["max", "sam"], authority: ["advise", "draft", "coordinate"], status: "active" },
  { id: "ari", name: "Ari", title: "CTO", layer: "executive", mission: "Own technical architecture, engineering quality, security, infrastructure, APIs, and deployment integrity.", owns: ["architecture", "engineering", "security", "infrastructure", "apis", "deployments"], routesTo: ["max", "sam", "cio"], authority: ["advise", "draft", "coordinate", "execute-with-approval"], status: "active" },
  { id: "sam", name: "Sam", title: "COO", layer: "executive", mission: "Turn decisions into completed work with clear owners, dependencies, schedules, blockers, and acceptance criteria.", owns: ["operations", "projects", "workflows", "vendors", "dependencies", "delivery"], routesTo: ["max", "dana", "ari", "cmo", "cio"], authority: ["advise", "draft", "coordinate"], status: "active" },
  { id: "cmo", name: "CMO", title: "Chief Marketing Officer", layer: "executive", mission: "Own market intelligence, positioning, brand, customer strategy, growth, campaigns, and commercial creative direction.", owns: ["brand", "gtm", "segmentation", "campaigns", "growth", "customer intelligence", "creative direction"], routesTo: ["max", "dana", "sam", "cro", "cd", "mimi"], authority: ["advise", "draft", "coordinate"], status: "active" },
  { id: "cio", name: "CIO", title: "Chief Information Officer", layer: "executive", mission: "Make MAYA information trustworthy, organized, permissioned, attributable, and retrievable.", owns: ["information architecture", "knowledge systems", "provenance", "permissions", "retrieval", "data governance"], routesTo: ["max", "ari", "sam"], authority: ["advise", "draft", "coordinate"], status: "active" },
  { id: "cro", name: "CRO", title: "Chief Revenue Officer", layer: "executive", mission: "Turn market opportunity into durable, measurable revenue across acquisition, sales, retention, and expansion.", owns: ["revenue strategy", "pipeline", "sales", "pricing input", "retention", "expansion", "revenue forecasting"], routesTo: ["max", "dana", "sam", "cmo"], authority: ["advise", "draft", "coordinate"], status: "active" },
  { id: "cd", name: "CD", title: "Creative Director", layer: "executive", mission: "Translate strategy into coherent, distinctive creative systems and production direction.", owns: ["creative concepts", "visual direction", "campaign creative", "brand expression", "production briefs", "creative quality"], routesTo: ["cmo", "max", "mimi"], authority: ["advise", "draft", "coordinate"], status: "active" },
  { id: "hr", name: "HR", title: "Human Resources", layer: "executive", mission: "Protect organizational health through clear roles, people systems, performance practices, and responsible workforce decisions.", owns: ["role design", "hiring", "onboarding", "performance", "people policy", "workforce planning"], routesTo: ["max", "sam", "legal"], authority: ["advise", "draft", "coordinate"], status: "active" },
  { id: "legal", name: "Legal", title: "Legal Counsel", layer: "executive", mission: "Identify legal exposure, preserve decision records, and route matters requiring licensed counsel or jurisdiction-specific review.", owns: ["contracts", "legal risk", "ip issues", "compliance triage", "terms review", "legal escalation"], routesTo: ["max", "sam", "dana", "ari"], authority: ["advise", "draft", "coordinate"], status: "active" },
  { id: "mimi", name: "Mimi", title: "Art Gallery Sales Manager", layer: "specialist", mission: "Own the commercial side of the gallery while leaving artistic decisions with the artist.", owns: ["collector inquiries", "artwork availability", "sales pipeline", "follow-up", "exhibitions", "client relationships"], routesTo: ["cmo", "dana", "sam", "cd"], authority: ["advise", "draft", "coordinate"], status: "active" },
  { id: "admin", name: "Admin", title: "Administrative Secretary", layer: "administrative", mission: "Handle routine office administration, records, filing, correspondence routing, and scheduling logistics.", owns: ["records", "filing", "forms", "routine correspondence", "contact maintenance", "scheduling logistics"], routesTo: ["sam", "max"], authority: ["draft", "coordinate"], status: "active" },
  { id: "custom", name: "Custom", title: "Custom Agent", layer: "custom", mission: "Provide an owner-defined specialist role with explicit expertise, tools, reporting lines, and permissions.", owns: ["owner-defined"], routesTo: ["max"], authority: ["advise", "draft"], status: "waiting" },
];

export const getMayaAgent = (id: MayaAgentId) => MAYA_AGENTS.find((agent) => agent.id === id);

import assert from "node:assert/strict";

function normalizeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function classifyBranchSprawl({ totalBranches, similarlyNamedBranches, burstBranches }) {
  const reasons = [];
  if (totalBranches >= 50) reasons.push("excessive_total_branches");
  if (similarlyNamedBranches >= 8) reasons.push("similar_branch_fanout");
  if (burstBranches >= 12) reasons.push("branch_creation_burst");
  return { status: reasons.length ? "REVIEW" : "PASS", reasons };
}

function classifyRepoDupes({ canonicalRepo, repos }) {
  const canonical = normalizeName(canonicalRepo);
  const mayaRepos = repos.filter((repo) => normalizeName(repo).includes("maya"));
  const nearDupes = mayaRepos.filter((repo) => {
    const n = normalizeName(repo);
    return n !== canonical && (n.includes(canonical) || canonical.includes(n) || n.startsWith("maya"));
  });
  return {
    status: nearDupes.length ? "REVIEW" : "PASS",
    nearDupes,
  };
}

const branchCases = [
  {
    id: "normal-feature-flow",
    input: { totalBranches: 9, similarlyNamedBranches: 2, burstBranches: 3 },
    expected: "PASS",
  },
  {
    id: "massive-branch-smokescreen",
    input: { totalBranches: 91, similarlyNamedBranches: 14, burstBranches: 20 },
    expected: "REVIEW",
  },
  {
    id: "similar-name-fanout",
    input: { totalBranches: 22, similarlyNamedBranches: 11, burstBranches: 4 },
    expected: "REVIEW",
  },
  {
    id: "sudden-branch-burst",
    input: { totalBranches: 28, similarlyNamedBranches: 3, burstBranches: 15 },
    expected: "REVIEW",
  },
];

for (const test of branchCases) {
  const result = classifyBranchSprawl(test.input);
  assert.equal(result.status, test.expected, `${test.id}: wrong branch-sprawl status`);
  console.log(`BRANCH_SPRAWL ${test.id} => ${result.status} ${result.reasons.join(",")}`);
}

const repoCases = [
  {
    id: "single-canonical-maya-repo",
    canonicalRepo: "Maya_with_sidebar",
    repos: ["Maya_with_sidebar"],
    expected: "PASS",
  },
  {
    id: "parallel-maya-repositories",
    canonicalRepo: "Maya_with_sidebar",
    repos: ["Maya_with_sidebar", "maya-with-sidebar-copy", "Maya_prod"],
    expected: "REVIEW",
  },
];

for (const test of repoCases) {
  const result = classifyRepoDupes(test);
  assert.equal(result.status, test.expected, `${test.id}: wrong repo-dupe status`);
  console.log(`REPO_SPRAWL ${test.id} => ${result.status} ${result.nearDupes.join(",")}`);
}

// Current observed repository snapshot from the authenticated GitHub inspection.
const currentSnapshot = classifyBranchSprawl({
  totalBranches: 91,
  similarlyNamedBranches: 18,
  burstBranches: 0,
});
console.log(`CURRENT_BRANCH_SNAPSHOT => ${currentSnapshot.status} ${currentSnapshot.reasons.join(",")}`);
assert.equal(currentSnapshot.status, "REVIEW", "Current 91-branch snapshot must be surfaced for review");

const currentRepoSnapshot = classifyRepoDupes({
  canonicalRepo: "Maya_with_sidebar",
  repos: ["Maya_with_sidebar"],
});
console.log(`CURRENT_REPO_SNAPSHOT => ${currentRepoSnapshot.status}`);
assert.equal(currentRepoSnapshot.status, "PASS", "Current Maya repository snapshot should have one canonical repo");

console.log("REPO_BRANCH_SPRAWL_GATE=PASS");

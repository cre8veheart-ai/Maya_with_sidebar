import fs from "node:fs";

const files = {
  ceo: fs.readFileSync("lib/maya/executives/ceo.ts", "utf8"),
  cmo: fs.readFileSync("lib/maya/executives/cmo.ts", "utf8"),
  cfo: fs.readFileSync("lib/maya/executives/cfo.ts", "utf8"),
  cto: fs.readFileSync("lib/maya/executives/cto.ts", "utf8"),
  lens: fs.readFileSync("lib/maya/execLens.ts", "utf8"),
};

const required = [
  ["ceo", 'role: "ceo"'],
  ["cmo", 'role: "cmo"'],
  ["cmo", "You are Max"],
  ["cfo", 'role: "cfo"'],
  ["cfo", "You are Dana"],
  ["cto", 'role: "cto"'],
  ["cto", "You are Ari"],
  ["lens", 'import { ceoChassis } from "./executives/ceo";'],
  ["lens", 'import { cmoChassis } from "./executives/cmo";'],
  ["lens", 'import { cfoChassis } from "./executives/cfo";'],
  ["lens", 'import { ctoChassis } from "./executives/cto";'],
  ["lens", 'if (role === "ceo")'],
  ["lens", 'if (role === "cmo")'],
  ["lens", 'if (role === "cfo")'],
  ["lens", 'if (role === "cto")'],
];

for (const [file, marker] of required) {
  if (!files[file].includes(marker)) {
    console.error(`Executive core verification failed: ${file} missing ${marker}`);
    process.exit(1);
  }
}

console.log("MAYA core executive roster verification passed: CEO, Max, Dana, Ari.");

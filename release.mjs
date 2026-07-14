// Publishes the package under both names: create-expresso (primary)
// and @thefordz/create-express (alias). Run in a real terminal so the
// npm 2FA browser prompt can open: node release.mjs
import { spawnSync } from "node:child_process";
import fs from "node:fs";

const NAMES = ["create-expresso", "@thefordz/create-express"];
const pkgPath = new URL("./package.json", import.meta.url);
const original = fs.readFileSync(pkgPath, "utf-8");

try {
  for (const name of NAMES) {
    const pkg = JSON.parse(original);
    pkg.name = name;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
    console.log(`\n=== Publishing ${name}@${pkg.version} ===\n`);
    const result = spawnSync("npm", ["publish", "--access", "public"], {
      stdio: "inherit",
    });
    if (result.status !== 0) {
      console.error(`\nFailed to publish ${name} — fix and re-run.`);
      process.exit(1);
    }
  }
} finally {
  fs.writeFileSync(pkgPath, original);
}

console.log("\nDone — published under both names.");

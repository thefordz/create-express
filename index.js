#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as p from "@clack/prompts";
import pc from "picocolors";

// Template variants live in templates/<name>; "base" is the plain Express starter.
// Future: add e.g. templates/mongodb-prisma and a p.select() to pick one.
const templateDir = fileURLToPath(
  new URL("./templates/base", import.meta.url),
);

const cancel = (message = "Operation cancelled.") => {
  p.cancel(message);
  process.exit(1);
};

const isValidProjectName = (name) =>
  /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name);

const isEmptyDir = (dir) =>
  !fs.existsSync(dir) ||
  fs.readdirSync(dir).filter((f) => f !== ".git").length === 0;

const detectPackageManager = () => {
  const userAgent = process.env.npm_config_user_agent ?? "";
  if (userAgent.startsWith("pnpm")) return "pnpm";
  if (userAgent.startsWith("yarn")) return "yarn";
  if (userAgent.startsWith("bun")) return "bun";
  return "npm";
};

const stripAnsi = (text) => text.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, "");

const runInstall = (pm, cwd, onOutput) =>
  new Promise((resolve) => {
    const child = spawn(pm, ["install"], {
      cwd,
      shell: process.platform === "win32",
    });
    let stderr = "";
    child.stdout.on("data", (chunk) => onOutput(chunk.toString()));
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
      onOutput(chunk.toString());
    });
    child.on("close", (code) => resolve({ code, stderr }));
    child.on("error", (err) => resolve({ code: 1, stderr: err.message }));
  });

const argv = process.argv.slice(2);

if (argv.includes("-h") || argv.includes("--help")) {
  console.log(`
${pc.bold("create-express")} — Express 5 + TypeScript starter

Usage:
  pnpm create @thefordz/express [project-name] [options]

Options:
  --no-install   Skip dependency installation
  -v, --version  Show version
  -h, --help     Show this help
`);
  process.exit(0);
}

if (argv.includes("-v") || argv.includes("--version")) {
  const cliPkg = JSON.parse(
    fs.readFileSync(fileURLToPath(new URL("./package.json", import.meta.url)), "utf-8"),
  );
  console.log(cliPkg.version);
  process.exit(0);
}

console.log();
p.intro(
  `${pc.bgCyan(pc.black(" create-express "))} ${pc.dim("Express 5 + TypeScript starter")}`,
);

// pnpm/npm may pass flags through (e.g. `npm create foo -- --flag`); only take the first non-flag arg
let projectName = argv.find((arg) => !arg.startsWith("-"));

if (!projectName) {
  const answer = await p.text({
    message: "Project name?",
    placeholder: "my-api",
    defaultValue: "my-api",
    validate: (value) => {
      const name = value.trim() || "my-api";
      if (name !== "." && !isValidProjectName(path.basename(name)))
        return "Invalid project name (lowercase letters, numbers, - and _ only)";
    },
  });
  if (p.isCancel(answer)) cancel();
  projectName = answer.trim() || "my-api";
}

const targetDir = path.resolve(process.cwd(), projectName);
// For `.` the folder already exists with any casing — sanitize instead of rejecting
const packageName = path
  .basename(projectName === "." ? targetDir : projectName)
  .toLowerCase()
  .replace(/\s+/g, "-");

if (!isValidProjectName(packageName))
  cancel(`Invalid project name: ${packageName}`);

if (!isEmptyDir(targetDir)) {
  const overwrite = await p.confirm({
    message: `Directory ${pc.cyan(projectName)} is not empty. Remove existing files and continue?`,
    initialValue: false,
  });
  if (p.isCancel(overwrite) || !overwrite) cancel();
  for (const file of fs.readdirSync(targetDir)) {
    if (file === ".git") continue;
    fs.rmSync(path.join(targetDir, file), { recursive: true, force: true });
  }
}

const pm = detectPackageManager();
const install = !argv.includes("--no-install");

fs.cpSync(templateDir, targetDir, { recursive: true });

// npm strips .gitignore from published packages, so the template ships _gitignore
fs.renameSync(
  path.join(targetDir, "_gitignore"),
  path.join(targetDir, ".gitignore"),
);

const pkgPath = path.join(targetDir, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
pkg.name = packageName;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

const readmePath = path.join(targetDir, "README.md");
const readme = fs
  .readFileSync(readmePath, "utf-8")
  .replace(/^# .*/, `# ${packageName}`);
fs.writeFileSync(readmePath, readme);

const relativeDir = path.relative(process.cwd(), targetDir) || ".";
p.log.success(`Created ${pc.cyan(relativeDir + "/")}`);

let installed = false;
if (install) {
  const s = p.spinner();
  const startedAt = Date.now();
  let lastLine = "";
  s.start(`Installing dependencies with ${pc.cyan(pm)}...`);

  const timer = setInterval(() => {
    const seconds = Math.round((Date.now() - startedAt) / 1000);
    const activity = lastLine ? ` ${pc.dim("│ " + lastLine)}` : "";
    s.message(
      `Installing dependencies with ${pc.cyan(pm)} ${pc.dim(`(${seconds}s)`)}${activity}`,
    );
  }, 150);

  const result = await runInstall(pm, targetDir, (chunk) => {
    const line = stripAnsi(chunk)
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .pop();
    if (line) lastLine = line.length > 48 ? line.slice(0, 48) + "…" : line;
  });

  clearInterval(timer);
  installed = result.code === 0;
  const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);

  if (installed) {
    s.stop(`Dependencies installed ${pc.dim(`with ${pm} in ${seconds}s`)}`);
  } else {
    s.stop(
      pc.red(`Failed to install dependencies — run "${pm} install" manually.`),
    );
    const detail = result.stderr.trim();
    if (detail) p.log.error(detail.split("\n").slice(-10).join("\n"));
  }
}

const steps = [
  projectName !== "." && `cd ${projectName}`,
  "cp .env.example .env",
  !installed && `${pm} install`,
  pm === "npm" ? "npm run dev" : `${pm} dev`,
].filter(Boolean);

p.note(steps.map((step) => pc.cyan(step)).join("\n"), "Next steps");
p.outro(
  `Done. Health check at ${pc.underline(pc.cyan("http://localhost:3000/health"))}`,
);

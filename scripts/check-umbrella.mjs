#!/usr/bin/env node
/**
 * The umbrella guard.
 *
 * `asheeui` is a router: one entry for the web branch, one for the device, and the
 * bundler decides which one an import reaches. That mechanism is sound; what the umbrella
 * *offers* behind it is what this checks. Both entries are generated from `PORTABLE_API`
 * in `@asheeui/core`, and `UMBRELLA-REPORT.md` §6 states six assertions that say whether
 * the surface has reached its target. This is the command that runs them.
 *
 * Since B21 the guard is **blocking**: assertions 1–5 must pass, and assertion 6 is
 * `pending` with owner B22 because the three subpaths it awaits ship then. A pending
 * assertion does not fail the run, but any subpath problem other than those three does.
 *
 * The logic lives in `scripts/lib/umbrella-check.mjs` so this command and
 * `packages/ui/src/index.test.ts` run the same evaluation; keeping two copies is how a
 * suite and a script start disagreeing.
 *
 * Usage:
 *
 *   node scripts/check-umbrella.mjs           # the six assertions; exit 1 on a failure
 *   node scripts/check-umbrella.mjs --list    # both branch surfaces, name by name
 *   node scripts/check-umbrella.mjs --json    # the same facts as data; exit 1 on a failure
 */

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { evaluateUmbrella } from "./lib/umbrella-check.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

let summary;
try {
  summary = evaluateUmbrella({ root });
} catch (error) {
  console.error(
    `Umbrella: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
}

const { surfaces, portable, assertions } = summary;
const failed = assertions.filter((outcome) => outcome.status === "fail");
const pending = assertions.filter((outcome) => outcome.status === "pending");

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(summary, null, 2));
  process.exit(failed.length > 0 ? 1 : 0);
}

if (process.argv.includes("--list")) {
  const sections = [
    ["The web branch", surfaces.webNames],
    ["The native branch", surfaces.nativeNames],
    ["Shared", surfaces.sharedNames],
  ];
  for (const [title, names] of sections) {
    console.log(`${title} (${names.length} names)`);
    for (const name of names) console.log(`  ${name}`);
    console.log("");
  }
  process.exit(0);
}

const LABELS = {
  pass: "pass   ",
  fail: "FAIL   ",
  pending: "pending",
};

console.log("Umbrella guard — blocking since B21.\n");

console.log("Branches");
console.log(
  `  web          ${String(surfaces.web).padStart(4)} names  (packages/ui/src/index.ts)`,
);
console.log(
  `  native       ${String(surfaces.native).padStart(4)} names  (packages/ui/src/index.native.ts)`,
);
console.log(`  shared       ${String(surfaces.shared).padStart(4)} names`);
console.log(
  `  web only     ${String(surfaces.webOnly).padStart(4)} names  (${surfaces.publicWebOnly} public, ${surfaces.internalWebOnly} Config/Props/FALLBACK/default internals)`,
);
console.log(
  `  native only  ${String(surfaces.nativeOnly).padStart(4)} names  (${surfaces.publicNativeOnly} public, ${surfaces.internalNativeOnly} internals)`,
);
if (portable) {
  console.log(
    `  portable     ${String(portable.size).padStart(4)} names  (${portable.core} from core, ${portable.renderer} from the branch renderer, ${portable.pending} pending)`,
  );
}

/** Print a wrapped, indented list so a long set of names stays readable. */
function printNames(names, indent, width = 96) {
  let line = "";
  for (const name of names) {
    const next = line ? `${line}, ${name}` : name;
    if (next.length > width) {
      console.log(`${indent}${line},`);
      line = name;
    } else {
      line = next;
    }
  }
  if (line) console.log(`${indent}${line}`);
}

console.log("\nAssertions");
for (const outcome of assertions) {
  console.log(`  ${outcome.id}  ${outcome.title}`);
  console.log(
    `     ${LABELS[outcome.status] ?? outcome.status}  ${outcome.detail}${outcome.owner ? `  (owner ${outcome.owner})` : ""}`,
  );
  for (const name of outcome.offending.slice(0, 1)) {
    // The full list follows below; the line here keeps a failure readable at a glance.
    if (outcome.status === "fail") console.log(`             first: ${name}`);
  }
}

if (failed.length > 0) {
  console.log("\nWhat the failures are");
  for (const outcome of failed) {
    console.log(`\n  ${outcome.id}. ${outcome.title}`);
    printNames(outcome.offending, "     ");
  }
}

const summaryLine = [
  `${failed.length} of ${assertions.length} assertions fail`,
  pending.length > 0
    ? `${pending.length} pending (${pending.map((outcome) => outcome.owner ?? "unowned").join(", ")})`
    : "none pending",
].join("; ");

console.log(`\n${summaryLine}.`);
process.exit(failed.length > 0 ? 1 : 0);

#!/usr/bin/env node
/**
 * Test what the branch touched, not the whole repository.
 *
 * `pnpm test` stays the gate a merge runs: every package, every suite, in the order the plan's batches
 * describe. While working through those batches it costs minutes per turn, and most of a batch touches
 * one or two packages — the web renderer's jsdom suite is the single slowest thing here, and a
 * core-only change never needed it.
 *
 * `turbo run test --filter=...[<base>]` selects the packages that changed since `<base>` **and the
 * packages that depend on them** (that is what the leading `...` means), which is exactly what a change
 * to `@asheeui/core` requires: core's suite plus both renderers, the umbrella and Puck. A package the
 * branch did not affect is not run at all; a package it did affect is run with turbo's cache doing what
 * it can.
 *
 * Usage:
 *
 *   pnpm test:changed                 # since the merge base with origin/main, else the last commit
 *   pnpm test:changed origin/main     # since an explicit ref
 *   pnpm test:changed HEAD~3          # since three commits back
 *
 * Extra arguments after the base are passed to `turbo run test`:
 *
 *   pnpm test:changed -- --concurrency=1
 *
 * The filter reads git, so `pnpm test:changed` describes what the last *commit* changed; run it after a
 * commit, or name the branch base to ask what the whole branch changed. Untracked files are not part of
 * a git diff and are therefore not a reason to run a package.
 */

import { spawn, spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Turbo's own executable, run with the Node that runs this script.
 *
 * `pnpm exec turbo` would work, but resolving the binary avoids a shell (and the argument-escaping it
 * brings on Windows): the filter is passed as one argument, so a ref containing a space or a quote
 * cannot become a second command.
 */
const TURBO = join(ROOT, "node_modules", "turbo", "bin", "turbo");

/**
 * The default base: where the branch left `origin/main`, or the last commit when there is no such ref.
 *
 * A branch point is the honest default for a batch — the last commit would only describe the batch's
 * final commit, and the whole point is to test everything the branch changed.
 */
function defaultBase() {
  const mergeBase = spawnSync("git", ["merge-base", "origin/main", "HEAD"], {
    cwd: ROOT,
    encoding: "utf8",
  });

  if (mergeBase.status === 0) {
    const sha = mergeBase.stdout.trim();
    if (sha.length > 0) return sha;
  }

  return "HEAD^";
}

const [requested, ...rest] = process.argv.slice(2);

if (requested === "--help" || requested === "-h") {
  const usage = /^ \* {3}(pnpm test:changed.*)$/gm;
  const example = (
    usage.exec(readFileSync(fileURLToPath(import.meta.url), "utf8")) ?? []
  ).slice(1);
  console.log(
    [
      "Usage: pnpm test:changed [base] [-- <turbo args>]",
      "",
      "Runs `turbo run test` for the packages changed since <base> and the packages that depend on",
      "them. Without a base it uses the merge base with origin/main, else the last commit.",
      "",
      ...example.map((line) => `  ${line.trim()}`),
    ].join("\n"),
  );
  process.exit(0);
}

if (requested?.startsWith("-")) {
  console.error(
    `[test:changed] "${requested}" is not a git ref — see \`pnpm test:changed --help\`.`,
  );
  process.exit(1);
}

const base = requested ?? defaultBase();

console.log(
  `[test:changed] packages changed since ${base}, and the packages that depend on them`,
);

const turbo = spawn(
  process.execPath,
  [TURBO, "run", "test", `--filter=...[${base}]`, ...rest],
  { cwd: ROOT, stdio: "inherit" },
);

turbo.on("exit", (code) => {
  process.exit(code ?? 1);
});

turbo.on("error", (error) => {
  console.error(`[test:changed] could not start turbo: ${error.message}`);
  process.exit(1);
});

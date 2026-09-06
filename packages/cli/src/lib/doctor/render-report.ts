import type { DoctorCheckResult } from "./types";

// Terminal rendering helpers.

const ANSI = {
  green: "\u001b[32m",
  yellow: "\u001b[33m",
  red: "\u001b[31m",
  blue: "\u001b[34m",
  bold: "\u001b[1m",
  dim: "\u001b[2m",
  reset: "\u001b[0m",
};

/**
 * Wrap a string in an ANSI colour/style code, only when stdout is a TTY.
 *
 * @param code - ANSI escape prefix to apply.
 * @param text - Text to colour.
 * @returns The coloured text, or the original text when not a TTY.
 */
function colorize(code: string, text: string): string {
  if (!process.stdout.isTTY) return text;
  return `${code}${text}${ANSI.reset}`;
}

const green = (text: string) => colorize(ANSI.green, text);
const yellow = (text: string) => colorize(ANSI.yellow, text);
const red = (text: string) => colorize(ANSI.red, text);
const blue = (text: string) => colorize(ANSI.blue, text);
const bold = (text: string) => colorize(ANSI.bold, text);
const dim = (text: string) => colorize(ANSI.dim, text);

const STATUS_ICON: Record<string, string> = {
  pass: "✔",
  warn: "⚠",
  fail: "✖",
  info: "i",
};

const STATUS_COLOR: Record<string, (text: string) => string> = {
  pass: green,
  warn: yellow,
  fail: red,
  info: blue,
};

const DIVIDER = "─".repeat(60);

/**
 * Print a human-readable doctor report to `process.stdout`.
 *
 * Renders one coloured line per check result (icon + title + message),
 * followed by a deduped list of suggested fixes. ANSI colours are only
 * emitted when `process.stdout` is a TTY so log files stay readable.
 *
 * @param results - Doctor check results to render, in display order.
 * @param cwd - Optional override for the directory label shown in the
 *   header. Defaults to `process.cwd()`.
 * @returns Nothing; output is written directly to `process.stdout`.
 *
 * @example
 * ```ts
 * const results = await runDoctorChecks({ cwd: process.cwd() });
 * renderDoctorReport(results);
 * ```
 */
export function renderDoctorReport(
  results: DoctorCheckResult[],
  cwd?: string,
): void {
  const target = cwd ?? process.cwd();

  console.log(bold("asheeui doctor"));
  console.log(dim(`Scanning: ${target}`));
  console.log(dim(DIVIDER));
  console.log("");

  for (const result of results) {
    const color = STATUS_COLOR[result.status];
    const icon = STATUS_ICON[result.status];
    console.log(`${color(`${icon} `)}${bold(result.title)}`);
    console.log(`    ${result.message}`);
    if (result.fix && result.status !== "pass" && result.status !== "info") {
      console.log(`    ${dim("Fix:")} ${result.fix}`);
    }
  }

  const failed = results.filter((result) => result.status === "fail");
  const warned = results.filter((result) => result.status === "warn");
  const fixes = [...failed, ...warned]
    .flatMap((result) => result.fix?.split(" / ") ?? [])
    .map((fix) => fix.trim())
    .filter((fix) => fix !== "");
  const uniqueFixes = [...new Set(fixes)];

  console.log("");
  console.log(dim(DIVIDER));

  if (failed.length === 0 && warned.length === 0) {
    console.log(
      `${green("✔")} ${bold("All checks passed! Your asheeui setup looks great.")}`,
    );
  } else if (uniqueFixes.length > 0) {
    console.log(bold(`Recommended fixes (${uniqueFixes.length}):`));
    uniqueFixes.forEach((fix, index) => {
      console.log(`  ${index + 1}. ${fix}`);
    });
  }
}

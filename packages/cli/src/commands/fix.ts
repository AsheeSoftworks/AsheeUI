import type { Command } from "commander";
import type { FixResult } from "../lib/fix/fix";
import { runFix } from "../lib/fix/fix";

/**
 * ANSI escape codes used by {@link paint} for terminal colouring.
 *
 * Centralised so that the `fix` command output stays visually consistent
 * with the `doctor` command output.
 */
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
 * When output is being piped or redirected, no escape codes are emitted
 * so logs remain readable in plain text.
 *
 * @param code - ANSI escape code prefix to apply.
 * @param text - Text to colour.
 * @returns The coloured text, or the original text when not a TTY.
 */
function paint(code: string, text: string): string {
  if (!process.stdout.isTTY) return text;
  return `${code}${text}${ANSI.reset}`;
}

const STATUS_ICON: Record<string, string> = {
  fixed: "✔",
  already: "•",
  manual: "✖",
  info: "i",
};

const STATUS_COLOR: Record<string, (t: string) => string> = {
  fixed: (t) => paint(ANSI.green, t),
  already: (t) => paint(ANSI.dim, t),
  manual: (t) => paint(ANSI.red, t),
  info: (t) => paint(ANSI.blue, t),
};

/**
 * Print a human-readable report describing each fix outcome.
 *
 * Renders one line per outcome (fixed, already correct, requires manual
 * action, informational) and ends with a summary listing any remaining
 * doctor checks that still need attention.
 *
 * @param result - Aggregated fix result returned by `runFix`.
 * @returns Nothing; output is written directly to `process.stdout`.
 *
 * @example
 * ```ts
 * const result = await runFix({ cwd: process.cwd() });
 * renderFixReport(result);
 * ```
 */
export function renderFixReport(result: FixResult): void {
  console.log(paint(ANSI.bold, "asheeui fix"));
  console.log(paint(ANSI.dim, `Scanning: ${result.cwd}`));
  console.log("");

  for (const outcome of result.outcomes) {
    const icon = STATUS_ICON[outcome.status] ?? "•";
    const color = STATUS_COLOR[outcome.status] ?? ((t) => t);
    console.log(`${color(`${icon} `)}${paint(ANSI.bold, outcome.title)}`);
    console.log(`    ${outcome.message}`);
  }

  console.log("");
  const manual = result.outcomes.filter((o) => o.status === "manual");

  if (result.remaining.length === 0) {
    console.log(
      `${paint(ANSI.green, "✔")} ${paint(
        ANSI.bold,
        "All checks passed. Your asheeui setup is healthy.",
      )}`,
    );
  } else {
    console.log(
      `${paint(ANSI.yellow, "⚠")} ${paint(
        ANSI.bold,
        "Remaining manual steps:",
      )}`,
    );
    for (const check of result.remaining) {
      console.log(`  ${check.title}: ${check.message}`);
      if (check.fix) console.log(`    Fix: ${check.fix}`);
    }
    if (manual.length > 0) {
      console.log(
        paint(ANSI.dim, `  (${manual.length} fix(es) require manual action)`),
      );
    }
  }
}

/**
 * Register the `fix` subcommand on the given commander program.
 *
 * Alias: `f`.
 *
 * Tries to automatically repair the issues flagged by `asheeui doctor`
 * (missing config, missing CSS import, missing root provider, missing
 * peer dependencies) and re-runs doctor afterwards to surface anything
 * that still needs manual work.
 *
 * Flags:
 * - `-d, --dir <path>`: directory to operate on (default: cwd).
 * - `--skip-install`: skip running package-manager installs; only file
 *   changes are applied and missing packages are reported.
 *
 * @param program - Root commander program receiving the new subcommand.
 * @returns The configured commander `Command` instance.
 *
 * @example
 * ```ts
 * const program = new Command();
 * registerFixCommand(program);
 * // ... program.parseAsync(process.argv);
 * ```
 */
export function registerFixCommand(program: Command) {
  program
    .command("fix")
    .alias("f")
    .description(
      "Automatically resolve issues detected by `asheeui doctor` where possible.",
    )
    .option(
      "-d, --dir <path>",
      "project directory to fix (defaults to current directory)",
      process.cwd(),
    )
    .option(
      "--skip-install",
      "do not run package-manager installs (only file changes)",
      false,
    )
    .action(async (opts) => {
      const result = await runFix({
        cwd: opts.dir,
        skipInstall: opts.skipInstall,
      });
      renderFixReport(result);
    });
}

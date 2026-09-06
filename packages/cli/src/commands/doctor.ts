import type { Command } from "commander";
import { runDoctorChecks } from "../lib/doctor/doctor";
import { renderDoctorReport } from "../lib/doctor/render-report";

/**
 * Register the `doctor` subcommand on the given commander program.
 *
 * Aliases: `doc`, `dr`.
 *
 * Doctor scans the project for missing config files, missing peer
 * dependencies, CSS integration problems, and root provider wiring,
 * then prints a human readable summary with suggested fixes.
 *
 * Flags:
 * - `-d, --dir <path>`: directory to scan (default: current working dir).
 *
 * @param program - Root commander program receiving the new subcommand.
 * @returns The configured commander `Command` instance.
 *
 * @example
 * ```ts
 * const program = new Command();
 * registerDoctorCommand(program);
 * // ... program.parseAsync(process.argv);
 * ```
 */
export function registerDoctorCommand(program: Command) {
  program
    .command("doctor")
    .aliases(["doc", "dr"])
    .description(
      "Scan project for configuration errors, missing peer dependencies, and styling setup.",
    )
    .option(
      "-d, --dir <path>",
      "project directory to scan (defaults to current directory)",
      process.cwd(),
    )
    .action(async (opts) => {
      const results = await runDoctorChecks({ cwd: opts.dir });
      renderDoctorReport(results, opts.dir);
    });
}

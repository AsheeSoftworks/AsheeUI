import type { Command } from "commander";
import { runDoctorChecks } from "../lib/doctor/doctor";
import { renderDoctorReport } from "../lib/doctor/render-report";

export function registerDoctorCommand(program: Command) {
  program
    .command("doctor")
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

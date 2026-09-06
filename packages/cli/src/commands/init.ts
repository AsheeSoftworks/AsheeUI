import type { Command } from "commander";
import { runInit } from "../lib/init/init";

/**
 * Register the `init` subcommand on the given commander program.
 *
 * The init flow is safe to re-run: existing files, edits and dependencies
 * are detected and skipped, so users can run it repeatedly without
 * duplicating work.
 *
 * Flags:
 * - `-t, --template <name>`: template name to apply (default: `"default"`).
 * - `--yes`: skip interactive prompts and accept all defaults.
 *
 * @param program - Root commander program receiving the new subcommand.
 * @returns The configured commander `Command` instance.
 *
 * @example
 * ```ts
 * const program = new Command();
 * registerInitCommand(program);
 * // ... program.parseAsync(process.argv);
 * ```
 */
export function registerInitCommand(program: Command) {
  program
    .command("init")
    .alias("i")
    .description("Initialize AsheeUI in your project (idempotent)")
    .option("-t, --template <name>", "template to use", "default")
    .option("--yes", "skip prompts, use defaults", false)
    .action(async (opts) => {
      await runInit(opts);
    });
}

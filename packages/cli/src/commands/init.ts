import type { Command } from "commander";
import { runInit } from "../lib/init.js";

export function registerInitCommand(program: Command) {
  program
    .command("init")
    .description("Scaffold a new Ashee UI project")
    .option("-t, --template <name>", "template to use", "default")
    .option("--yes", "skip prompts, use defaults", false)
    .action(async (opts) => {
      await runInit(opts);
    });
}

/**
 * The `asheeui` command tree.
 *
 * Building the program is separate from parsing `process.argv` so that the
 * registry can be inspected and tested without running the CLI. A command that
 * no longer exists must disappear from `--help` as well as stop working, and a
 * test that only exercises the command's implementation would not notice
 * either.
 *
 * `init`, `doctor`, `list` and `fix` are the supported commands. There is no
 * `playground` command: the applications it used to copy are no longer part of
 * the repository, so the command and the templates it shipped were removed
 * rather than left offering a project that cannot be produced.
 */
import { Command } from "commander";
import { version } from "../package.json";
import { registerDoctorCommand } from "./commands/doctor";
import { registerFixCommand } from "./commands/fix";
import { registerInitCommand } from "./commands/init";
import { registerListCommand } from "./commands/list";

/**
 * Build the root `asheeui` command with every supported subcommand attached.
 *
 * @returns A configured `Command` representing the `asheeui` CLI.
 */
export function createProgram(): Command {
  const program = new Command();
  program
    .name("asheeui")
    .description("Ashee UI CLI")
    .version(version)
    .showHelpAfterError()
    .showSuggestionAfterError();

  registerInitCommand(program);
  registerDoctorCommand(program);
  registerListCommand(program);
  registerFixCommand(program);

  return program;
}

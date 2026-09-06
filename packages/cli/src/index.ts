#!/usr/bin/env node
/**
 * AsheeUI CLI entry point.
 *
 * Wires every supported command (`init`, `doctor`, `list`, `fix`) onto a
 * shared `commander` program instance and begins argument parsing.
 *
 * This module has no runtime exports: it is intended to be executed
 * directly through the `asheeui` bin defined in `package.json`.
 *
 * @example
 * ```sh
 * # Invoked via the published bin, e.g.
 * asheeui init
 * asheeui doctor
 * ```
 */
import { Command } from "commander";
import { version } from "../package.json";
import { registerDoctorCommand } from "./commands/doctor";
import { registerFixCommand } from "./commands/fix";
import { registerInitCommand } from "./commands/init";
import { registerListCommand } from "./commands/list";

/**
 * Root `commander` program instance shared by every CLI subcommand.
 *
 * @returns A configured `Command` representing the `asheeui` CLI.
 */
const program = new Command();
program.name("asheeui").description("Ashee UI CLI").version(version);

registerInitCommand(program);
registerDoctorCommand(program);
registerListCommand(program);
registerFixCommand(program);

program.parseAsync(process.argv);

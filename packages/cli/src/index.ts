#!/usr/bin/env node
/**
 * AsheeUI CLI entry point.
 *
 * Parses `process.argv` against the program built in `./program`, which wires
 * every supported command (`init`, `doctor`, `list`, `fix`) onto a shared
 * `commander` instance.
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
import { createProgram } from "./program";

createProgram()
  .parseAsync(process.argv)
  .catch((error: unknown) => {
    // A command that fails should report one clear line, not a stack trace, and
    // should still leave a non-zero exit code for scripts and CI.
    const message = error instanceof Error ? error.message : String(error);
    console.error(`asheeui: ${message}`);
    process.exitCode = 1;
  });

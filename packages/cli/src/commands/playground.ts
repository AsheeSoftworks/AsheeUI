/**
 * CLI command registration for `asheeui playground`.
 *
 * This module provides the `registerPlaygroundCommand` function, which creates one
 * of the official playground projects in the directory the user chooses: a working
 * application built on the framework, which the client then develops in.
 */

import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Command } from "commander";
import { pathExists } from "../lib/common/file-utils";
import {
  executePlaygroundPlan,
  readTemplateManifest,
} from "../lib/playground/copy";
import { buildPlaygroundPlan } from "../lib/playground/plan";
import {
  PLAYGROUND_TARGETS,
  playgroundTargetIds,
} from "../lib/playground/targets";

/**
 * Find the directory the CLI was installed into, which holds the templates.
 *
 * The built command lives in `dist`, and the templates beside it, so the search
 * walks up from this module until it finds them. Walking rather than assuming one
 * layout is what lets the command run from source during development and from a
 * published package in a client's project.
 *
 * @returns Absolute path of the package directory that holds the templates.
 *
 * @throws When no candidate directory contains a `templates` directory.
 */
async function resolvePackageRoot(): Promise<string> {
  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [here, resolve(here, ".."), resolve(here, "../..")];

  for (const candidate of candidates) {
    if (await pathExists(join(candidate, "templates"))) {
      return candidate;
    }
  }

  throw new Error(
    "Could not find the playground templates. Reinstall @asheeui/cli, or run the command from the package directory.",
  );
}

/**
 * Print every playground the command knows, ready or not.
 */
function printTargets(): void {
  console.log("AsheeUI playgrounds:");
  console.log("");

  for (const target of PLAYGROUND_TARGETS) {
    if (target.status === "ready") {
      console.log(`  ${target.id.padEnd(10)} ${target.label}`);
    } else {
      console.log(
        `  ${target.id.padEnd(10)} ${target.label} (not available yet)`,
      );
      console.log(`             ${target.reason}`);
    }
  }

  console.log("");
  console.log("Create one with: asheeui playground <target> [directory]");
}

/**
 * Register the `playground` subcommand on the given commander program.
 *
 * Flags:
 * - `--list`: print the available playgrounds and exit.
 * - `--force`: write into a directory that already holds some of the project's
 *   files. Without it, the command refuses rather than replacing a client's work.
 *
 * @param program - Root commander program receiving the new subcommand.
 * @returns The configured commander `Command` instance.
 *
 * @example
 * ```ts
 * const program = new Command();
 * registerPlaygroundCommand(program);
 * // asheeui playground next ./invoices
 * ```
 */
export function registerPlaygroundCommand(program: Command) {
  program
    .command("playground")
    .aliases(["pg"])
    .argument("[target]", "playground to create", "")
    .argument("[directory]", "directory to create it in", ".")
    .option("--list", "list the available playgrounds")
    .option("--force", "write into a directory that already has files")
    .description("Create one of the official AsheeUI playground projects")
    .action(async (target: string, directory: string, opts) => {
      if (opts.list || target === "") {
        printTargets();
        return;
      }

      const packageRoot = await resolvePackageRoot();
      const destination = resolve(process.cwd(), directory);
      const plan = buildPlaygroundPlan({
        targetId: target,
        destination,
        packageRoot,
        force: Boolean(opts.force),
      });

      if (plan.problems.length === 0) {
        const manifest = await readTemplateManifest(plan.templateRoot);
        const framework = (manifest?.dependencies ?? {}) as Record<
          string,
          string
        >;

        console.log(
          `Creating the ${plan.target.label} playground in ${plan.destinationRoot}`,
        );

        for (const [name, version] of Object.entries(framework)) {
          console.log(`  ${name} ${version}`);
        }
      }

      const result = await executePlaygroundPlan(plan);

      if (result.problems.length > 0) {
        for (const problem of result.problems) {
          console.error(`asheeui: ${problem}`);
        }

        if (plan.problems.length === 0) {
          console.error(
            `asheeui: available playgrounds: ${playgroundTargetIds().join(", ")}`,
          );
        }

        process.exitCode = 1;
        return;
      }

      console.log("");
      console.log(`Created ${result.copied.length} file(s). Next:`);
      console.log(`  cd ${plan.destinationRoot}`);
      console.log("  pnpm install");
      console.log("  pnpm dev");
    });
}

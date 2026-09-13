/**
 * CLI command registration for `asheeui list`.
 *
 * This module provides the `registerListCommand` function that registers
 * the `list` subcommand on the commander program. The list command discovers
 * the asheeui package and prints its public component inventory.
 */

import type { Command } from "commander";
import {
  discoverPublicComponents,
  renderComponentList,
  resolveAsheeuiPackage,
} from "../lib/list/list";

/**
 * Register the `list` subcommand on the given commander program.
 *
 * Aliases: `ls`, `l`.
 *
 * Discovers the `asheeui` package either inside the project's
 * `node_modules`, in a monorepo `packages/ui` sibling, or at a path
 * supplied via `--path`, then prints every component exposed by the
 * package's public export surface. Internal helpers are never listed.
 *
 * Flags:
 * - `-d, --dir <path>`: project directory used to locate the package.
 * - `--path <path>`: explicit path to a package root or registry folder.
 * - `--json`: emit the component list as JSON instead of a grid.
 *
 * @param program - Root commander program receiving the new subcommand.
 * @returns The configured commander `Command` instance.
 *
 * @example
 * ```ts
 * const program = new Command();
 * registerListCommand(program);
 * // ... program.parseAsync(process.argv);
 * ```
 */
export function registerListCommand(program: Command) {
  program
    .command("list")
    .aliases(["ls", "l"])
    .description("List all available AsheeUI components")
    .option(
      "-d, --dir <path>",
      "project directory used to locate the asheeui package",
      process.cwd(),
    )
    .option(
      "--path <path>",
      "path to an asheeui package root or local registry folder",
    )
    .option("--json", "output the component list as JSON")
    .action(async (opts) => {
      const pkgRoot = await resolveAsheeuiPackage({
        cwd: opts.dir,
        explicitPath: opts.path,
      });

      if (!pkgRoot) {
        console.error(
          "Could not locate the asheeui package. Install `asheeui` in your project or pass --path <registry>.",
        );
        process.exit(1);
      }

      const components = await discoverPublicComponents(pkgRoot);

      if (opts.json) {
        console.log(JSON.stringify(components, null, 2));
        return;
      }

      console.log(`Available asheeui components (${components.length}):`);
      console.log("");
      console.log(renderComponentList(components));
    });
}

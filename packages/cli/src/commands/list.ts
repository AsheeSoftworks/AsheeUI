/**
 * CLI command registration for `asheeui list`.
 *
 * This module provides the `registerListCommand` function that registers
 * the `list` subcommand on the commander program. The list command discovers
 * the renderer package and prints its public component inventory.
 */

import type { Command } from "commander";
import {
  type ComponentEntry,
  discoverComponentGroups,
  renderGroupedComponentList,
  resolveAsheeuiPackage,
} from "../lib/list/list";

/**
 * Register the `list` subcommand on the given commander program.
 *
 * Aliases: `ls`, `l`.
 *
 * Discovers `@asheeui/web` either inside the project's
 * `node_modules`, in a monorepo `packages/web` sibling, or at a path
 * supplied via `--path`, then prints every component exposed by the
 * package's public export surface, grouped by the category folder it lives
 * in. Internal helpers are never listed.
 *
 * Flags:
 * - `-d, --dir <path>`: project directory used to locate the package.
 * - `--path <path>`: explicit path to a package root or registry folder.
 * - `--json`: emit the inventory as JSON, each entry carrying its category.
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
      "project directory used to locate the @asheeui/web package",
      process.cwd(),
    )
    .option(
      "--path <path>",
      "path to a @asheeui/web package root or local registry folder",
    )
    .option(
      "--json",
      "output the component inventory as JSON, with each category",
    )
    .action(async (opts) => {
      const pkgRoot = await resolveAsheeuiPackage({
        cwd: opts.dir,
        explicitPath: opts.path,
      });

      if (!pkgRoot) {
        console.error(
          "Could not locate the asheeui package. Install `@asheeui/web` in your project or pass --path <registry>.",
        );
        process.exit(1);
      }

      const components = await discoverComponentGroups(pkgRoot);

      if (opts.json) {
        // Each entry carries the category it lives in, so a script can group the
        // inventory the way the terminal output does.
        const payload = components.map((entry: ComponentEntry) => ({
          name: entry.name,
          group: entry.group,
        }));
        console.log(JSON.stringify(payload, null, 2));
        return;
      }

      console.log(`Available AsheeUI components (${components.length}):`);
      console.log("");
      console.log(renderGroupedComponentList(components));
    });
}

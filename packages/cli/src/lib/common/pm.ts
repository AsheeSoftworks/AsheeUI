import type { PackageManager } from "./types";

/**
 * Builds the dependency-install command for the given package manager.
 *
 * `npm` uses `install`, while `pnpm`/`yarn`/`bun` use `add`. The `-D`
 * flag marks a devDependency (`bun` accepts both `-d` and `-D`; we
 * normalise on `-D`).
 *
 * @param pm - Package manager to format the command for.
 * @param packages - Package names to install.
 * @param dev - When `true`, install as devDependencies.
 * @returns A shell-ready install command string, or `""` when no packages.
 *
 * @example
 * ```ts
 * formatInstallCommand("pnpm", ["asheeui"]);            // "pnpm add asheeui"
 * formatInstallCommand("npm", ["tailwindcss"], true);    // "npm install -D tailwindcss"
 * ```
 */
export function formatInstallCommand(
  pm: PackageManager,
  packages: string[],
  dev = false,
): string {
  if (packages.length === 0) return "";
  switch (pm) {
    case "pnpm":
      return `pnpm add ${dev ? "-D " : ""}${packages.join(" ")}`.trimEnd();
    case "yarn":
      return `yarn add ${dev ? "-D " : ""}${packages.join(" ")}`.trimEnd();
    case "bun":
      // bun uses `-d` (or `--dev`) to install into devDependencies.
      return `bun add ${dev ? "-d " : ""}${packages.join(" ")}`.trimEnd();
    case "npm":
      return `npm install ${dev ? "-D " : ""}${packages.join(" ")}`.trimEnd();
  }
}

/**
 * Alias for {@link formatInstallCommand} used by the `init` flow.
 */
export const buildInstallCommand = formatInstallCommand;

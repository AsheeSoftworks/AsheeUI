/**
 * Re-export of {@link formatInstallCommand} under the `init`-friendly
 * name `buildInstallCommand`.
 *
 * Kept in its own module so the `init` flow can depend on a single
 * symbol without pulling the rest of `common/pm` into its import graph.
 */
export { buildInstallCommand } from "../common/pm";

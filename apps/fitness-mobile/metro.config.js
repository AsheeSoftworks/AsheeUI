/**
 * Metro, in a pnpm workspace.
 *
 * Three settings make the shared kit and the umbrella resolvable: the workspace root is
 * watched, the resolver looks in both `node_modules` directories, and the package
 * `exports` map is enabled so `asheeui` and `@asheeui/puck` take their `react-native`
 * branch. NativeWind wraps the final config with its CSS input.
 */
const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];
// Hierarchical lookup stays on: pnpm puts a package's own dependencies beside its real
// path inside the virtual store, and disabling the walk would hide `invariant` from
// `react-native`.
config.resolver.unstable_enablePackageExports = true;

module.exports = withNativeWind(config, { input: "./global.css" });

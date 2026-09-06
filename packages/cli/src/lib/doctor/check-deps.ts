import { join } from "node:path";
import { detectPackageManager, readJson } from "../common/file-utils";
import { formatInstallCommand } from "../common/pm";
import type { DoctorCheckResult, DoctorOptions } from "./types";

/** Numeric `major.minor.patch` version components. */
interface VersionParts {
  /** Major version number. */
  major: number;
  /** Minor version number. */
  minor: number;
  /** Patch version number. */
  patch: number;
}

/** A single parsed alternative of a required semver range. */
interface RequiredRange {
  /** Comparison mode of the alternative. */
  mode: "caret" | "tilde" | "gte" | "exact";
  /** Minimum version the alternative requires. */
  min: VersionParts;
}

/** A peer dependency that AsheeUI consumers must install. */
interface PeerDependencySpec {
  /** Package name as it appears in `package.json`. */
  name: string;
  /** Supported semver range expression. */
  range: string;
  /** When `true`, the package belongs in `devDependencies`. */
  dev?: boolean;
}

/**
 * Peer dependencies that every AsheeUI consumer project must declare,
 * with their supported semver ranges.
 */
export const REQUIRED_PEER_DEPENDENCIES: PeerDependencySpec[] = [
  { name: "react", range: "^18.0.0 || ^19.0.0" },
  { name: "react-dom", range: "^18.0.0 || ^19.0.0" },
  { name: "tailwindcss", range: ">=4.0.0 || ^3.0.0", dev: true },
];

// Semver helpers (kept intentionally small, no external dependency).

/**
 * Parse a leading `major.minor.patch` triplet from a version string.
 *
 * @param raw - Raw version text (optionally `v`-prefixed).
 * @returns The parsed {@link VersionParts}, or `null` when no triplet
 *   can be extracted.
 */
function parseVersion(raw: string): VersionParts | null {
  const match = /^v?(\d+)\.(\d+)\.(\d+)/.exec(raw.trim());
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}
/**
 * Return the lowest version a declaration could resolve to.
 *
 * Returns `null` for unparseable specs (`*`, `latest`, `workspace:`,
 * `file:`, `link:`, `npm:`, etc.) so callers can treat mere presence
 * as acceptable.
 *
 * @param spec - Raw version spec (e.g. `"^18.2.0"`).
 * @returns The lowest version, or `null` when the spec cannot be parsed.
 */
export function lowerBoundOf(spec: string): VersionParts | null {
  const trimmed = spec.trim();
  if (trimmed === "" || trimmed === "*" || trimmed === "latest") return null;
  if (/^(workspace:|file:|link:|npm:)/.test(trimmed)) return null;
  return parseVersion(trimmed.replace(/^[\^~><=]+\s*/, ""));
}

/**
 * Parse a required range expression into its per-alternative parts.
 *
 * @param range - A range such as `"^18.0.0 || ^19.0.0"`.
 * @returns An array of parsed alternatives; unparseable alternatives
 *   are dropped from the result.
 */
function parseRequiredRange(range: string): RequiredRange[] {
  return range
    .split("||")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part): RequiredRange | null => {
      const caret = /^\^v?(\d+)\.(\d+)\.(\d+)/.exec(part);
      if (caret) {
        return {
          mode: "caret",
          min: {
            major: Number(caret[1]),
            minor: Number(caret[2]),
            patch: Number(caret[3]),
          },
        };
      }
      const tilde = /^~v?(\d+)\.(\d+)\.(\d+)/.exec(part);
      if (tilde) {
        return {
          mode: "tilde",
          min: {
            major: Number(tilde[1]),
            minor: Number(tilde[2]),
            patch: Number(tilde[3]),
          },
        };
      }
      const gte = /^>=v?(\d+)\.(\d+)\.(\d+)/.exec(part);
      if (gte) {
        return {
          mode: "gte",
          min: {
            major: Number(gte[1]),
            minor: Number(gte[2]),
            patch: Number(gte[3]),
          },
        };
      }
      const exact = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(part);
      if (exact) {
        return {
          mode: "exact",
          min: {
            major: Number(exact[1]),
            minor: Number(exact[2]),
            patch: Number(exact[3]),
          },
        };
      }
      return null;
    })
    .filter((range): range is RequiredRange => range !== null);
}

/**
 * Compare two version triplets numerically.
 *
 * @param a - First version.
 * @param b - Second version.
 * @returns A negative number when `a < b`, zero when equal, or a
 *   positive number when `a > b`.
 */
function compareVersions(a: VersionParts, b: VersionParts): number {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  return a.patch - b.patch;
}

/**
 * Test a parsed user version against a single required range
 * alternative (one mode, one minimum version).
 *
 * @param userLower - User's resolved lower-bound version.
 * @param req - Parsed required alternative.
 * @returns `true` when the user version satisfies the alternative.
 */
function satisfiesAlternative(
  userLower: VersionParts,
  req: RequiredRange,
): boolean {
  switch (req.mode) {
    case "caret":
      if (req.min.major > 0) {
        return (
          userLower.major === req.min.major &&
          compareVersions(userLower, req.min) >= 0
        );
      }
      // Caret on 0.x pins the minor version too.
      return (
        userLower.major === req.min.major &&
        userLower.minor === req.min.minor &&
        compareVersions(userLower, req.min) >= 0
      );
    case "tilde":
      return (
        userLower.major === req.min.major &&
        userLower.minor === req.min.minor &&
        compareVersions(userLower, req.min) >= 0
      );
    case "gte":
      return compareVersions(userLower, req.min) >= 0;
    case "exact":
      return compareVersions(userLower, req.min) === 0;
  }
}

/**
 * Check whether a declared dependency spec (e.g. from `package.json`)
 * is compatible with a required semver range such as
 * `"^18.0.0 || ^19.0.0"`.
 *
 * Unparseable user specs are treated as acceptable, matching the
 * pragmatic stance of `lowerBoundOf`.
 *
 * @param userSpec - Declared spec from `package.json`.
 * @param requiredRange - Required range expression to test against.
 * @returns `true` when the spec satisfies the range.
 */
export function satisfiesRange(
  userSpec: string,
  requiredRange: string,
): boolean {
  const userLower = lowerBoundOf(userSpec);
  if (userLower === null) return true; // Unparseable -> presence is accepted.
  const required = parseRequiredRange(requiredRange);
  if (required.length === 0) return true;
  return required.some((alt) => satisfiesAlternative(userLower, alt));
}

export { formatInstallCommand };

/**
 * Validate that required peer dependencies (`react`, `react-dom`,
 * `tailwindcss`) are present and satisfy the supported ranges.
 *
 * Produces a `pass` result when every entry in
 * {@link REQUIRED_PEER_DEPENDENCIES} is installed at a compatible
 * version, otherwise a `fail` result with a `fix` field containing
 * the install commands to run.
 *
 * @param options - {@link DoctorOptions} containing the working directory.
 * @returns A {@link DoctorCheckResult} describing the outcome.
 */
export async function checkPeerDependencies(
  options: DoctorOptions,
): Promise<DoctorCheckResult> {
  const cwd = options.cwd;
  const pm = await detectPackageManager(cwd);
  const pkg = await readJson(join(cwd, "package.json"));

  if (!pkg) {
    return {
      id: "peer-deps",
      title: "Peer dependencies",
      status: "fail",
      message: "Could not find package.json in the project root.",
      fix: "Run `asheeui doctor` from your project root directory.",
    };
  }

  const deps: Record<string, string> = {
    ...(pkg.dependencies as Record<string, string> | undefined),
    ...(pkg.devDependencies as Record<string, string> | undefined),
  };

  const missingRequired: string[] = [];
  const missingDevRequired: string[] = [];
  const wrongVersions: string[] = [];
  const problems: string[] = [];
  const fixes: string[] = [];

  for (const dep of REQUIRED_PEER_DEPENDENCIES) {
    const installedSpec = deps[dep.name];
    if (!installedSpec) {
      (dep.dev ? missingDevRequired : missingRequired).push(dep.name);
      continue;
    }
    if (!satisfiesRange(installedSpec, dep.range)) {
      wrongVersions.push(
        `${dep.name} (installed: ${installedSpec}, required: ${dep.range})`,
      );
    }
  }

  if (missingRequired.length > 0) {
    problems.push(
      `${missingRequired.join(" and ")} ${
        missingRequired.length > 1 ? "are" : "is"
      } missing`,
    );
    fixes.push(formatInstallCommand(pm, missingRequired));
  }

  if (missingDevRequired.length > 0) {
    problems.push(
      `${missingDevRequired.join(" and ")} ${
        missingDevRequired.length > 1 ? "are" : "is"
      } missing (required for styling setup)`,
    );
    fixes.push(formatInstallCommand(pm, missingDevRequired, true));
  }

  if (wrongVersions.length > 0) {
    problems.push(`unsupported versions: ${wrongVersions.join("; ")}`);
    fixes.push(
      "Update the listed packages to a supported version range (see messages above).",
    );
  }

  if (problems.length === 0) {
    return {
      id: "peer-deps",
      title: "Peer dependencies",
      status: "pass",
      message: "All required peer dependencies are installed.",
    };
  }

  return {
    id: "peer-deps",
    title: "Peer dependencies",
    status: "fail",
    message: `Problems found: ${problems.join("; ")}.`,
    fix: fixes.join(" / "),
  };
}

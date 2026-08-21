import { join } from "node:path";
import { detectPackageManager, readJson } from "../common/file-utils";
import type { PackageManager } from "../common/types";
import type { DoctorCheckResult, DoctorOptions } from "./types";

interface VersionParts {
  major: number;
  minor: number;
  patch: number;
}

interface RequiredRange {
  mode: "caret" | "tilde" | "gte" | "exact";
  min: VersionParts;
}

interface PeerDependencySpec {
  name: string;
  range: string;
  dev?: boolean;
  note?: string;
}

const REQUIRED_PEER_DEPENDENCIES: PeerDependencySpec[] = [
  { name: "react", range: "^18.0.0 || ^19.0.0" },
  { name: "react-dom", range: "^18.0.0 || ^19.0.0" },
  { name: "tailwindcss", range: ">=4.0.0 || ^3.0.0", dev: true },
];

const OPTIONAL_PEER_DEPENDENCIES: PeerDependencySpec[] = [
  {
    name: "framer-motion",
    range: "*",
    note: "motion/animation components (modal, carousel, drawer)",
  },
  {
    name: "@floating-ui/react",
    range: "*",
    note: "floating UI components (tooltip, popover)",
  },
];

// ---------------------------------------------------------------------------
// Semver helpers (kept intentionally small — no external dependency)
// ---------------------------------------------------------------------------

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
 * Returns the lowest version a declaration could resolve to.
 * Returns null for unparseable specs (`*`, `latest`, workspace:, file:, etc.)
 * so callers can treat mere presence as acceptable.
 */
export function lowerBoundOf(spec: string): VersionParts | null {
  const trimmed = spec.trim();
  if (trimmed === "" || trimmed === "*" || trimmed === "latest") return null;
  if (/^(workspace:|file:|link:|npm:)/.test(trimmed)) return null;
  return parseVersion(trimmed.replace(/^[\^~><=]+\s*/, ""));
}

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

function compareVersions(a: VersionParts, b: VersionParts): number {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  return a.patch - b.patch;
}

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
 * Checks whether a declared dependency spec (e.g. from package.json) is
 * compatible with a required semver range such as "^18.0.0 || ^19.0.0".
 */
export function satisfiesRange(
  userSpec: string,
  requiredRange: string,
): boolean {
  const userLower = lowerBoundOf(userSpec);
  if (userLower === null) return true; // Unparseable → presence is accepted.
  const required = parseRequiredRange(requiredRange);
  if (required.length === 0) return true;
  return required.some((alt) => satisfiesAlternative(userLower, alt));
}

export function formatInstallCommand(
  pm: PackageManager,
  packages: string[],
  dev = false,
): string {
  const devFlag = dev ? "-D " : "";
  switch (pm) {
    case "pnpm":
      return `pnpm add ${devFlag}${packages.join(" ")}`.trimEnd();
    case "yarn":
      return `yarn add ${devFlag}${packages.join(" ")}`.trimEnd();
    case "bun":
      return `bun add ${devFlag}${packages.join(" ")}`.trimEnd();
    case "npm":
      return `npm install ${devFlag}${packages.join(" ")}`.trimEnd();
  }
}

/**
 * Validates that required peer dependencies (react, react-dom, tailwindcss)
 * are present and satisfied, and surfaces optional-but-recommended packages.
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

  const missingOptional = OPTIONAL_PEER_DEPENDENCIES.filter(
    (dep) => !deps[dep.name],
  );
  const optionalProblems = missingOptional.map(
    (dep) => `${dep.name} is optional but recommended for ${dep.note}`,
  );
  const optionalFixes = missingOptional.map((dep) =>
    formatInstallCommand(pm, [dep.name]),
  );

  if (problems.length === 0 && optionalProblems.length === 0) {
    return {
      id: "peer-deps",
      title: "Peer dependencies",
      status: "pass",
      message: "All required peer dependencies are installed.",
    };
  }

  const status: DoctorCheckResult["status"] =
    problems.length > 0 ? "fail" : "warn";
  const message =
    problems.length > 0
      ? `Problems found: ${problems.join("; ")}.${
          optionalProblems.length > 0
            ? ` Optional packages missing: ${optionalProblems.join("; ")}`
            : ""
        }`
      : `Required dependencies are installed, but optional packages are missing: ${optionalProblems.join("; ")}.`;

  return {
    id: "peer-deps",
    title: "Peer dependencies",
    status,
    message,
    fix: [...fixes, ...optionalFixes].join(" / "),
  };
}

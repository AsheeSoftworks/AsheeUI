import { execSync } from "node:child_process";
import { join } from "node:path";
import {
  containsStylesImport,
  findAsheeConfigFile,
  findGlobalCssFile,
} from "../../utils/audit";
import { detectFramework } from "../common/detect";
import {
  applyEdit,
  applyWrite,
  detectPackageManager,
  pathExists,
  readJson,
  readTextFile,
  writeFileWithDirs,
} from "../common/file-utils";
import { formatInstallCommand } from "../common/pm";
import { detectProjectStructure } from "../common/structure";
import { REQUIRED_PEER_DEPENDENCIES } from "../doctor/check-deps";
import { runDoctorChecks } from "../doctor/doctor";
import type { DoctorCheckResult } from "../doctor/types";
import { defaultConfigContent } from "../init/templates";
import { buildIntegration } from "../integration/index";

/**
 * Status of a single fix attempt.
 *
 * - `fixed`: the CLI repaired the issue automatically.
 * - `already`: the project was already correct, no changes applied.
 * - `manual`: the CLI cannot fix the issue; a human action is required.
 * - `info`: an informational finding (no actionable change).
 */
export type FixStatus = "fixed" | "already" | "manual" | "info";

/**
 * Result of attempting to repair a single doctor check.
 */
export interface FixOutcome {
  /** Doctor check identifier this outcome corresponds to. */
  id: string;
  /** Human-readable title reused from the original check. */
  title: string;
  /** Outcome category. */
  status: FixStatus;
  /** Human-readable description of what happened. */
  message: string;
}

/** Options accepted by {@link runFix}. */
export interface FixOptions {
  /** Project directory to operate on (defaults to `process.cwd()`). */
  cwd?: string;
  /** Skip running package-manager installs (pure file transforms only). */
  skipInstall?: boolean;
}

/**
 * Aggregated result returned by {@link runFix}.
 */
export interface FixResult {
  /** Project directory that was operated on. */
  cwd: string;
  /** Per-check outcomes in the order they were attempted. */
  outcomes: FixOutcome[];
  /** Doctor checks that still fail (or warn) after fixing. */
  remaining: DoctorCheckResult[];
}

const FIX_ORDER = ["config", "css", "provider", "peer-deps"] as const;

interface Pkg {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

/**
 * Attempt to automatically repair every doctor-check failure in `cwd`.
 *
 * The fix order is fixed:
 * 1. `config` (write `asheeui.config.*` when missing).
 * 2. `css` (inject `@import "asheeui/styles";` into the global stylesheet).
 * 3. `provider` (re-run the integration flow to wrap the app root).
 * 4. `peer-deps` (install missing runtime/dev dependencies).
 *
 * After all fixes are attempted, doctor is re-run so the result can
 * report any checks that still need manual intervention.
 *
 * @param options - Optional {@link FixOptions} overriding cwd or
 *   suppressing package-manager installs.
 * @returns A {@link FixResult} describing every attempted fix and the
 *   checks that still need attention.
 *
 * @example
 * ```ts
 * const result = await runFix({ skipInstall: true });
 * for (const outcome of result.outcomes) {
 *   console.log(`${outcome.title}: ${outcome.status}`);
 * }
 * ```
 */
export async function runFix(options: FixOptions = {}): Promise<FixResult> {
  const cwd = options.cwd ?? process.cwd();
  const skipInstall = options.skipInstall ?? false;
  const initial = await runDoctorChecks({ cwd });
  const checkById = new Map(initial.map((check) => [check.id, check]));

  const outcomes: FixOutcome[] = [];

  for (const id of FIX_ORDER) {
    const check = checkById.get(id);
    if (!check) continue;
    outcomes.push(await runSingleFix(check, { cwd, skipInstall }));
  }

  // Re-run diagnostics to surface anything that still needs manual work.
  const after = await runDoctorChecks({ cwd });
  const remaining = after.filter(
    (result) => result.status === "fail" || result.status === "warn",
  );

  return { cwd, outcomes, remaining };
}

/**
 * Dispatch a single doctor check to the appropriate fix helper.
 *
 * Returns an `info` outcome for theme-augmentation (which is informational
 * only) and a `manual` outcome for unknown check ids.
 *
 * @param check - Doctor check to repair.
 * @param opts - Shared fix options (cwd, skipInstall).
 * @returns A {@link FixOutcome} describing what was done.
 */
async function runSingleFix(
  check: DoctorCheckResult,
  opts: { cwd: string; skipInstall: boolean },
): Promise<FixOutcome> {
  switch (check.id) {
    case "config":
      return fixConfig(check, opts.cwd);
    case "css":
      return fixCss(check, opts.cwd);
    case "provider":
      return fixProvider(check, opts);
    case "peer-deps":
      return fixPeerDependencies(check, opts);
    case "theme-augmentation":
      return {
        id: check.id,
        title: check.title,
        status: "info",
        message: check.message,
      };
    default:
      return {
        id: check.id,
        title: check.title,
        status: "manual",
        message: check.fix ?? check.message,
      };
  }
}

/**
 * Fix the `config` doctor check by creating an `asheeui.config.*` file
 * with default options when none exists.
 *
 * @param check - The doctor check result to act on.
 * @param cwd - Project directory to operate in.
 * @returns A {@link FixOutcome}: `already` when a config already exists,
 *   `fixed` after writing a default config, or `manual` on failure.
 */
async function fixConfig(
  check: DoctorCheckResult,
  cwd: string,
): Promise<FixOutcome> {
  if (check.status === "pass") {
    return {
      id: check.id,
      title: check.title,
      status: "already",
      message: check.message,
    };
  }

  const existing = findAsheeConfigFile(cwd);
  if (existing) {
    return {
      id: check.id,
      title: check.title,
      status: "already",
      message: `asheeui config already present at ${existing}.`,
    };
  }

  const isTypeScript = await pathExists(join(cwd, "tsconfig.json"));
  const configName = isTypeScript ? "asheeui.config.ts" : "asheeui.config.js";
  const configPath = join(cwd, configName);
  const content = defaultConfigContent(
    isTypeScript ? "typescript" : "javascript",
  );

  try {
    await writeFileWithDirs(configPath, content);
    return {
      id: check.id,
      title: check.title,
      status: "fixed",
      message: `Created ${configName} with default options.`,
    };
  } catch (err) {
    return {
      id: check.id,
      title: check.title,
      status: "manual",
      message: `Could not create ${configName}: ${(err as Error).message}`,
    };
  }
}

/**
 * Fix the `css` doctor check by injecting `@import "asheeui/styles";`
 * into the first conventional global stylesheet when it is missing.
 *
 * @param check - The doctor check result to act on.
 * @param cwd - Project directory to operate in.
 * @returns A {@link FixOutcome}: `already` when the import is present,
 *   `fixed` after injection, or `manual` when no stylesheet exists.
 */
async function fixCss(
  check: DoctorCheckResult,
  cwd: string,
): Promise<FixOutcome> {
  if (check.status === "pass") {
    return {
      id: check.id,
      title: check.title,
      status: "already",
      message: check.message,
    };
  }

  const cssPath = await findGlobalCssFile(cwd);
  if (cssPath) {
    const content = await readTextFile(cssPath);
    if (content !== null && containsStylesImport(content)) {
      return {
        id: check.id,
        title: check.title,
        status: "already",
        message: `asheeui styles import already present in ${cssPath}.`,
      };
    }
    if (content !== null) {
      try {
        await writeFileWithDirs(cssPath, injectStylesImport(content));
        return {
          id: check.id,
          title: check.title,
          status: "fixed",
          message: `Added @import "asheeui/styles"; to ${cssPath}.`,
        };
      } catch (err) {
        return {
          id: check.id,
          title: check.title,
          status: "manual",
          message: `Could not update ${cssPath}: ${(err as Error).message}`,
        };
      }
    }
  }

  // No conventional CSS entry file: create one (src/index.css).
  const target = join(cwd, "src", "index.css");
  try {
    await writeFileWithDirs(
      target,
      `@import "tailwindcss";\n@import "asheeui/styles";\n`,
    );
    return {
      id: check.id,
      title: check.title,
      status: "fixed",
      message:
        "Created src/index.css with tailwindcss + asheeui styles imports. Manual step: import it from your application entrypoint if it is not already imported.",
    };
  } catch (err) {
    return {
      id: check.id,
      title: check.title,
      status: "manual",
      message: `Could not create src/index.css: ${(err as Error).message}`,
    };
  }
}

/**
 * Insert `@import "asheeui/styles";` into a CSS file right after the
 * tailwindcss import when one exists, or at the top of the file when
 * there is no tailwindcss import.
 *
 * The operation is idempotent: content that already imports asheeui
 * styles is returned unchanged.
 *
 * @param content - Original CSS file content.
 * @returns The updated CSS content.
 *
 * @example
 * ```ts
 * injectStylesImport('@import "tailwindcss";\nbody { color: red; }');
 * // -> '@import "tailwindcss";\n@import "asheeui/styles";\nbody { color: red; }'
 * ```
 */
export function injectStylesImport(content: string): string {
  if (containsStylesImport(content)) return content;
  const tailwind = /@import\s+["']tailwindcss["']\s*;?/.exec(content);
  if (tailwind) {
    const at = tailwind.index + tailwind[0].length;
    return `${content.slice(0, at)}\n@import "asheeui/styles";${content.slice(at)}`;
  }
  return `@import "tailwindcss";\n@import "asheeui/styles";\n${content}`;
}

/**
 * Fix the `provider` doctor check by re-running the framework
 * integration flow (config, CSS, plugin, and root-provider wiring).
 *
 * @param check - The doctor check result to act on.
 * @param opts - Shared fix options (cwd, skipInstall).
 * @returns A {@link FixOutcome}: `already` when no changes were needed,
 *   `fixed` after applying integration changes, or `manual` when the
 *   framework cannot be detected.
 */
async function fixProvider(
  check: DoctorCheckResult,
  opts: { cwd: string; skipInstall: boolean },
): Promise<FixOutcome> {
  const { cwd } = opts;
  if (check.status === "pass") {
    return {
      id: check.id,
      title: check.title,
      status: "already",
      message: check.message,
    };
  }

  const detection = await detectFramework({ cwd });
  if (detection.framework === "unknown") {
    return {
      id: check.id,
      title: check.title,
      status: "manual",
      message:
        "Could not detect a supported framework (Next.js, Vite + React or TanStack Start). " +
        (check.fix ??
          "Wrap your application root with <AsheeUIProvider> manually."),
    };
  }

  const structure = await detectProjectStructure({
    cwd,
    framework: detection.framework,
  });
  const integration = await buildIntegration({
    directory: cwd,
    framework: detection.framework,
    structure,
  });

  let applied = 0;

  // Create any missing default files first (config creation is idempotent).
  for (const write of integration.fileWrites) {
    if (await pathExists(write.path)) continue;
    const result = await applyWrite(write);
    if (result.success) applied++;
  }

  for (const edit of integration.fileEdits) {
    const result = await applyEdit(edit);
    if (result.success && !result.skipped) applied++;
  }

  if (applied === 0) {
    return {
      id: check.id,
      title: check.title,
      status: "already",
      message: "Provider setup is already in place; nothing to apply.",
    };
  }

  return {
    id: check.id,
    title: check.title,
    status: "fixed",
    message: `Applied ${applied} integration change(s) for ${detection.framework} (config/CSS/provider/plugin). Re-run doctor to confirm.`,
  };
}

/**
 * Fix the `peer-deps` doctor check by installing every missing runtime
 * or dev peer dependency with the detected package manager.
 *
 * When `skipInstall` is `true`, no install command is executed; instead
 * a `manual` outcome lists the exact commands the user should run.
 *
 * @param check - The doctor check result to act on.
 * @param opts - Shared fix options (cwd, skipInstall).
 * @returns A {@link FixOutcome}: `already` when nothing is missing,
 *   `fixed` after a successful install, or `manual` on failure or when
 *   installs are disabled.
 */
async function fixPeerDependencies(
  check: DoctorCheckResult,
  opts: { cwd: string; skipInstall: boolean },
): Promise<FixOutcome> {
  const { cwd, skipInstall } = opts;
  if (check.status === "pass") {
    return {
      id: check.id,
      title: check.title,
      status: "already",
      message: check.message,
    };
  }

  const pkg = (await readJson(join(cwd, "package.json"))) as Pkg | null;
  if (!pkg) {
    return {
      id: check.id,
      title: check.title,
      status: "manual",
      message: check.fix ?? check.message,
    };
  }

  const deps: Record<string, string> = {
    ...(pkg.dependencies ?? {}),
    ...(pkg.devDependencies ?? {}),
  };

  const missingRuntime = REQUIRED_PEER_DEPENDENCIES.filter(
    (dep) => !dep.dev && !deps[dep.name],
  ).map((dep) => dep.name);
  const missingDev = REQUIRED_PEER_DEPENDENCIES.filter(
    (dep) => dep.dev && !deps[dep.name],
  ).map((dep) => dep.name);

  if (missingRuntime.length === 0 && missingDev.length === 0) {
    return {
      id: check.id,
      title: check.title,
      status: "already",
      message: "All required peer dependencies are installed.",
    };
  }

  if (skipInstall) {
    const pm = await detectPackageManager(cwd);
    const commands = [
      missingRuntime.length > 0 ? formatInstallCommand(pm, missingRuntime) : "",
      missingDev.length > 0 ? formatInstallCommand(pm, missingDev, true) : "",
    ].filter(Boolean);
    return {
      id: check.id,
      title: check.title,
      status: "manual",
      message: `Missing peer dependencies. Install them manually:\n${commands
        .map((command) => `  ${command}`)
        .join("\n")}`,
    };
  }

  try {
    const pm = await detectPackageManager(cwd);
    if (missingRuntime.length > 0) {
      execSync(formatInstallCommand(pm, missingRuntime), {
        cwd,
        stdio: "inherit",
      });
    }
    if (missingDev.length > 0) {
      execSync(formatInstallCommand(pm, missingDev, true), {
        cwd,
        stdio: "inherit",
      });
    }
    return {
      id: check.id,
      title: check.title,
      status: "fixed",
      message: `Installed missing peer dependencies with ${pm}.`,
    };
  } catch (err) {
    return {
      id: check.id,
      title: check.title,
      status: "manual",
      message: `Automatic install failed: ${(err as Error).message}`,
    };
  }
}

/**
 * AsheeUI CLI shared types.
 * This file defines all shared type interfaces used across the CLI modules,
 * including framework detection, project structure, file operations, and
 * integration results.
 */

/**
 * Supported framework identifiers detected or selected by the CLI.
 *
 * - `next`: Next.js application.
 * - `vite-react`: A Vite-powered React SPA.
 * - `tanstack-start`: A TanStack Start application.
 * - `unknown`: No framework could be detected automatically; the CLI
 *   will prompt the user to pick one.
 */
export type Framework = "next" | "vite-react" | "tanstack-start" | "unknown";

/**
 * A {@link Framework} that the CLI knows how to integrate with.
 *
 * Excludes the `unknown` sentinel used while awaiting user input.
 */
export type SupportedFramework = Exclude<Framework, "unknown">;

/**
 * Confidence level reported alongside a {@link FrameworkDetection}.
 *
 * - `high`: a strong, unambiguous signal was found.
 * - `medium`: the framework was identified but no canonical config file
 *   could be confirmed.
 * - `low`: only weak evidence was located.
 */
export type FrameworkConfidence = "high" | "medium" | "low";

/** Primary source language detected in the target project. */
export type Language = "typescript" | "javascript";

/** Which Next.js router is being used in the project. */
export type NextRouter = "app" | "pages";

/**
 * Supported JavaScript package managers.
 *
 * Used by the `init` and `fix` commands to format install commands.
 */
export type PackageManager = "pnpm" | "yarn" | "npm" | "bun";

/**
 * Outcome of a framework detection pass.
 */
export interface FrameworkDetection {
  /** Detected framework (may be `"unknown"`). */
  framework: Framework;
  /** Confidence level for the detection. */
  confidence: FrameworkConfidence;
  /** Human-readable evidence strings collected during detection. */
  evidence: string[];
}

/**
 * Snapshot of the structural layout of a detected project.
 */
export interface ProjectStructure {
  /** Absolute path of the project's entry/layout file, or `null` if unknown. */
  entryPoint: string | null;
  /** Primary source language of the project. */
  language: Language;
  /** Next.js router variant when the project uses Next.js, otherwise `null`. */
  nextRouter: NextRouter | null;
  /** True when a Tailwind configuration was detected. */
  hasTailwind: boolean;
  /** True when a conventional global stylesheet was detected. */
  hasGlobalCss: boolean;
}

/**
 * Full description of a project after framework detection and structure
 * analysis have both completed.
 */
export interface DetectedProject {
  /** Absolute path of the project directory. */
  directory: string;
  /** Raw framework detection result. */
  detection: FrameworkDetection;
  /** Project structure snapshot. */
  structure: ProjectStructure;
}

/**
 * Inputs required by every per-framework integration builder.
 */
export interface IntegrationContext {
  /** Absolute path of the project being integrated. */
  directory: string;
  /** Framework chosen for the integration. */
  framework: SupportedFramework;
  /** Pre-computed project structure snapshot. */
  structure: ProjectStructure;
}

/**
 * User-supplied options for the `init` command.
 */
export interface InitOptions {
  /** Template name to apply. */
  template: string;
  /** When true, skip interactive prompts and accept defaults. */
  yes: boolean;
}

/**
 * Summary of everything the `init` command did to the project.
 */
export interface InitResult {
  /** Framework that was integrated. */
  framework: SupportedFramework;
  /** Absolute paths of files that were newly created. */
  filesCreated: string[];
  /** Absolute paths of files that were modified in place. */
  filesModified: string[];
  /** Package names that were installed by the command. */
  dependenciesInstalled: string[];
}

/**
 * Post-write verification that a project file contains an expected snippet.
 */
export interface IntegrityCheck {
  /** Project-relative path of the file to verify. */
  projectRelativeFile: string;
  /** Substring expected to exist inside the file. */
  pattern: string;
  /** Human-readable description of what was checked. */
  message: string;
}

/**
 * Descriptor for a brand-new file the CLI should write to disk.
 */
export interface FileWrite {
  /** Absolute path of the file to create. */
  path: string;
  /** File contents to write. */
  content: string;
  /** Optional human-readable description used in CLI output. */
  description?: string;
}

/**
 * Descriptor for a search/replace edit the CLI should apply to an
 * existing file. All edits are idempotent via {@link skipIfContentIncludes}.
 */
export interface FileEdit {
  /** Absolute path of the file to edit. */
  path: string;
  /** Substring to search for in the file. */
  search: string;
  /** Replacement text written in place of the match. */
  replace: string;
  /** When true, replace every occurrence; otherwise only the first. */
  all?: boolean;
  /** Custom error message when the search string is not found. */
  notFoundMessage?: string;
  /** Optional human-readable description used in CLI output. */
  description?: string;
  /**
   * Idempotency guard: when this substring already exists in the target
   * file, the edit is considered a successful no-op (it is skipped so the
   * content is never duplicated).
   */
  skipIfContentIncludes?: string;
}

/**
 * Aggregated description of every change an integration builder wants
 * the CLI to perform against a project.
 */
export interface IntegrationResult {
  /** File writes to perform. */
  fileWrites: FileWrite[];
  /** File edits to perform. */
  fileEdits: FileEdit[];
  /** Post-write integrity checks to run. */
  integrityChecks: IntegrityCheck[];
  /** Packages the integration expects to be installed. */
  dependenciesToInstall: string[];
  /** Human-readable summary lines for CLI output. */
  summary: string[];
}

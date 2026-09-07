/**
 * Doctor types for AsheeUI CLI.
 * This file defines the types used by the doctor command for check results
 * and options.
 */

/**
 * Severity level reported by a single doctor check.
 *
 * - `pass`: everything is fine.
 * - `warn`: the project still works but something looks off.
 * - `fail`: the project is broken and the CLI can likely fix it.
 * - `info`: an informational finding with no action required.
 */
export type DoctorStatus = "pass" | "warn" | "fail" | "info";

/**
 * Result of a single doctor check.
 */
export interface DoctorCheckResult {
  /** Unique identifier used for grouping and `fix` lookup. */
  id: string;
  /** Short human-readable title shown in CLI output. */
  title: string;
  /** Severity of the finding. */
  status: DoctorStatus;
  /** Human-readable description of what was detected. */
  message: string;
  /** Optional suggested fix command or instruction. */
  fix?: string;
}

/** Common options shared by every doctor check. */
export interface DoctorOptions {
  /** Project directory the checks should operate on. */
  cwd: string;
}

/**
 * Report a single write/edit result in the CLI output and collect failures.
 *
 * Successful file paths are recorded for the final `InitResult`; edits
 * that were skipped because their content already existed are reported
 * as such (and are *not* counted as modified files, preserving
 * idempotency).
 *
 * @param result - Outcome of an `applyWrite` or `applyEdit` call.
 * @param failures - Mutable list of human-readable failure descriptions.
 * @param successfulFiles - Mutable list of successfully touched files.
 * @param cwd - Project root used to strip absolute paths in CLI output.
 * @returns Nothing; output is written to `process.stdout`.
 */
export function reportResult(
  result: {
    success: boolean;
    path: string;
    actionDescription: string;
    error?: string;
    skipped?: boolean;
  },
  failures: string[],
  successfulFiles: string[],
  cwd: string,
): void {
  const relativePath = result.path.replace(`${cwd}/`, "");

  if (result.success && result.skipped) {
    console.log(`  - ${result.actionDescription} - already configured`);
    return;
  }

  if (result.success) {
    successfulFiles.push(relativePath);
    console.log(`  ✓ ${result.actionDescription}`);
  } else {
    const reason = result.error ?? "Unknown error";
    failures.push(`• ${relativePath}: ${reason}`);
    console.log(`  x ${result.actionDescription} - ${relativePath}`);
    console.log(`    ${reason}`);
  }
}

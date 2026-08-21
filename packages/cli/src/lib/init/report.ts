/**
 * Report a single write/edit result in the CLI output and collect failures.
 * Successful file paths are recorded for the final `InitResult`.
 */
export function reportResult(
  result: {
    success: boolean;
    path: string;
    actionDescription: string;
    error?: string;
  },
  failures: string[],
  successfulFiles: string[],
  cwd: string,
): void {
  const relativePath = result.path.replace(`${cwd}/`, "");

  if (result.success) {
    successfulFiles.push(relativePath);
    console.log(`  ✓ ${result.actionDescription}`);
  } else {
    const reason = result.error ?? "Unknown error";
    failures.push(`• ${relativePath}: ${reason}`);
    console.log(`  ▲ ${result.actionDescription} — ${relativePath}`);
    console.log(`    ${reason}`);
  }
}

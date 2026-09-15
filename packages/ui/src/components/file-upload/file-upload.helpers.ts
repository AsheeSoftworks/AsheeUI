/**
 * FileUpload component helpers for AsheeUI.
 * This file provides the small pure functions the file field needs: reporting a
 * file size in the reader's terms and describing what the field rejected.
 */

/**
 * Describe a file size in the reader's terms.
 *
 * @param bytes - The size in bytes.
 * @returns A short description, such as `1.5 MB`.
 *
 * @example
 * ```tsx
 * formatFileSize(1536); // "1.5 KB"
 * ```
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;

  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }

  return `${Number(value.toFixed(1))} ${units[unit]}`;
}

/**
 * Describe the files a size limit left out.
 *
 * @param count - How many files were left out.
 * @param maxSize - The limit, in bytes.
 * @returns A sentence naming the count and the limit.
 */
export function describeRejectedFiles(count: number, maxSize: number): string {
  const files = count === 1 ? "One file was" : `${count} files were`;

  return `${files} larger than ${formatFileSize(maxSize)} and was not added.`;
}

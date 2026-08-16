import { relative } from "node:path";

export function relativeImport(fromFile: string, toFile: string): string {
  const fromDir = fromFile.replace(/\/[^/]+$/, "");
  let rel = relative(fromDir, toFile).replaceAll("\\", "/");
  if (!rel.startsWith(".")) rel = `./${rel}`;
  if (!rel.endsWith("/")) rel = rel.replace(/\.\w+$/, "");
  return rel;
}

export function buildConfigImport(fromFile: string): string {
  return relativeImport(fromFile, "asheeui-config.ts");
}

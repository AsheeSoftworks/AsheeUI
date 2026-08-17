import { existsSync } from "node:fs";
import { resolve } from "node:path";

export const CANDIDATES = [
  "asheeui.config.ts",
  "asheeui.config.mts",
  "asheeui.config.js",
  "asheeui.config.mjs",
  "asheeui-config.ts",
  "asheeui-config.mts",
  "asheeui-config.js",
  "asheeui-config.mjs",
] as const;

export function discoverConfig(root?: string): string | undefined {
  const base = root ?? process.cwd();
  return CANDIDATES.map((file) => resolve(base, file)).find(existsSync);
}

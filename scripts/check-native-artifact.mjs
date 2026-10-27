#!/usr/bin/env node
/**
 * Prove that the published native artifact emits its elements through NativeWind's runtime.
 *
 * This is the check that was missing. `@asheeui/native` ships compiled JavaScript, and
 * TypeScript's default JSX emit is `react/jsx-runtime`. A module compiled that way still
 * renders its components — it just never gives NativeWind the chance to turn a
 * `className` into a style, because NativeWind does not read `className` at runtime: its
 * Babel transform rewrites JSX, and a file that contains no JSX (because it was already
 * compiled) comes out of the consumer's Babel unchanged. The result is the worst kind of
 * defect: a correctly configured application, correct copy, correct structure, and every
 * framework component unstyled, with nothing thrown and nothing warned.
 *
 * The tests could not see it, because they compile the package's own sources — sources
 * contain JSX, so the test transform wraps it and the components are styled in tests while
 * being unstyled in a consumer's application. The fix is one compiler option
 * (`jsxImportSource: "nativewind"` in `tsconfig.build.json`); this check is the ratchet
 * that keeps it fixed, by reading the artifact rather than the source.
 *
 * It asserts two things about `packages/native/dist`:
 *
 * - no published module imports `react/jsx-runtime` or `react/jsx-dev-runtime`;
 * - at least one module imports the interop runtime (`nativewind/jsx-runtime`, or
 *   `react-native-css-interop/jsx-runtime` for a build that names the runtime directly).
 *
 * The second assertion matters as much as the first: a build that emitted no JSX at all
 * would pass a check that only forbade React's runtime.
 *
 * It reads build output, so build first:
 *
 * ```bash
 * pnpm --filter @asheeui/native build
 * pnpm check:native-artifact
 * ```
 *
 * Exit code 1 means a published module bypasses NativeWind, or the artifact contains no
 * element-producing module at all.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const NATIVE = join(ROOT, "packages", "native");
const DIST = join(NATIVE, "dist");

/** An element factory NativeWind never rewrites: the defect this check exists for. */
const REACT_RUNTIME = /from\s*["']react\/jsx(-dev)?-runtime["']/;

/** An element factory the styling pipeline does wrap. */
const INTEROP_RUNTIME =
  /from\s*["'](?:nativewind|react-native-css-interop)\/jsx(-dev)?-runtime["']/;

/**
 * Every file under `directory`, recursively.
 *
 * @param directory - Absolute path to walk.
 * @returns Absolute paths of the files below it.
 */
function walk(directory) {
  const files = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const full = join(directory, entry.name);

    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }

  return files;
}

if (!existsSync(DIST)) {
  console.error(
    "Native artifact: packages/native/dist does not exist. Build first:\n\n  pnpm --filter @asheeui/native build\n",
  );
  process.exit(1);
}

const modules = walk(DIST).filter((file) => file.endsWith(".js"));
const offenders = [];
let wrapped = 0;

for (const file of modules) {
  const source = readFileSync(file, "utf8");

  if (REACT_RUNTIME.test(source)) {
    offenders.push(relative(ROOT, file));
  }

  if (INTEROP_RUNTIME.test(source)) {
    wrapped += 1;
  }
}

if (offenders.length > 0) {
  console.error(
    `Native artifact: ${offenders.length} of ${modules.length} published module(s) emit elements through React's own JSX runtime, so NativeWind never sees their \`className\` and every component in them renders unstyled.\n`,
  );

  for (const offender of offenders.slice(0, 20)) {
    console.error(`  ${offender}`);
  }

  if (offenders.length > 20) {
    console.error(`  … and ${offenders.length - 20} more`);
  }

  console.error(
    '\nThe build states the runtime with `jsxImportSource: "nativewind"` in packages/native/tsconfig.build.json. A module compiled without it emits `react/jsx-runtime`, which is the whole defect.',
  );
  process.exit(1);
}

if (wrapped === 0) {
  console.error(
    `Native artifact: none of the ${modules.length} published module(s) emit elements through the interop runtime, so something compiled without JSX at all — check that \`jsx\` is still \`react-jsx\` in packages/native/tsconfig.build.json.\n`,
  );
  process.exit(1);
}

console.log(
  `Native artifact: ${modules.length} module(s), ${wrapped} emitting through the interop runtime, none through React's own.`,
);

#!/usr/bin/env node
/**
 * Generate the umbrella's two entries from one list.
 *
 * `asheeui` is a router: the bundler picks `src/index.ts` for the web and
 * `src/index.native.ts` for a device. B19 declared what the package may offer behind that
 * router in `PORTABLE_API`; this script turns that declaration into the two files, so a
 * name that is portable is exported by both branches and a name that is not is exported by
 * neither. A mismatch is not expressible rather than merely tested for.
 *
 * It parses the array literal instead of importing it: this is plain Node, and
 * `packages/core/src/portable.ts` is TypeScript. The list is deliberately flat so that
 * `/\{([^{}]*)\}/g` sees every entry — see the module documentation in `portable.ts`.
 *
 * The output is deterministic: names are sorted within each group, every group is emitted
 * in the same order, and running the script twice leaves `git diff` empty. The only lines
 * not derived from the list are in the marked platform-specific section at the end
 * (`AsheeConfig`), because the two branches spell that type with their own renderer's.
 *
 * Usage:
 *
 *   node scripts/generate-umbrella.mjs
 *   node scripts/generate-umbrella.mjs --check   # write nothing; fail on a stale entry
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PORTABLE_FILE = join(ROOT, "packages/core/src/portable.ts");
const UI_DIRECTORY = join(ROOT, "packages/ui");

/** Where the declared surface's array literal begins in its source file. */
const PORTABLE_ARRAY = /PORTABLE_API[^=]*=\s*\[([\s\S]*?)\n\];/;

const KINDS = [
  "component",
  "provider",
  "hook",
  "helper",
  "type",
  "constant",
];
const SOURCES = ["core", "renderer"];

/**
 * Read the declared portable surface.
 *
 * `pending` is read separately because it is an array, not a string property. The parser is
 * the same one `scripts/check-umbrella.mjs` uses, so the two cannot disagree about what the
 * list says.
 *
 * @returns Every entry, in source order.
 */
function readPortableApi() {
  const array = readFileSync(PORTABLE_FILE, "utf8").match(PORTABLE_ARRAY)?.[1];
  if (!array) {
    throw new Error(
      "generate-umbrella: PORTABLE_API could not be read from packages/core/src/portable.ts",
    );
  }

  return [...array.matchAll(/\{([^{}]*)\}/g)].map((match) => {
    const entry = {};
    for (const property of match[1].matchAll(/(\w+):\s*"([^"]*)"/g)) {
      entry[property[1]] = property[2];
    }
    const pending = match[1].match(/pending:\s*\[([^\]]*)\]/);
    entry.pending = pending
      ? [...pending[1].matchAll(/"([^"]+)"/g)].map((item) => item[1])
      : [];
    return entry;
  });
}

/**
 * A comment block, indented for the file it is written into.
 *
 * @param lines - The comment's lines, without the delimiters.
 * @returns The block, newline-terminated.
 */
function comment(lines) {
  return `/**\n${lines.map((line) => ` * ${line}`.trimEnd()).join("\n")}\n */\n`;
}

/**
 * One export statement, wrapped at the width the repository formats to.
 *
 * A group that fits on one line is written on one line; a longer one puts a name on each
 * line with a trailing comma, which is what the formatter would do and what keeps a diff
 * to the name that changed.
 *
 * @param verb - The export verb (`export ` or `export type `).
 * @param names - The names to export.
 * @param from - The package they are imported from.
 * @returns The statement, newline-terminated.
 */
function statement(verb, names, from) {
  const head = `${verb}{`;
  const tail = `} from "${from}";`;
  const oneLine = `${head} ${names.join(", ")} ${tail}`;

  if (oneLine.length <= 80) return `${oneLine}\n`;

  return `${head}\n${names.map((name) => `  ${name},`).join("\n")}\n${tail}\n`;
}

/**
 * The header every generated entry shares.
 *
 * @param branch - `web` or `native`, for the routing sentence.
 * @returns The comment block.
 */
function header(branch) {
  const side = branch === "web" ? "the browser" : "a device";
  return comment([
    `The AsheeUI umbrella package, ${branch} branch.`,
    "",
    "GENERATED FILE — do not edit. This entry is written from PORTABLE_API in",
    "packages/core/src/portable.ts by scripts/generate-umbrella.mjs, and the other",
    "branch from the same list, so the two cannot drift: a name that is portable is",
    "exported by both, and a name that is not is exported by neither.",
    "",
    `The bundler reaches this file for ${side}. It re-exports the portable surface and`,
    "nothing else, which is what keeps a shared file compiling on both platforms. The",
    "names cross a package boundary rather than a runtime check, so an import that is",
    "not on the list is a compile error on the platform that lacks it.",
    "",
    "Edit the list, then run `node scripts/generate-umbrella.mjs` (or",
    "`pnpm --filter asheeui build`, which runs it first).",
  ]);
}

/**
 * The platform-specific tail: the only lines the list does not derive.
 *
 * @param branch - `web` or `native`.
 * @returns The section, newline-terminated.
 */
function platformSection(branch) {
  const lines = [
    comment([
      "Platform-specific section.",
      "",
      "These are the only hand-written lines in the file. `AsheeConfig` is the",
      "configuration type of the renderer this branch resolves to; both branches spell it",
      "the same so one configuration file can be typed on either platform, and the two",
      "describe the same axes with the options the platform actually has.",
    ]),
    branch === "web"
      ? "export type AsheeConfig = ExternalConfig;\n"
      : 'export type { AsheeConfig } from "@asheeui/native";\n',
  ];

  return lines.join("\n");
}

/**
 * Emit one branch's entry.
 *
 * @param entries - The declared surface.
 * @param branch - `web` or `native`.
 * @returns The file's text.
 */
function render(entries, branch) {
  const renderer = branch === "web" ? "@asheeui/web" : "@asheeui/native";
  const ready = entries.filter((entry) => entry.pending.length === 0);
  const pending = entries.filter((entry) => entry.pending.length > 0);

  const values = (source) =>
    ready
      .filter((entry) => entry.source === source && entry.kind !== "type")
      .map((entry) => entry.name)
      .sort();
  const types = (source) =>
    ready
      .filter((entry) => entry.source === source && entry.kind === "type")
      .map((entry) => entry.name)
      .sort();

  const parts = [header(branch)];

  if (branch === "web") {
    // The resolver starts the module graph at the web renderer anyway, but the scrollbar
    // registration is a side effect of loading it. Stating the import makes that explicit,
    // so a future subpath split cannot silently drop it.
    parts.push('"use client";\n\nimport "@asheeui/web";\n');
    parts.push('import type { ExternalConfig } from "@asheeui/core";\n');
  } else {
    parts.push('');
  }

  parts.push(
    [
      comment([
        "The renderer's values: every component, provider and hook, plus the helpers and",
        "constants the renderer owns.",
      ]),
      statement("export ", values("renderer"), renderer),
    ].join("\n"),
  );

  const coreValues = values("core");
  if (coreValues.length > 0) {
    parts.push(
      [
        comment([
          "Core's values: the cascade helpers and the constants both platforms share.",
        ]),
        statement("export ", coreValues, "@asheeui/core"),
      ].join("\n"),
    );
  }

  parts.push(
    [
      comment(["Core's types: the vocabulary both platforms name."]),
      statement("export type ", types("core"), "@asheeui/core"),
    ].join("\n"),
  );

  parts.push(
    [
      comment(["The renderer's types: the shapes its own components state."]),
      statement("export type ", types("renderer"), renderer),
    ].join("\n"),
  );

  if (pending.length > 0) {
    // The ratchet: a pending name is not emitted on either branch, consistently, so the
    // two entries stay equal while the work lands.
    parts.push(
      [
        comment([
          "Pending work, skipped on both branches:",
          ...pending.map(
            (entry) => `- ${entry.name} (${entry.pending.join(", ")})`,
          ),
        ]),
        "",
      ].join("\n"),
    );
  }

  parts.push(platformSection(branch));

  const body = parts.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd();
  return `${body}\n`;
}

const check = process.argv.includes("--check");
const entries = readPortableApi();

if (entries.length === 0) {
  console.error(
    "generate-umbrella: PORTABLE_API is empty, which would empty the umbrella.",
  );
  process.exit(1);
}

const invalid = entries.filter(
  (entry) =>
    !KINDS.includes(entry.kind) ||
    !SOURCES.includes(entry.source) ||
    !/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(entry.name),
);
if (invalid.length > 0) {
  console.error(
    "generate-umbrella: PORTABLE_API has entries the generator cannot route:",
  );
  for (const entry of invalid) {
    console.error(
      `  - ${entry.name ?? "(no name)"} (kind ${entry.kind ?? "missing"}, source ${entry.source ?? "missing"})`,
    );
  }
  process.exit(1);
}

/**
 * A component, provider or hook is the renderer's by definition.
 *
 * `source` is what makes the routing explicit; a component that declared `core` would
 * generate an import of a name core does not publish, and the guard would only find it
 * after the file had been written. Refusing here keeps the list honest instead.
 */
const misrouted = entries.filter(
  (entry) =>
    ["component", "provider", "hook"].includes(entry.kind) &&
    entry.source !== "renderer",
);
if (misrouted.length > 0) {
  console.error(
    "generate-umbrella: a component, provider or hook must be sourced from the renderer:",
  );
  for (const entry of misrouted)
    console.error(`  - ${entry.name} (source ${entry.source})`);
  process.exit(1);
}

const outputs = [
  ["web", join(UI_DIRECTORY, "src/index.ts")],
  ["native", join(UI_DIRECTORY, "src/index.native.ts")],
].map(([branch, file]) => [branch, file, render(entries, branch)]);

if (check) {
  const stale = outputs.filter(
    ([, file, text]) => readFileSync(file, "utf8") !== text,
  );
  if (stale.length > 0) {
    console.error(
      `generate-umbrella: ${stale.map(([branch]) => branch).join(" and ")} entr${stale.length === 1 ? "y is" : "ies are"} stale. Run \`node scripts/generate-umbrella.mjs\`.`,
    );
    process.exit(1);
  }
  console.log(
    `generate-umbrella: both entries match PORTABLE_API (${entries.length} names).`,
  );
  process.exit(0);
}

for (const [branch, file, text] of outputs) {
  writeFileSync(file, text);
  const count = text.match(/^ {2}[A-Za-z_$][A-Za-z0-9_$]*,$/gm)?.length ?? 0;
  console.log(
    `generate-umbrella: wrote ${branch} (${file.replace(ROOT, "").replaceAll("\\", "/")}), ${count} exported names.`,
  );
}

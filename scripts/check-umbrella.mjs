#!/usr/bin/env node
/**
 * Umbrella drift report.
 *
 * `asheeui` is a router: one entry for the web branch, one for the device, and the
 * bundler decides which one an import reaches. That mechanism is sound and does not
 * need to change. What the umbrella *offers* behind it is the problem: both entries
 * used to be `export *` over a whole renderer, so the package offered 791 names on the
 * web branch and 1053 on the native one, and a shared component written against the
 * smaller number of imports compiled and then found `undefined` on the device.
 *
 * `UMBRELLA-REPORT.md` states the target — a declared portable surface, generated into
 * both entries, set-equal by construction — and `§6` states six assertions that say
 * whether the target has been reached. This script evaluates those six and reports what
 * it finds. B19 wrote `packages/core/src/portable.ts`, so assertions 2–4 now compare
 * against real declarations; B20 generates the entries from that list; B21 makes the
 * guard blocking. Until B21 the exit code stays 0 in report mode, because a guard wired
 * into CI before the work it guards would only be switched off.
 *
 * ## The declared `source` (a documented extension of §3.2)
 *
 * §3.2's shape says what is portable but not where a name lives, and the generator needs
 * to route every name to a package. B19 added `source: "core" | "renderer"` and assertion 2
 * checks the declaration instead of assuming one rule: a `core` entry must be published by
 * `@asheeui/core`, and a `renderer` entry by both renderer entries. The cascade helpers and
 * the shared vocabulary are core's; `cn`, `resolveAnimate`, the hooks and every component
 * are the renderers'. The deviation is deliberate — routing `cn` from core would give the
 * umbrella a second implementation of it.
 *
 * Like the other guards, it reads the packages' own entry points and follows their
 * `export *` statements, so it asks what a package publishes rather than what its file
 * names suggest. Nothing here is imported, so the report cannot be a stale build.
 *
 * Usage:
 *
 *   node scripts/check-umbrella.mjs           # the six assertions, with the drift
 *   node scripts/check-umbrella.mjs --report  # the same; the default, stated explicitly
 *   node scripts/check-umbrella.mjs --list    # both branch surfaces, name by name
 *   node scripts/check-umbrella.mjs --json    # the same facts as data
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const UI_DIRECTORY = join(ROOT, "packages/ui");
const UMBRELLA_MANIFEST = join(UI_DIRECTORY, "package.json");
/**
 * The matrix is published as `@asheeui/core/dev` (C4), not from core's root entry, and this guard
 * reads its source for the same reason the parity guard does: the classification is data, and the
 * assertion is about the umbrella rather than about core's build.
 */
const MATRIX_FILE = join(ROOT, "packages/core/src/matrix.ts");
const PORTABLE_FILE = join(ROOT, "packages/core/src/portable.ts");

/** The two entries the manifest routes between. */
const BRANCHES = [
  ["web", join(UI_DIRECTORY, "src/index.ts")],
  ["native", join(UI_DIRECTORY, "src/index.native.ts")],
];

/** The published package each bare specifier in the umbrella's entries names. */
const PACKAGE_ENTRIES = new Map([
  ["@asheeui/core", join(ROOT, "packages/core/src/index.ts")],
  ["@asheeui/web", join(ROOT, "packages/web/src/index.ts")],
  ["@asheeui/native", join(ROOT, "packages/native/src/index.ts")],
]);

const FILE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];

/** A declaration that publishes one name. */
const DECLARATION =
  /^export\s+(?:declare\s+)?(?:async\s+)?(?:function|const|let|var|class|interface|type|enum)\s+([A-Za-z0-9_$]+)/gm;

/** A named export list, which may span lines. */
const NAMED_EXPORT = /^export\s+(?:type\s+)?\{([^}]*)\}/gm;

/** A star re-export, which is followed into the module it names. */
const STAR_EXPORT = /^export\s+\*\s+from\s+"([^"]+)"/gm;

/** A namespace re-export, which publishes one name. */
const STAR_AS_EXPORT = /^export\s+\*\s+as\s+([A-Za-z0-9_$]+)\s+from\s+/gm;

/** Where the matrix's array literal begins in its source file. */
const MATRIX_ARRAY = /COMPONENT_SUPPORT[^=]*=\s*\[([\s\S]*?)\n\];/;

/** Where the portable surface's array literal begins, once it exists. */
const PORTABLE_ARRAY = /PORTABLE_API[^=]*=\s*\[([\s\S]*?)\n\];/;

/**
 * The names that are per-component machinery rather than surface.
 *
 * A `*Config` is the shape a component's configuration section takes, a `*Props` is the
 * shape of one component's props, and a `FALLBACK_*` or `default*` is a value the
 * cascade starts from. A consumer writes none of them deliberately; they reach the
 * package because a component's signature mentions them. `UMBRELLA-REPORT.md` calls
 * them "internals" and counts the public names separately, so the report does too.
 */
const INTERNAL_NAMES = [/Config$/, /Props$/, /^FALLBACK_/, /^default[A-Z]/];

/**
 * Whether a published name is surface rather than machinery.
 *
 * @param name - The published name.
 * @returns True when the name is one a consumer writes.
 */
function isPublicName(name) {
  return !INTERNAL_NAMES.some((pattern) => pattern.test(name));
}

/**
 * Resolve a re-export to the file it names.
 *
 * @param fromFile - The file the statement was read from.
 * @param specifier - The module specifier.
 * @returns The file's path, or undefined when it resolves outside this workspace.
 */
function resolveModule(fromFile, specifier) {
  if (specifier.startsWith(".")) {
    const base = resolve(dirname(fromFile), specifier);
    const candidates = [
      ...FILE_EXTENSIONS.map((extension) => base + extension),
      ...FILE_EXTENSIONS.map((extension) => join(base, `index${extension}`)),
    ];

    return candidates.find((candidate) => existsSync(candidate));
  }

  // The umbrella's entries name the renderers, not their files. Mapping the three
  // package names is the whole of what the umbrella needs to be followed: it does not
  // reach a subpath until B22 adds one.
  return PACKAGE_ENTRIES.get(specifier);
}

/**
 * Collect everything a module publishes, following its re-exports.
 *
 * @param file - The file to read.
 * @param names - `name -> declaring file`, for everything found so far.
 * @param visited - The files already read, so that a cycle cannot loop.
 */
function collect(file, names, visited) {
  if (visited.has(file)) return;
  visited.add(file);

  const source = readFileSync(file, "utf8");
  const add = (name) =>
    names.set(name, file.replace(ROOT, "").replaceAll("\\", "/"));

  for (const match of source.matchAll(DECLARATION)) add(match[1]);

  for (const match of source.matchAll(NAMED_EXPORT)) {
    for (const raw of match[1].split(",")) {
      // A brace list states a name's kind inline (`export { type Foo }`), which is a
      // modifier rather than part of the name, so it is removed before the alias is
      // read; otherwise the report would publish `type Foo` alongside `Foo`.
      const piece = raw
        .trim()
        .replace(/^type\s+/, "")
        .replace(/^typeof\s+/, "");
      const [local, exported] = piece.split(/\s+as\s+/);
      const name = (exported ?? local)?.trim();
      if (name) add(name);
    }
  }

  for (const match of source.matchAll(STAR_AS_EXPORT)) add(match[1]);

  for (const match of source.matchAll(STAR_EXPORT)) {
    const target = resolveModule(file, match[1]);
    if (target) collect(target, names, visited);
  }
}

/**
 * Read the compatibility matrix out of its source file.
 *
 * The file is data: an array of flat objects whose values are string literals. It is
 * read as data rather than imported, so the report does not depend on the package
 * having been built and cannot verify a stale build.
 *
 * @returns The matrix entries, in source order.
 */
function readMatrix() {
  if (!existsSync(MATRIX_FILE)) return [];

  const array = readFileSync(MATRIX_FILE, "utf8").match(MATRIX_ARRAY)?.[1];
  if (!array) return [];

  return [...array.matchAll(/\{([^{}]*)\}/g)]
    .map((match) => {
      const entry = {};
      for (const property of match[1].matchAll(/(\w+):\s*"([^"]*)"/g)) {
        entry[property[1]] = property[2];
      }
      return entry;
    })
    .filter((entry) => entry.name && entry.module && entry.support);
}

/**
 * Read the declared portable surface, when it has been written.
 *
 * `UMBRELLA-REPORT.md` §3.2 puts it in `packages/core/src/portable.ts` and B19 writes
 * it. Until then the three assertions that compare against it have nothing to compare
 * to, and saying so is more useful than passing vacuously.
 *
 * @returns The entries, or undefined when the surface is not declared yet.
 */
function readPortableApi() {
  if (!existsSync(PORTABLE_FILE)) return undefined;

  const array = readFileSync(PORTABLE_FILE, "utf8").match(PORTABLE_ARRAY)?.[1];
  if (!array) return undefined;

  return [...array.matchAll(/\{([^{}]*)\}/g)].map((match) => {
    const entry = {};
    for (const property of match[1].matchAll(/(\w+):\s*"([^"]*)"/g)) {
      entry[property[1]] = property[2];
    }
    // `pending` is an array of work packages, so it is read separately.
    const pending = match[1].match(/pending:\s*\[([^\]]*)\]/);
    entry.pending = pending
      ? [...pending[1].matchAll(/"([^"]+)"/g)].map((item) => item[1])
      : [];
    return entry;
  });
}

/**
 * List the keys an exports map offers.
 *
 * @param map - A manifest's `exports` map.
 * @returns The subpath keys, `"."` included.
 */
function exportKeys(map) {
  return map && typeof map === "object" ? Object.keys(map) : [];
}

/**
 * Every file path an exports entry names, at any depth.
 *
 * @param entry - One exports value: a string, or an object of conditions.
 * @returns The paths it names.
 */
function targetsOf(entry) {
  if (typeof entry === "string") return [entry];
  if (!entry || typeof entry !== "object") return [];
  return Object.values(entry).flatMap(targetsOf);
}

/**
 * Whether a manifest's `files` list publishes a path.
 *
 * @param files - The manifest's `files` list.
 * @param target - A path an exports entry names, relative to the package.
 * @returns True when the path is shipped.
 */
function isPublished(files, target) {
  const path = target.replace(/^\.\//, "");
  return files.some(
    (entry) =>
      !entry.startsWith("!") &&
      (path === entry || path.startsWith(`${entry.replace(/\/$/, "")}/`)),
  );
}

/**
 * Read one branch's surface.
 *
 * @param file - The branch's entry file.
 * @returns `name -> declaring file`, in declaration order.
 */
function surfaceOf(file) {
  const names = new Map();
  collect(file, names, new Set());
  return names;
}

/**
 * Describe one assertion's outcome.
 *
 * @param outcome - The outcome, with the names that explain it.
 * @returns The finding, ready to print or serialise.
 */
function finding(outcome) {
  return { offending: [], detail: "", ...outcome };
}

const missingEntries = BRANCHES.filter(([, file]) => !existsSync(file));
if (missingEntries.length > 0) {
  console.error(
    `Umbrella: the manifest names entries that do not exist: ${missingEntries
      .map(([branch, file]) => `${branch} -> ${file.replace(ROOT, "")}`)
      .join(", ")}.`,
  );
  process.exit(1);
}

const surfaces = Object.fromEntries(
  BRANCHES.map(([branch, file]) => [branch, surfaceOf(file)]),
);

/**
 * Core's published names.
 *
 * `source: "core"` is a claim about a different package, so assertion 2 has to read
 * core's entry as well as the umbrella's. It is read the same way — source, not a build —
 * for the same reason.
 */
const coreSurface = surfaceOf(join(ROOT, "packages/core/src/index.ts"));

const web = [...surfaces.web.keys()].sort();
const native = [...surfaces.native.keys()].sort();
const shared = web.filter((name) => surfaces.native.has(name));
const onlyWeb = web.filter((name) => !surfaces.native.has(name));
const onlyNative = native.filter((name) => !surfaces.web.has(name));
const publicWebOnly = onlyWeb.filter(isPublicName);
const publicNativeOnly = onlyNative.filter(isPublicName);
const internalWebOnly = onlyWeb.filter((name) => !isPublicName(name));
const internalNativeOnly = onlyNative.filter((name) => !isPublicName(name));

const matrix = readMatrix();
const portable = readPortableApi();
const manifest = JSON.parse(readFileSync(UMBRELLA_MANIFEST, "utf8"));

const findings = [];

// 1. Set equality: the two entries publish exactly the same names.
findings.push(
  finding({
    id: 1,
    title: "both branches export the same names",
    status: onlyWeb.length === 0 && onlyNative.length === 0 ? "pass" : "fail",
    detail:
      onlyWeb.length === 0 && onlyNative.length === 0
        ? `${web.length} names on both branches`
        : `${onlyWeb.length} on the web branch only, ${onlyNative.length} on the native branch only; the public ones follow, and --list names the ${internalWebOnly.length + internalNativeOnly.length} internals`,
    // The internals are per-component machinery, and there are 400 of them: naming
    // them at the end of every report would bury the names a consumer writes.
    offending: [
      ...publicWebOnly.map((name) => `web only: ${name}`),
      ...publicNativeOnly.map((name) => `native only: ${name}`),
    ],
  }),
);

// 2. Every portable name is published by both renderers, or is pending work.
// 3. No pending name is stale: one both renderers publish must leave the list.
// 4. The matrix and the portable surface agree, in both directions.
if (!portable) {
  const deferred = (id, title) =>
    finding({
      id,
      title,
      status: "deferred",
      detail:
        "packages/core/src/portable.ts does not exist yet, so there is no declared surface to compare with. B19 writes it.",
    });

  findings.push(deferred(2, "every portable name is published by both renderers"));
  findings.push(deferred(3, "no pending name is stale"));
  findings.push(deferred(4, "the portable surface and the matrix agree"));
} else {
  const portableNames = new Set(portable.map((entry) => entry.name));
  const pendingEntries = portable.filter((entry) => entry.pending.length > 0);
  const declaredEntries = portable.filter((entry) => entry.pending.length === 0);
  const pendingNames = pendingEntries.map((entry) => entry.name);

  /**
   * Whether the package an entry names publishes it.
   *
   * The declared `source` is the point of the check: a `core` name that core does not
   * publish, or a `renderer` name one branch is missing, is the drift this assertion
   * exists for. A pending entry is exempt until its work lands.
   */
  const publishedBySource = (entry) =>
    entry.source === "core"
      ? coreSurface.has(entry.name)
      : surfaces.web.has(entry.name) && surfaces.native.has(entry.name);

  const undecidedSource = portable.filter(
    (entry) => entry.source !== "core" && entry.source !== "renderer",
  );
  const unpublished = declaredEntries.filter(
    (entry) => !publishedBySource(entry),
  );

  findings.push(
    finding({
      id: 2,
      title: "every portable name is published by its declared source",
      status:
        undecidedSource.length === 0 && unpublished.length === 0
          ? "pass"
          : "fail",
      detail: `${portable.length} declared (${declaredEntries.length} ready, ${pendingEntries.length} pending), ${portable.filter((entry) => entry.source === "core").length} routed to core and ${portable.filter((entry) => entry.source === "renderer").length} to the branch renderer`,
      offending: [
        ...undecidedSource.map(
          (entry) =>
            `no declared source: ${entry.name} (${entry.source ?? "missing"})`,
        ),
        ...unpublished.map((entry) =>
          entry.source === "core"
            ? `@asheeui/core does not publish: ${entry.name}`
            : `${
                !surfaces.web.has(entry.name)
                  ? "@asheeui/web"
                  : "@asheeui/native"
              } does not publish: ${entry.name}`,
        ),
      ],
    }),
  );

  const stale = pendingEntries
    .filter((entry) => publishedBySource(entry))
    .map((entry) => entry.name);

  findings.push(
    finding({
      id: 3,
      title: "no pending name is stale",
      status: stale.length === 0 ? "pass" : "fail",
      detail: `${pendingNames.length} names carry a pending work package`,
      offending: stale.map(
        (name) => `the declared source publishes it now: ${name}`,
      ),
    }),
  );

  /**
   * The name a matrix component acquires in the umbrella.
   *
   * The matrix states the web export's name, and `native` names the counterpart when
   * the platform publishes it under a different one (`Toast` is `ToastProvider` on both
   * branches). A prose `native` value describes a platform rather than an export, so only
   * an identifier is treated as an alias.
   */
  const namesOf = (entry) => {
    const alias =
      entry.native && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(entry.native)
        ? [entry.native]
        : [];
    return [entry.name, ...alias];
  };

  const promised = matrix.filter(
    (entry) => entry.support === "shared" || entry.support === "shared-api",
  );
  const absent = promised
    .filter((entry) => !namesOf(entry).some((name) => portableNames.has(name)))
    .map((entry) => entry.name);
  const unclassified = portable.filter(
    (entry) => entry.support !== "shared" && entry.support !== "shared-api",
  );
  const platformOnly = matrix
    .filter(
      (entry) =>
        entry.support === "web-only" ||
        entry.support === "native-only" ||
        entry.support === "not-applicable",
    )
    .map((entry) => entry.name);
  const platformEntries = portable.filter((entry) =>
    platformOnly.includes(entry.name),
  );

  findings.push(
    finding({
      id: 4,
      title: "the portable surface and the matrix agree",
      status:
        absent.length === 0 &&
        unclassified.length === 0 &&
        platformEntries.length === 0
          ? "pass"
          : "fail",
      detail: `${promised.length} components the matrix classifies shared or shared-api, ${platformOnly.length} it classifies platform-only`,
      offending: [
        ...absent.map((name) => `shared, not portable: ${name}`),
        ...unclassified.map(
          (entry) => `portable, not shared: ${entry.name} (${entry.support})`,
        ),
        ...platformEntries.map(
          (entry) =>
            `platform-only, but portable: ${entry.name} (${entry.support})`,
        ),
      ],
    }),
  );
}

// 5. No name the matrix calls platform-only is offered by the umbrella. Only the
// component names are classified in the matrix today; the per-name lists over the
// renderers' surfaces arrive with B07, and this assertion grows to cover them.
const platformOnly = matrix
  .filter(
    (entry) =>
      entry.support === "web-only" ||
      entry.support === "native-only" ||
      entry.support === "not-applicable",
  )
  .map((entry) => entry.name);
const leaked = platformOnly.filter(
  (name) => surfaces.web.has(name) || surfaces.native.has(name),
);

findings.push(
  finding({
    id: 5,
    title: "no platform-only name reaches the umbrella",
    status: leaked.length === 0 ? "pass" : "fail",
    detail: `${platformOnly.length} components the matrix classifies platform-only`,
    offending: leaked.map(
      (name) =>
        `${name} (${surfaces.web.has(name) ? "web" : "native"} branch, ${
          matrix.find((entry) => entry.name === name)?.support ?? "unclassified"
        })`,
    ),
  }),
);

// 6. The subpaths the reports promise exist in both maps, and the files they name are
// shipped. The stylesheet is the one a web consumer needs and cannot get from the
// umbrella today, which is the gap `UMBRELLA-REPORT.md` §1.5 records.
const REQUIRED_SUBPATHS = [
  "./styles",
  "./styles.css",
  "./tailwind-preset",
  "./section-kit",
];
const sourceExports = exportKeys(manifest.exports);
const publishedExports = exportKeys(manifest.publishConfig?.exports ?? {});
const files = manifest.files ?? [];

const subpathProblems = [];
for (const subpath of REQUIRED_SUBPATHS) {
  const missingFrom = [
    ...(sourceExports.includes(subpath) ? [] : ["exports"]),
    ...(publishedExports.includes(subpath) ? [] : ["publishConfig.exports"]),
  ];
  if (missingFrom.length > 0) {
    subpathProblems.push(`${subpath} missing from ${missingFrom.join(" and ")}`);
    continue;
  }

  for (const [where, map] of [
    ["exports", manifest.exports],
    ["publishConfig.exports", manifest.publishConfig?.exports ?? {}],
  ]) {
    for (const target of targetsOf(map[subpath])) {
      const path = resolve(UI_DIRECTORY, target);
      if (!existsSync(path)) {
        subpathProblems.push(`${subpath} -> ${target} does not exist (${where})`);
      } else if (!isPublished(files, target)) {
        subpathProblems.push(`${subpath} -> ${target} is not in files (${where})`);
      }
    }
  }
}

findings.push(
  finding({
    id: 6,
    title: "the promised subpaths resolve and are shipped",
    status: subpathProblems.length === 0 ? "pass" : "fail",
    detail: `${REQUIRED_SUBPATHS.length} subpaths, ${sourceExports.length} in the source map, ${publishedExports.length} published`,
    offending: subpathProblems,
  }),
);

const summary = {
  surfaces: {
    web: web.length,
    native: native.length,
    shared: shared.length,
    webOnly: onlyWeb.length,
    nativeOnly: onlyNative.length,
    publicWebOnly: publicWebOnly.length,
    publicNativeOnly: publicNativeOnly.length,
  },
  publicWebOnly,
  publicNativeOnly,
  portable: portable
    ? {
        size: portable.length,
        core: portable.filter((entry) => entry.source === "core").length,
        renderer: portable.filter((entry) => entry.source === "renderer").length,
        pending: portable.filter((entry) => entry.pending.length > 0).length,
      }
    : null,
  assertions: findings,
};

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(summary, null, 2));
  process.exit(0);
}

if (process.argv.includes("--list")) {
  console.log(`The web branch (${web.length} names)`);
  for (const name of web) console.log(`  ${name}`);
  console.log(`\nThe native branch (${native.length} names)`);
  for (const name of native) console.log(`  ${name}`);
  console.log(`\nShared (${shared.length} names)`);
  for (const name of shared) console.log(`  ${name}`);
  process.exit(0);
}

const LABELS = {
  pass: "pass    ",
  fail: "FAIL    ",
  deferred: "deferred",
};

console.log("Umbrella drift report — report mode, so nothing here fails the build.\n");

console.log("Branches");
console.log(
  `  web          ${String(web.length).padStart(4)} names  (packages/ui/src/index.ts)`,
);
console.log(
  `  native       ${String(native.length).padStart(4)} names  (packages/ui/src/index.native.ts)`,
);
console.log(`  shared       ${String(shared.length).padStart(4)} names`);
console.log(
  `  web only     ${String(onlyWeb.length).padStart(4)} names  (${publicWebOnly.length} public, ${internalWebOnly.length} Config/Props/FALLBACK/default internals)`,
);
console.log(
  `  native only  ${String(onlyNative.length).padStart(4)} names  (${publicNativeOnly.length} public, ${internalNativeOnly.length} internals)`,
);

if (portable) {
  const toCore = portable.filter((entry) => entry.source === "core").length;
  console.log(
    `  portable     ${String(portable.length).padStart(4)} names  (${toCore} from core, ${portable.length - toCore} from the branch renderer, ${portable.filter((entry) => entry.pending.length > 0).length} pending)`,
  );
}

/** Print a wrapped, indented list so a long set of names stays readable. */
function printNames(names, indent, width = 96) {
  let line = "";
  for (const name of names) {
    const next = line ? `${line}, ${name}` : name;
    if (next.length > width) {
      console.log(`${indent}${line},`);
      line = name;
    } else {
      line = next;
    }
  }
  if (line) console.log(`${indent}${line}`);
}

console.log(
  `\nThe ${publicWebOnly.length} public names the web branch offers and the native branch does not`,
);
printNames(publicWebOnly, "  ");

console.log("\nAssertions");
for (const outcome of findings) {
  console.log(`  ${outcome.id}  ${outcome.title}`);
  console.log(`     ${LABELS[outcome.status] ?? outcome.status}  ${outcome.detail}`);
  for (const name of outcome.offending.slice(0, 1)) {
    // The full list follows below; the line here keeps a failure readable at a glance.
    if (outcome.status === "fail") console.log(`             first: ${name}`);
  }
}

const failed = findings.filter((outcome) => outcome.status === "fail");
if (failed.length > 0) {
  console.log("\nWhat the failures are");
  for (const outcome of failed) {
    console.log(`\n  ${outcome.id}. ${outcome.title}`);
    printNames(outcome.offending, "     ");
  }
}

console.log(
  `\n${failed.length} of ${findings.length} assertions fail; ${
    findings.filter((outcome) => outcome.status === "deferred").length
  } await the declared portable surface. Report mode exits 0. B21 makes this blocking.`,
);

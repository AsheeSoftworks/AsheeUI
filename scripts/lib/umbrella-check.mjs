/**
 * The umbrella guard, as a function.
 *
 * `scripts/check-umbrella.mjs` and `packages/ui/src/index.test.ts` both call this, so the
 * command a developer runs and the suite CI runs cannot disagree about what the umbrella
 * offers. It reads the packages' sources rather than importing them — a guard that
 * imported a build could verify a stale one — and it returns a summary instead of
 * printing, so the caller decides how a failure looks.
 *
 * The six assertions are `UMBRELLA-REPORT.md` §6:
 *
 * 1. **set equality** — both entries publish the portable surface and nothing else;
 * 2. **the declared source publishes the name** — a `core` entry comes from
 *    `@asheeui/core`, a `renderer` entry from both renderer entries;
 * 3. **no stale `pending`** — a name whose source now publishes it leaves the list;
 * 4. **the matrix agrees** — every `shared`/`shared-api` component is portable, and no
 *    `web-only`/`native-only`/`not-applicable` component is;
 * 5. **no platform-only name leaks** — neither a matrix classification nor a name only
 *    one renderer publishes reaches the umbrella;
 * 6. **the subpaths resolve** — `./styles`, `./styles.css`, `./tailwind-preset` and
 *    `./section-kit` exist in both maps, and the files they name are shipped.
 *
 * ## The declared `source` (a documented extension of §3.2)
 *
 * §3.2's shape says what is portable but not where a name lives, and the generator needs
 * to route every name to a package. B19 added `source: "core" | "renderer"`, and
 * assertion 2 checks the declaration instead of assuming one rule. The cascade helpers
 * and the shared vocabulary are core's; `cn`, `resolveAnimate`, the hooks and every
 * component are the renderers'. Routing `cn` from core would give the umbrella a second
 * implementation of it, which is the drift the list exists to prevent.
 *
 * ## What assertion 6 checks, and what it leaves to the distribution check
 *
 * The source map names files a checkout has, so a missing one fails here. The published
 * map names build output, which a source checkout has not produced yet — and CI runs this
 * guard before `pnpm build` — so for that map the requirement is that `files` ships the
 * path. `verify:distribution` resolves those paths against the build; the two together
 * cover both halves without making the guard depend on an artifact.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

/** What an assertion says. `pending` is work another batch owns, not a failure. */
const STATUS = { pass: "pass", fail: "fail", pending: "pending" };

/** The subpaths `UMBRELLA-REPORT.md` §3.6 promises. */
const REQUIRED_SUBPATHS = [
  "./styles",
  "./styles.css",
  "./tailwind-preset",
  "./section-kit",
];

/**
 * The names the generated entries add outside `PORTABLE_API`.
 *
 * `AsheeConfig` is the one platform-specific alias the generator writes by hand: the web
 * branch types it as `ExternalConfig`, the native branch re-exports the platform's own.
 * It is declared rather than allowed silently so a second hand-written name cannot hide
 * behind "set equality".
 */
const PLATFORM_SPECIFIC_NAMES = new Set(["AsheeConfig"]);

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

/** Where the portable surface's array literal begins. */
const PORTABLE_ARRAY = /PORTABLE_API[^=]*=\s*\[([\s\S]*?)\n\];/;

/**
 * The names that are per-component machinery rather than surface.
 *
 * A `*Config` is the shape a component's configuration section takes, a `*Props` is the
 * shape of one component's props, and a `FALLBACK_*` or `default*` is a value the cascade
 * starts from. A consumer writes none of them deliberately; they reach a package because a
 * component's signature mentions them. `UMBRELLA-REPORT.md` calls them internals and
 * counts the public names separately, so the report does too.
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
 * Describe one assertion's outcome.
 *
 * @param outcome - The outcome, with the names that explain it.
 * @returns The finding, ready to print or serialise.
 */
function finding(outcome) {
  return { offending: [], detail: "", ...outcome };
}

/**
 * Evaluate the umbrella against the declared portable surface.
 *
 * @param options - The repository root; defaults to the working directory.
 * @returns The summary: both branch surfaces, the declared surface, and the six assertions.
 * @throws When the umbrella's manifest or one of its entries is missing, because there is
 * no surface to evaluate and saying so is clearer than six vacuous failures.
 */
export function evaluateUmbrella({ root = process.cwd() } = {}) {
  const ROOT = resolve(root);
  const UI_DIRECTORY = join(ROOT, "packages/ui");
  const UMBRELLA_MANIFEST = join(UI_DIRECTORY, "package.json");
  /**
   * The matrix is published as `@asheeui/core/dev` (C4), not from core's root entry, and
   * this guard reads its source for the same reason the parity guard does: the
   * classification is data, and the assertion is about the umbrella rather than about
   * core's build.
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
   * Read the compatibility matrix out of its source file.
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
   * Read the declared portable surface.
   *
   * @returns The entries, or undefined when the list cannot be read.
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
      // `pending` is an array of plan batches, so it is read separately.
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

  const missingEntries = BRANCHES.filter(([, file]) => !existsSync(file));
  if (missingEntries.length > 0) {
    throw new Error(
      `Umbrella: the manifest names entries that do not exist: ${missingEntries
        .map(([branch, file]) => `${branch} -> ${file.replace(ROOT, "")}`)
        .join(", ")}.`,
    );
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

  /**
   * The renderers' own surfaces.
   *
   * Assertion 5 needs the names only one renderer publishes: a platform extra must stay
   * with its renderer, and that is a fact about the renderers, not about the umbrella's
   * two branches (which are equal by construction once B21 passes).
   */
  const webRenderer = surfaceOf(join(ROOT, "packages/web/src/index.ts"));
  const nativeRenderer = surfaceOf(join(ROOT, "packages/native/src/index.ts"));
  const rendererOnly = new Set([
    ...[...webRenderer.keys()].filter((name) => !nativeRenderer.has(name)),
    ...[...nativeRenderer.keys()].filter((name) => !webRenderer.has(name)),
  ]);

  const web = [...surfaces.web.keys()].sort();
  const native = [...surfaces.native.keys()].sort();
  const webSet = new Set(web);
  const nativeSet = new Set(native);
  const shared = web.filter((name) => nativeSet.has(name));
  const onlyWeb = web.filter((name) => !nativeSet.has(name));
  const onlyNative = native.filter((name) => !webSet.has(name));
  const publicWebOnly = onlyWeb.filter(isPublicName);
  const publicNativeOnly = onlyNative.filter(isPublicName);
  const internalWebOnly = onlyWeb.filter((name) => !isPublicName(name));
  const internalNativeOnly = onlyNative.filter((name) => !isPublicName(name));

  const matrix = readMatrix();
  const portable = readPortableApi();
  const manifest = JSON.parse(readFileSync(UMBRELLA_MANIFEST, "utf8"));

  const readyPortable = portable
    ? portable
        .filter((entry) => entry.pending.length === 0)
        .map((entry) => entry.name)
    : [];
  const readyPortableSet = new Set(readyPortable);
  const pendingEntries = portable
    ? portable.filter((entry) => entry.pending.length > 0)
    : [];
  const pendingNames = pendingEntries.map((entry) => entry.name);

  const findings = [];

  // 1. Set equality: both entries publish exactly the declared surface, plus the one
  //     platform-specific alias. Comparing to `PORTABLE_API` as well as to each other is
  //     what stops a hand-added name from being equal-but-wrong on both branches.
  const umbrellaNames = new Set([...web, ...native]);
  const extra = [...umbrellaNames]
    .filter(
      (name) =>
        !readyPortableSet.has(name) && !PLATFORM_SPECIFIC_NAMES.has(name),
    )
    .sort();
  const absent = readyPortable.filter(
    (name) => !webSet.has(name) || !nativeSet.has(name),
  );
  const equal = onlyWeb.length === 0 && onlyNative.length === 0;
  findings.push(
    finding({
      id: 1,
      title: "both branches publish the portable surface, and nothing else",
      status:
        equal && extra.length === 0 && absent.length === 0
          ? STATUS.pass
          : STATUS.fail,
      detail: `${web.length} names on both branches, ${readyPortable.length} declared portable and ${PLATFORM_SPECIFIC_NAMES.size} platform-specific`,
      offending: [
        ...onlyWeb.map((name) => `web only: ${name}`),
        ...onlyNative.map((name) => `native only: ${name}`),
        ...extra.map((name) => `not declared in PORTABLE_API: ${name}`),
        ...absent.map((name) => `declared but missing: ${name}`),
      ],
    }),
  );

  if (!portable) {
    for (const [id, title] of [
      [2, "every portable name is published by its declared source"],
      [3, "no pending name is stale"],
      [4, "the portable surface and the matrix agree"],
    ]) {
      findings.push(
        finding({
          id,
          title,
          status: STATUS.fail,
          detail:
            "package/core/src/portable.ts could not be read, so there is no declared surface to compare with. B19 declares it.",
          offending: ["packages/core/src/portable.ts is missing or unreadable"],
        }),
      );
    }
  } else {
    // 2. The declared source publishes the name.
    const publishedBySource = (entry) =>
      entry.source === "core"
        ? coreSurface.has(entry.name)
        : webSet.has(entry.name) && nativeSet.has(entry.name);

    const undecidedSource = portable.filter(
      (entry) => entry.source !== "core" && entry.source !== "renderer",
    );
    const unpublished = portable
      .filter((entry) => entry.pending.length === 0)
      .filter((entry) => !publishedBySource(entry));

    findings.push(
      finding({
        id: 2,
        title: "every portable name is published by its declared source",
        status:
          undecidedSource.length === 0 && unpublished.length === 0
            ? STATUS.pass
            : STATUS.fail,
        detail: `${portable.length} declared (${readyPortable.length} ready, ${pendingNames.length} pending), ${portable.filter((entry) => entry.source === "core").length} routed to core and ${portable.filter((entry) => entry.source === "renderer").length} to the branch renderer`,
        offending: [
          ...undecidedSource.map(
            (entry) =>
              `no declared source: ${entry.name} (${entry.source ?? "missing"})`,
          ),
          ...unpublished.map((entry) =>
            entry.source === "core"
              ? `@asheeui/core does not publish: ${entry.name}`
              : `${
                  !webSet.has(entry.name)
                    ? "@asheeui/web"
                    : "@asheeui/native"
                } does not publish: ${entry.name}`,
          ),
        ],
      }),
    );

    // 3. A pending name the declared source now publishes leaves the list.
    const stale = pendingEntries
      .filter((entry) => publishedBySource(entry))
      .map((entry) => entry.name);

    findings.push(
      finding({
        id: 3,
        title: "no pending name is stale",
        status: stale.length === 0 ? STATUS.pass : STATUS.fail,
        detail: `${pendingNames.length} names carry a pending work package`,
        offending: stale.map(
          (name) => `the declared source publishes it now: ${name}`,
        ),
      }),
    );

    // 4. The matrix agrees, in both directions.
    /**
     * The name a matrix component acquires in the umbrella.
     *
     * The matrix states the web export's name, and `native` names the counterpart when
     * the platform publishes it under a different one (`Toast` is `ToastProvider` on both
     * branches). A prose `native` value describes a platform rather than an export, so
     * only an identifier is treated as an alias.
     */
    const namesOf = (entry) => {
      const alias =
        entry.native && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(entry.native)
          ? [entry.native]
          : [];
      return [entry.name, ...alias];
    };

    const promised = matrix.filter(
      (entry) =>
        (entry.support === "shared" || entry.support === "shared-api") &&
        // A subpath component is public through `asheeui/section-kit`, not the root
        // entry, so it is covered by assertion 6 and the umbrella's own section-kit test
        // rather than by this surface.
        entry.subpath === undefined,
    );
    const matrixAbsent = promised
      .filter(
        (entry) =>
          !namesOf(entry).some((name) => readyPortableSet.has(name)),
      )
      .map((entry) => entry.name);
    const unclassified = portable.filter(
      (entry) => entry.support !== "shared" && entry.support !== "shared-api",
    );
    const matrixPlatformOnly = matrix
      .filter(
        (entry) =>
          entry.support === "web-only" ||
          entry.support === "native-only" ||
          entry.support === "not-applicable",
      )
      .map((entry) => entry.name);
    const platformEntries = portable.filter((entry) =>
      matrixPlatformOnly.includes(entry.name),
    );

    findings.push(
      finding({
        id: 4,
        title: "the portable surface and the matrix agree",
        status:
          matrixAbsent.length === 0 &&
          unclassified.length === 0 &&
          platformEntries.length === 0
            ? STATUS.pass
            : STATUS.fail,
        detail: `${promised.length} components the matrix classifies shared or shared-api, ${matrixPlatformOnly.length} it classifies platform-only`,
        offending: [
          ...matrixAbsent.map((name) => `shared, not portable: ${name}`),
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

  // 5. No platform-only name reaches the umbrella. The matrix classifies components; the
  //     renderers' own exclusive surfaces cover the names it does not, so a hand-added
  //     `Breadcrumb` or `RowList` is caught even if it were declared somewhere.
  const matrixPlatformOnlyNames = new Set(
    matrix
      .filter(
        (entry) =>
          entry.support === "web-only" ||
          entry.support === "native-only" ||
          entry.support === "not-applicable",
      )
      .map((entry) => entry.name),
  );
  const leaked = [...umbrellaNames]
    .filter(
      (name) =>
        !readyPortableSet.has(name) &&
        !PLATFORM_SPECIFIC_NAMES.has(name) &&
        (matrixPlatformOnlyNames.has(name) || rendererOnly.has(name)),
    )
    .sort();

  findings.push(
    finding({
      id: 5,
      title: "no platform-only name reaches the umbrella",
      status: leaked.length === 0 ? STATUS.pass : STATUS.fail,
      detail: `${matrixPlatformOnlyNames.size} components the matrix classifies platform-only, ${rendererOnly.size} names only one renderer publishes`,
      offending: leaked.map(
        (name) =>
          `${name} (${webSet.has(name) ? "web" : "native"} branch, ${
            matrix.find((entry) => entry.name === name)?.support ??
            "not classified by the matrix"
          })`,
      ),
    }),
  );

  // 6. The subpaths the reports promise. A missing subpath is a failure now: B22 shipped
  //     `./styles`, `./styles.css` and `./section-kit`. The source map's files must exist in
  //     the checkout; the published map's build output must be shipped by `files`, and
  //     `verify:distribution` resolves it against the build.
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
      subpathProblems.push(
        `${subpath} missing from ${missingFrom.join(" and ")}`,
      );
      continue;
    }

    for (const [where, map] of [
      ["exports", manifest.exports],
      ["publishConfig.exports", manifest.publishConfig?.exports ?? {}],
    ]) {
      for (const target of targetsOf(map[subpath])) {
        if (where === "exports" && !existsSync(resolve(UI_DIRECTORY, target))) {
          subpathProblems.push(`${subpath} -> ${target} does not exist (${where})`);
        }
        if (!isPublished(files, target)) {
          subpathProblems.push(
            `${subpath} -> ${target} is not in files (${where})`,
          );
        }
      }
    }
  }

  findings.push(
    finding({
      id: 6,
      title: "the promised subpaths resolve and are shipped",
      status: subpathProblems.length === 0 ? STATUS.pass : STATUS.fail,
      detail: `${REQUIRED_SUBPATHS.length} subpaths, ${sourceExports.length} in the source map, ${publishedExports.length} published`,
      offending: subpathProblems,
    }),
  );

  return {
    root: ROOT,
    surfaces: {
      web: web.length,
      native: native.length,
      shared: shared.length,
      webOnly: onlyWeb.length,
      nativeOnly: onlyNative.length,
      publicWebOnly: publicWebOnly.length,
      publicNativeOnly: publicNativeOnly.length,
      webNames: web,
      nativeNames: native,
      sharedNames: shared,
      publicWebOnlyNames: publicWebOnly,
      internalWebOnly: internalWebOnly.length,
      internalNativeOnly: internalNativeOnly.length,
    },
    portable: portable
      ? {
          size: portable.length,
          core: portable.filter((entry) => entry.source === "core").length,
          renderer: portable.filter((entry) => entry.source === "renderer")
            .length,
          pending: pendingNames.length,
          names: readyPortable,
        }
      : null,
    assertions: findings,
  };
}

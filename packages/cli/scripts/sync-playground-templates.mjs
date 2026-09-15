/**
 * Assemble the distributable playground templates from the real playgrounds.
 *
 * A template is generated rather than written by hand, so the project a client
 * receives is the project the repository verifies: the shell that makes it that
 * framework, plus the shared playground application it renders. Generating it
 * keeps one source of truth. `tests/playground.test.ts` fails when a template is
 * missing a file its playground depends on, and again when a shipped file is not
 * byte for byte the file this repository verifies, which is what stops a generated
 * template from going stale between runs of this script.
 *
 * Run from the repository root:
 *
 * ```sh
 * node packages/cli/scripts/sync-playground-templates.mjs
 * ```
 *
 * Pass a directory to generate somewhere else, which is how the test compares a
 * fresh generation with what is committed:
 *
 * ```sh
 * node packages/cli/scripts/sync-playground-templates.mjs /tmp/generated
 * ```
 */

import { promises as fs } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(scriptDirectory, "..");
const repositoryRoot = resolve(packageRoot, "../..");

/** Files and directories that never belong in a client's project. */
const IGNORED = [
  "node_modules",
  ".next",
  ".turbo",
  ".tanstack",
  "dist",
  "coverage",
  "tsconfig.tsbuildinfo",
];

/**
 * The playgrounds, and where their application code lives.
 * `sourceRoot` is the directory the shell's own source is under, so the copied
 * playground application can be placed beside it.
 */
const TARGETS = [
  {
    id: "next",
    app: join(repositoryRoot, "apps/next-playground"),
    sourceRoot: "app",
    playground: "playground",
  },
  {
    id: "vite",
    app: join(repositoryRoot, "apps/vite-playground"),
    sourceRoot: "src",
    playground: "playground",
  },
  {
    id: "tanstack",
    app: join(repositoryRoot, "apps/tanstack-playground"),
    sourceRoot: "src",
    playground: "playground",
  },
];

/**
 * The shared application modules a distributable project contains.
 *
 * The closure is what makes the copied project self-sufficient: `index.ts` is the
 * application surface a shell imports, `testing.ts` is the verification surface a
 * test imports, and the modules each of them reaches for travel with them. The
 * contract helpers travel because a section states its own contract, which is what
 * lets the copied project check itself with `pnpm test`.
 */
const SHARED_MODULES = [
  "index.ts",
  "app.tsx",
  "gallery.tsx",
  "sections.tsx",
  "types.ts",
  "playground-config.ts",
  "testing.ts",
  "harness.ts",
  "inspect.ts",
  "interactions.ts",
  "dom.ts",
  "events.ts",
];

/** The package name the shared modules are imported by, before rewriting. */
const SHARED_PACKAGE = "@asheeui/e2e-gallery";

/** The published range a copied project depends on. */
const ASHEEUI_RANGE = "^2.0.0";

/**
 * Compiler options that exist to publish a library rather than to compile a
 * project, so they are not inlined into a copied project.
 */
const PUBLISHING_OPTIONS = [
  "declaration",
  "declarationMap",
  "sourceMap",
  "composite",
];

/**
 * Read a manifest from the repository.
 *
 * @param path - Absolute path of the manifest.
 * @returns The parsed manifest.
 */
async function readManifest(path) {
  return JSON.parse(await fs.readFile(path, "utf8"));
}

/**
 * The compiler options a copied project inherits.
 *
 * A playground's TypeScript configuration extends the repository's, which a
 * project generated outside the repository cannot do, because the file it extends
 * is not part of the project. The options are inlined instead so a copied project
 * compiles exactly as the playground does without reaching outside itself.
 */
const BASE_COMPILER_OPTIONS_SOURCE = (
  await readManifest(join(repositoryRoot, "tsconfig.json"))
).compilerOptions;

const BASE_COMPILER_OPTIONS = (() => {
  const options = { ...BASE_COMPILER_OPTIONS_SOURCE };
  for (const option of PUBLISHING_OPTIONS) delete options[option];
  return options;
})();

/**
 * The ranges a copied project installs for the type packages a playground asks
 * for, read from the repository so a project compiles against the same types this
 * repository verifies.
 */
const TYPE_RANGES = await readTypeRanges();

/**
 * Read the repository's own type packages.
 *
 * @returns Ranges by type name, without the `@types/` prefix.
 */
async function readTypeRanges() {
  const manifest = await readManifest(join(repositoryRoot, "package.json"));
  const ranges = {};

  for (const [name, range] of Object.entries(manifest.devDependencies ?? {})) {
    if (name.startsWith("@types/"))
      ranges[name.slice("@types/".length)] = range;
  }

  return ranges;
}

/**
 * Walk a directory, skipping what a client's project must not carry.
 *
 * @param root - Directory to walk.
 * @param base - Directory the returned paths are relative to.
 * @returns Relative file paths.
 */
async function walk(root, base = root) {
  const entries = await fs.readdir(root, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = join(root, entry.name);

    if (IGNORED.includes(entry.name)) continue;
    // The template writes its own README, because the repository's describes the
    // playground as repository infrastructure rather than as a project to start.
    if (entry.name === "README.md") continue;

    if (entry.isDirectory()) {
      files.push(...(await walk(full, base)));
    } else if (entry.isFile()) {
      files.push(relative(base, full).replaceAll("\\\\", "/"));
    }
  }

  return files;
}

/**
 * Make a playground's metadata installable outside the repository.
 *
 * The dependency on the shared package is replaced by the published framework,
 * because the shared modules now live inside the project, and every `workspace:`
 * range becomes a released one so the project installs on its own.
 *
 * @param content - The playground's `package.json` content.
 * @param name - Package name the template carries.
 * @param types - Type packages its TypeScript configuration asks for.
 * @returns The rewritten content.
 */
function rewriteManifest(content, name, types) {
  const manifest = JSON.parse(content);
  manifest.name = name;
  manifest.version = "0.1.0";
  manifest.private = true;

  for (const field of ["dependencies", "devDependencies"]) {
    const entries = manifest[field] ?? {};

    delete entries[SHARED_PACKAGE];
    for (const [dependency, range] of Object.entries(entries)) {
      if (String(range).startsWith("workspace:")) {
        entries[dependency] =
          dependency === "asheeui" ? ASHEEUI_RANGE : String(range);
      }
    }

    manifest[field] = entries;
  }

  // A project that asks TypeScript for a type package has to install it. Inside
  // the repository those types are hoisted to the workspace root, which a copied
  // project does not have, so a configuration that asks for Node's types without
  // declaring them fails its own `tsc` run.
  const devDependencies = manifest.devDependencies ?? {};

  for (const type of types) {
    const range = TYPE_RANGES[type];

    if (range !== undefined) devDependencies[`@types/${type}`] ??= range;
  }

  manifest.devDependencies = Object.fromEntries(
    Object.entries(devDependencies).sort(([a], [b]) => a.localeCompare(b)),
  );

  // The playground is a project, so it keeps the framework as a dependency and
  // nothing points back at the repository it was generated from.
  manifest.repository = undefined;
  delete manifest.repository;

  return `${JSON.stringify(manifest, null, 2)}\n`;
}

/**
 * The README a copied playground carries.
 *
 * @param label - Human-readable framework name.
 * @returns Markdown content.
 */
function readmeFor(label) {
  return `# AsheeUI playground (${label})

A working AsheeUI application, generated by \`asheeui playground\`.

## Run it

\`\`\`sh
pnpm install
pnpm dev
\`\`\`

## Verify it

\`\`\`sh
pnpm build
pnpm test
\`\`\`

## Where things are

| Path | What it holds |
| --- | --- |
| \`playground/\` | The playground application: the screens, the contract each section satisfies, and the configuration. |
| the framework's own directories | The routing and bootstrap files this framework requires, and this framework's link and image adapters. |

Every screen is an AsheeUI component. The application configures nothing:
the framework owns its defaults, and \`playground/playground-config.ts\` states
that on purpose, so what you see is the framework's own baseline.

See <https://asheeui.com> for the framework documentation.
`;
}

/**
 * Rewrite a copied module's imports so it resolves inside the client's project.
 *
 * @param content - File content.
 * @param file - Path of the file inside the project.
 * @param project - Project being generated.
 * @returns The rewritten content.
 */
function rewriteImports(content, file, project) {
  const from = dirname(join(project.app, file));
  const to = join(project.app, project.sourceRoot, project.playground);
  const specifier = relative(from, to).replaceAll("\\\\", "/");
  const prefix = specifier.startsWith(".") ? specifier : `./${specifier}`;

  const rewritten = content
    // The application surface, by package name.
    .replaceAll(`"${SHARED_PACKAGE}"`, `"${prefix}"`)
    .replaceAll(`'${SHARED_PACKAGE}'`, `'${prefix}'`)
    // The verification surface the sections and their tests share.
    .replaceAll(`"${SHARED_PACKAGE}/testing"`, `"${prefix}/testing"`)
    .replaceAll(`'${SHARED_PACKAGE}/testing'`, `'${prefix}/testing'`)
    // The browser stand-ins, which travel as a module of their own.
    .replaceAll(`"${SHARED_PACKAGE}/setup"`, `"${prefix}/setup.ts"`)
    .replaceAll(`'${SHARED_PACKAGE}/setup'`, `'${prefix}/setup.ts'`);

  return rewritten;
}

/**
 * Generate one target's template.
 *
 * @param project - Target description.
 * @param templateRoot - Directory to write the template into.
 */
/**
 * The type packages a playground's TypeScript configuration asks for.
 *
 * @param app - The playground's directory.
 * @param files - Files the playground contains.
 * @returns The names in its `types` array, or nothing when it declares none.
 */
async function declaredTypes(app, files) {
  if (!files.includes("tsconfig.json")) return [];

  const tsconfig = await readManifest(join(app, "tsconfig.json"));

  return tsconfig.compilerOptions?.types ?? [];
}

/**
 * Make a playground's TypeScript configuration stand on its own.
 *
 * @param content - The playground's `tsconfig.json` content.
 * @returns The rewritten content.
 */
function rewriteTsconfig(content) {
  const tsconfig = JSON.parse(content);

  if (
    typeof tsconfig.extends === "string" &&
    tsconfig.extends.startsWith("..")
  ) {
    tsconfig.compilerOptions = {
      ...BASE_COMPILER_OPTIONS,
      ...tsconfig.compilerOptions,
    };
    delete tsconfig.extends;
  }

  return `${JSON.stringify(tsconfig, null, 2)}\n`;
}

/**
 * Decide the content one copied file carries.
 *
 * @param content - The file's content in the playground.
 * @param file - Path of the file inside the project.
 * @param project - Project being generated.
 * @param types - Type packages the playground asks for.
 * @returns The content the copied project receives.
 */
function rewriteFile(content, file, project, types) {
  if (file === "package.json") {
    return rewriteManifest(content, `asheeui-playground-${project.id}`, types);
  }

  if (file === "tsconfig.json") return rewriteTsconfig(content);

  return rewriteImports(content, file, project);
}

async function generateTarget(project, templateRoot) {
  await fs.rm(templateRoot, { recursive: true, force: true });

  const files = await walk(project.app);
  const types = await declaredTypes(project.app, files);

  for (const file of files) {
    const content = await fs.readFile(join(project.app, file), "utf8");
    const target = join(templateRoot, file);

    await fs.mkdir(dirname(target), { recursive: true });
    await fs.writeFile(
      target,
      rewriteFile(content, file, project, types),
      "utf8",
    );
  }

  await fs.writeFile(join(templateRoot, "README.md"), readmeFor(project.id));

  const playgroundRoot = join(
    templateRoot,
    project.sourceRoot,
    project.playground,
  );

  for (const module of SHARED_MODULES) {
    const content = await fs.readFile(
      join(repositoryRoot, "packages/e2e-gallery/src", module),
      "utf8",
    );

    await fs.mkdir(playgroundRoot, { recursive: true });
    await fs.writeFile(join(playgroundRoot, module), content, "utf8");
  }

  const setup = await fs.readFile(
    join(repositoryRoot, "packages/e2e-gallery/src/setup.ts"),
    "utf8",
  );

  await fs.writeFile(join(playgroundRoot, "setup.ts"), setup, "utf8");

  console.log(`generated ${project.id} (${files.length} shell files)`);
}

/**
 * Where the templates are written. The package's own directory is the default,
 * because that is what ships; a caller may name another directory so a generation
 * can be compared with what is committed without writing into the package.
 */
const outputRoot = process.argv[2] ? resolve(process.argv[2]) : packageRoot;

for (const project of TARGETS) {
  await generateTarget(project, join(outputRoot, "templates", project.id));
}

#!/usr/bin/env node
/**
 * Prove that a consumer application can install the packed tarballs and build.
 *
 * `verify-distribution.mjs` resolves every file the published manifests promise, which
 * catches a `publishConfig` entry pointing at a file the build does not emit. It cannot
 * catch the failures that only appear after an install: a subpath the `exports` map does
 * not expose, a stylesheet import a bundler cannot resolve, a dependency the packed
 * manifest still names as `workspace:^`. Those are found the way a consumer would find
 * them, by packing each package, installing the tarballs into a throwaway Vite
 * application outside the workspace, and building it.
 *
 * The application imports a component through `@asheeui/web` and the stylesheet through
 * `@asheeui/web/styles`, so the build exercises both entry points the docs tell a
 * consumer to use. It renders the component and the provider, which resolves them from
 * the tarball rather than from workspace source.
 *
 * Every step has a hard timeout and reports the command's own output on failure, so a
 * hung install reports instead of hanging the pipeline. A registry failure is named as
 * such: the tarballs packing is not in doubt then, only the install that resolves React
 * and Vite beside them.
 *
 * Run it on its own (`node scripts/verify-consumer.mjs`) or through
 * `verify-distribution.mjs`, which calls it after the manifest checks pass. It needs a
 * build first, because the tarballs carry `dist`:
 *
 * ```bash
 * pnpm build
 * pnpm verify:distribution
 * ```
 */
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const PACKAGES = join(ROOT, "packages");

/**
 * The package manager command. The workspace pins pnpm through `packageManager`, but the
 * repository is checked out on Windows and Linux, where the executable is spelled
 * differently, and a caller may need to point at an exact binary.
 */
const PNPM = process.env.ASHEEUI_PNPM ?? "pnpm";

/** Seconds each step is allowed before it is killed and reported. */
const TIMEOUTS = {
  pack: 180_000,
  install: 420_000,
  build: 240_000,
};

/** The registry errors that mean the fixture could not install, not that it is broken. */
const REGISTRY_PATTERN =
  /EAI_AGAIN|ENOTFOUND|ECONNREFUSED|ECONNRESET|ETIMEDOUT|ERR_SOCKET|fetch failed|network (?:error|timeout)|registry/i;

/**
 * Run one command with a timeout, returning its output instead of only throwing.
 *
 * Build failures are reported with the start of the output: a bundler lists the errors
 * first and the dependency graph after it, so the head names what is missing and the tail
 * is noise. Colour escapes are stripped so the message reads in a terminal and in a CI
 * log alike.
 *
 * @param args - Arguments for the package manager.
 * @param options - The working directory, the timeout, and the step name for messages.
 * @returns The command's output.
 */
function runPnpm(args, { cwd, timeout, step }) {
  const command = [
    PNPM,
    ...args.map((arg) => (/\s/.test(arg) ? `"${arg}"` : arg)),
  ];
  const result = spawnSync(command.join(" "), {
    cwd,
    encoding: "utf8",
    shell: true,
    timeout,
    windowsHide: true,
  });

  const raw = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  // Built rather than written as a literal so a linter does not read the escape as a
  // stray control character in the source; it strips the colour a bundler adds to its
  // error output, which would otherwise reach a CI log as escape noise.
  const colour = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g");
  const output = raw.replace(colour, "").trim();
  const report = output.length > 6000 ? `${output.slice(0, 6000)}\n…` : output;

  if (result.error?.code === "ETIMEDOUT") {
    throw new Error(
      `${step} timed out after ${Math.round(timeout / 1000)}s.\n\n${report}`,
    );
  }
  if (result.error) {
    throw new Error(`${step} could not start: ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(`${step} failed (exit ${result.status}).\n\n${report}`);
  }

  return output;
}

/** Every non-private package under `packages/` that publishes a file list. */
function publishablePackages() {
  const packages = [];

  for (const entry of readdirSync(PACKAGES, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const directory = join(PACKAGES, entry.name);
    const manifestPath = join(directory, "package.json");
    if (!existsSync(manifestPath)) continue;

    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    if (manifest.private === true) continue;
    if (!Array.isArray(manifest.files) || manifest.files.length === 0) continue;

    packages.push({
      directory,
      name: manifest.name,
      version: manifest.version,
      tarball: `${manifest.name.replace(/^@/, "").replace(/\//g, "-")}-${manifest.version}.tgz`,
    });
  }

  return packages;
}

/** The tarball name pnpm writes for a package, checked rather than assumed. */
function tarballFor(directory, pkg) {
  const expected = join(directory, pkg.tarball);
  if (existsSync(expected)) return pkg.tarball;

  const found = readdirSync(directory)
    .filter((file) => file.endsWith(".tgz"))
    .find((file) =>
      file.startsWith(`${pkg.name.replace(/^@/, "").replace(/\//g, "-")}-`),
    );

  if (!found) {
    throw new Error(`pnpm pack wrote no tarball for ${pkg.name}`);
  }
  return found;
}

/** The fixture's manifest: the tarballs, plus the peer dependencies a web consumer needs. */
function fixtureManifest(tarballs) {
  const web = JSON.parse(
    readFileSync(join(ROOT, "packages", "web", "package.json"), "utf8"),
  );
  const versions = {
    react: web.devDependencies.react,
    "react-dom": web.devDependencies["react-dom"],
    "@types/react": web.devDependencies["@types/react"],
    "@types/react-dom": web.devDependencies["@types/react-dom"],
    "@vitejs/plugin-react": web.devDependencies["@vitejs/plugin-react"],
    vite: web.devDependencies.vite,
    tailwindcss: "^4.3.3",
    "@tailwindcss/vite": "^4.3.3",
  };

  return `${JSON.stringify(
    {
      name: "asheeui-consumer-fixture",
      private: true,
      type: "module",
      scripts: { build: "vite build" },
      dependencies: {
        "@asheeui/core": `file:./${tarballs.core}`,
        "@asheeui/web": `file:./${tarballs.web}`,
        react: versions.react,
        "react-dom": versions["react-dom"],
      },
      devDependencies: {
        "@tailwindcss/vite": versions["@tailwindcss/vite"],
        "@types/react": versions["@types/react"],
        "@types/react-dom": versions["@types/react-dom"],
        "@vitejs/plugin-react": versions["@vitejs/plugin-react"],
        tailwindcss: versions.tailwindcss,
        vite: versions.vite,
      },
    },
    null,
    2,
  )}\n`;
}

/**
 * The fixture's pnpm settings.
 *
 * `@asheeui/web` declares `@asheeui/core` as a normal dependency, and the two versions
 * agree with the last release. Without the override pnpm satisfies that dependency from
 * the registry and installs the *published* core beside the packed web, which is not the
 * pair under test — and it hides a missing export by using an older copy of the package
 * that was supposed to provide it. pnpm reads workspace settings only from here, which is
 * also why this is a workspace file rather than a `pnpm` field in the manifest.
 */
function fixtureWorkspace(tarballs) {
  return [
    "packages:",
    '  - "."',
    "overrides:",
    `  "@asheeui/core": "file:./${tarballs.core}"`,
    `  "@asheeui/web": "file:./${tarballs.web}"`,
    "",
  ].join("\n");
}

/**
 * The fixture's sources.
 *
 * It is deliberately the documented consumer, not a tailored test: the stylesheet import
 * is the two-line one from the installation page, the provider wraps the tree, and the
 * component comes from the package entry.
 */
function fixtureFiles(tarballs) {
  return {
    "package.json": fixtureManifest(tarballs),
    "pnpm-workspace.yaml": fixtureWorkspace(tarballs),
    "index.html": [
      "<!doctype html>",
      '<html lang="en">',
      "  <head>",
      '    <meta charset="utf-8" />',
      '    <meta name="viewport" content="width=device-width, initial-scale=1" />',
      "    <title>AsheeUI consumer</title>",
      "  </head>",
      "  <body>",
      '    <div id="root"></div>',
      '    <script type="module" src="/src/main.tsx"></script>',
      "  </body>",
      "</html>",
      "",
    ].join("\n"),
    "vite.config.ts": [
      'import tailwindcss from "@tailwindcss/vite";',
      'import react from "@vitejs/plugin-react";',
      'import { defineConfig } from "vite";',
      "",
      "export default defineConfig({ plugins: [react(), tailwindcss()] });",
      "",
    ].join("\n"),
    "src/styles.css": [
      '@import "tailwindcss";',
      '@import "@asheeui/web/styles";',
      "",
    ].join("\n"),
    "src/main.tsx": [
      'import { AsheeUIProvider, Button } from "@asheeui/web";',
      'import { StrictMode } from "react";',
      'import { createRoot } from "react-dom/client";',
      'import "./styles.css";',
      "",
      'const root = document.getElementById("root");',
      'if (!root) throw new Error("the fixture has no root element");',
      "",
      "createRoot(root).render(",
      "  <StrictMode>",
      "    <AsheeUIProvider>",
      '      <Button color="primary">AsheeUI consumer build</Button>',
      "    </AsheeUIProvider>",
      "  </StrictMode>,",
      ");",
      "",
    ].join("\n"),
  };
}

/** Every file under `directory`, recursively. */
function walk(directory, out = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

/**
 * Pack every publishable package, install the tarballs into a fresh Vite application,
 * and build it.
 *
 * @returns A one-line summary of what was proved.
 * @throws When a step fails; the message carries the step, its output, and — for an
 *   install that could not reach the registry — that the tarballs themselves packed.
 */
export function verifyConsumer() {
  const packages = publishablePackages();
  if (packages.length === 0)
    throw new Error("no publishable package under packages/");

  const required = ["@asheeui/web", "@asheeui/core"];
  const missing = required.filter(
    (name) => !packages.some((pkg) => pkg.name === name),
  );
  if (missing.length > 0) {
    throw new Error(`no publishable package named ${missing.join(", ")}`);
  }

  const directory = mkdtempSync(join(tmpdir(), "asheeui-consumer-"));

  try {
    for (const pkg of packages) {
      // No package defines `prepack`/`prepare`, so packing runs no lifecycle script; the
      // tarball is the built output this check is about, not a fresh build.
      runPnpm(["pack", "--pack-destination", directory], {
        cwd: pkg.directory,
        timeout: TIMEOUTS.pack,
        step: `pack ${pkg.name}`,
      });
      pkg.tarball = tarballFor(directory, pkg);
    }

    const tarballs = Object.fromEntries(
      required.map((name) => [
        name.slice(1).split("/")[1],
        packages.find((pkg) => pkg.name === name).tarball,
      ]),
    );

    for (const [name, source] of Object.entries(fixtureFiles(tarballs))) {
      const file = join(directory, name);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, source, "utf8");
    }

    try {
      runPnpm(["install", "--no-frozen-lockfile", "--ignore-scripts"], {
        cwd: directory,
        timeout: TIMEOUTS.install,
        step: "install the fixture",
      });
    } catch (error) {
      if (error instanceof Error && REGISTRY_PATTERN.test(error.message)) {
        throw new Error(
          `the npm registry was unreachable, so the fixture could not install React and Vite beside the packed tarballs (${packages.length} tarball(s) packed successfully).\n\n${error.message}`,
        );
      }
      throw error;
    }

    // The installed package has to be the packed one, not a workspace link.
    const installed = JSON.parse(
      readFileSync(
        join(directory, "node_modules", "@asheeui", "web", "package.json"),
        "utf8",
      ),
    );
    const packed = packages.find((pkg) => pkg.name === "@asheeui/web");
    if (installed.version !== packed.version) {
      throw new Error(
        `the fixture installed @asheeui/web ${installed.version} instead of the packed ${packed.version}`,
      );
    }

    runPnpm(["run", "build"], {
      cwd: directory,
      timeout: TIMEOUTS.build,
      step: "build the fixture",
    });

    const dist = join(directory, "dist");
    const files = walk(dist);
    const script = files.find((file) => file.endsWith(".js"));
    const style = files.find((file) => file.endsWith(".css"));

    if (!existsSync(join(dist, "index.html")) || !script) {
      throw new Error("the fixture built no index.html or JavaScript bundle");
    }
    if (!style) {
      throw new Error(
        "the fixture built no stylesheet, so `@asheeui/web/styles` did not resolve",
      );
    }

    const scriptText = readFileSync(script, "utf8");
    if (!scriptText.includes("AsheeUI consumer build")) {
      throw new Error(
        "the built bundle does not contain the rendered component",
      );
    }

    // `--ashee-background` is declared by the framework stylesheet's `@theme` block, so
    // its presence proves the library CSS made it through Tailwind rather than only the
    // import resolving to nothing.
    const styleText = readFileSync(style, "utf8");
    if (!styleText.includes("--ashee-background")) {
      throw new Error(
        "the built stylesheet does not contain the framework's theme variables",
      );
    }

    const kilobytes = (file) => Math.round(statSync(file).size / 1024);

    return `Consumer: ${packages.length} tarball(s) packed and installed; a Vite + React + Tailwind app built ${kilobytes(script)} kB of JS and ${kilobytes(style)} kB of CSS from them.`;
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

const invokedDirectly =
  process.argv[1] !== undefined &&
  pathToFileURL(process.argv[1]).href === import.meta.url;

if (invokedDirectly) {
  try {
    console.log(verifyConsumer());
  } catch (error) {
    console.log(
      `Consumer: ${error instanceof Error ? error.message : String(error)}`,
    );
    console.log(
      "\nBuild first: the tarballs must carry dist. The temporary fixture directory is removed on exit.",
    );
    process.exitCode = 1;
  }
}

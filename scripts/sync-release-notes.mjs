/**
 * Print, or apply, the release body a version's changelog section describes.
 *
 * A GitHub release body is generated from the changelog at the moment the release
 * is published, so it is only as complete as the changelog was then. `asheeui`
 * `2.0.0` was versioned by hand rather than through `changeset version`, so its
 * release carried the previous version's section as its body and the notes written
 * for `2.0.0` were never reachable from it. This reads the section a version owns,
 * adds the documentation link when that document exists, and prints it, which is
 * what the body should say.
 *
 * Run from the repository root:
 *
 * ```sh
 * node scripts/sync-release-notes.mjs asheeui 2.0.0
 * ```
 *
 * Applying it writes to the release carrying the same tag, and needs a token that
 * may edit releases:
 *
 * ```sh
 * GITHUB_TOKEN=<token> node scripts/sync-release-notes.mjs asheeui 2.0.0 --apply
 * ```
 */

import { promises as fs } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** The repository, which is where the changelogs and the release both live. */
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Arguments, with the switches separated from the values. */
const args = process.argv.slice(2);
const apply = args.includes("--apply");
const [packageName, version] = args.filter((value) => !value.startsWith("--"));

/**
 * Read a JSON file.
 *
 * @param path - Absolute path of the file.
 * @returns The parsed contents.
 */
async function readJson(path) {
  return JSON.parse(await fs.readFile(path, "utf8"));
}

/**
 * Find the directory of a workspace package.
 *
 * @param name - Package name, as its manifest states it.
 * @returns The absolute directory, or undefined when no package matches.
 */
async function packageDirectory(name) {
  const packages = await fs.readdir(join(repositoryRoot, "packages"));

  for (const entry of packages) {
    const directory = join(repositoryRoot, "packages", entry);

    if ((await readJson(join(directory, "package.json"))).name === name) {
      return directory;
    }
  }

  return undefined;
}

/**
 * Take the section one version owns out of a changelog.
 *
 * @param changelog - The changelog's contents.
 * @param wanted - The version whose section is wanted.
 * @returns The section, without its heading, or undefined when it is not there.
 */
function sectionFor(changelog, wanted) {
  const lines = changelog.split("\n");
  const start = lines.findIndex((line) => line.trim() === `## ${wanted}`);

  if (start === -1) return undefined;

  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => line.startsWith("## "));

  return (end === -1 ? rest : rest.slice(0, end)).join("\n").trim();
}

/**
 * Report every version a changelog carries, so a typo is obvious.
 *
 * @param changelog - The changelog's contents.
 * @returns The versions, in the order they appear.
 */
function versionsIn(changelog) {
  return changelog
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => line.slice(3).trim());
}

/**
 * The owner and repository a release is published to.
 *
 * @returns `owner/repository`, taken from the root manifest.
 */
async function repositorySlug() {
  const manifest = await readJson(join(repositoryRoot, "package.json"));

  return String(manifest.repository?.url ?? "")
    .replace(/^git\+/, "")
    .replace(/^https:\/\/github\.com\//, "")
    .replace(/\.git$/, "");
}

/**
 * Compose the body: the changelog section, then the documentation when a document
 * exists for the version.
 *
 * @param section - The changelog section for the version.
 * @param wanted - The version.
 * @param slug - `owner/repository`, for the documentation link.
 * @returns The body.
 */
async function bodyFor(section, wanted, slug) {
  const document = `docs/release-${wanted}.md`;
  const exists = await fs
    .access(join(repositoryRoot, document))
    .then(() => true)
    .catch(() => false);

  if (!exists) return `${section}\n`;

  return `${section}\n\n---\n\nThe full notes, including what is deferred and why, are in [\`${document}\`](https://github.com/${slug}/blob/main/${document}).\n`;
}

/**
 * The headers every request carries.
 *
 * @param token - A token that may read or edit releases.
 * @returns The headers.
 */
function headers(token) {
  return {
    accept: "application/vnd.github+json",
    authorization: `Bearer ${token}`,
    "content-type": "application/json",
    "user-agent": "asheeui-release-notes",
  };
}

/**
 * Find the release carrying a tag.
 *
 * @param slug - `owner/repository`.
 * @param tag - The tag the release carries.
 * @param token - A token that may read releases.
 * @returns The release, or undefined when there is none.
 */
async function releaseFor(slug, tag, token) {
  const response = await fetch(
    `https://api.github.com/repos/${slug}/releases/tags/${encodeURIComponent(tag)}`,
    { headers: headers(token) },
  );

  return response.status === 404 ? undefined : response.json();
}

/**
 * Replace the body of a release.
 *
 * @param slug - `owner/repository`.
 * @param id - The release identifier.
 * @param body - The body to write.
 * @param token - A token that may edit releases.
 * @returns The release, as the API returns it.
 */
async function writeBody(slug, id, body, token) {
  const response = await fetch(
    `https://api.github.com/repos/${slug}/releases/${id}`,
    {
      method: "PATCH",
      headers: headers(token),
      body: JSON.stringify({ body }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `the API answered ${response.status}: ${await response.text()}`,
    );
  }

  return response.json();
}

if (!packageName || !version) {
  console.error(
    "usage: node scripts/sync-release-notes.mjs <package> <version> [--apply]",
  );
  process.exit(1);
}

const directory = await packageDirectory(packageName);

if (!directory) {
  console.error(`no workspace package is named ${packageName}`);
  process.exit(1);
}

const changelog = await fs.readFile(join(directory, "CHANGELOG.md"), "utf8");
const section = sectionFor(changelog, version);

if (!section) {
  console.error(
    `${packageName} has no ${version} section; it carries ${versionsIn(changelog).join(", ")}`,
  );
  process.exit(1);
}

const slug = await repositorySlug();
const body = await bodyFor(section, version, slug);
const tag = `${packageName}@${version}`;

if (!apply) {
  console.log(`# ${tag}\n\n${body}`);
  console.log(
    "(pass --apply with GITHUB_TOKEN set to write this to the release)",
  );
  process.exit(0);
}

const token = process.env.GITHUB_TOKEN;

if (!token) {
  console.error("--apply needs GITHUB_TOKEN: a token that may edit releases");
  process.exit(1);
}

const release = await releaseFor(slug, tag, token);

if (!release) {
  console.error(`${slug} has no release tagged ${tag}`);
  process.exit(1);
}

const written = await writeBody(slug, release.id, body, token);

console.log(
  `updated ${written.html_url} (${body.length} characters, was ${release.body?.length ?? 0})`,
);

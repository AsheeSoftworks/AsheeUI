import { join } from "node:path";
import { STYLES_IMPORT_MARKER } from "../../utils/audit";
import { pathExists } from "../common/file-utils";
import type {
  FileEdit,
  IntegrationContext,
  IntegrationResult,
  IntegrityCheck,
} from "../common/types";
import { defaultConfigContent } from "../init/templates";
import { relativeImport } from "./helpers";
import { resolveGlobalCss, resolveRouterOrEntryPoint } from "./resolvers";

/**
 * Build the {@link IntegrationResult} describing every change required
 * to wire AsheeUI into a TanStack Start project.
 *
 * Performs the following steps:
 * 1. Create the `asheeui.config.*` file when missing.
 * 2. Inject `@import "asheeui/styles";` into the project's global
 *    stylesheet (right under `@import "tailwindcss";`).
 * 3. Wrap `{children}` inside `<AsheeProvider config={config}>` in the
 *    root route file (`src/routes/__root.tsx` or `app/routes/__root.tsx`)
 *    and add `suppressHydrationWarning` to the `<html>` tag.
 *
 * @param ctx - {@link IntegrationContext} for the TanStack Start project.
 * @returns A populated {@link IntegrationResult}.
 *
 * @example
 * ```ts
 * const result = await buildTanStackStartIntegration({
 *   directory: process.cwd(),
 *   framework: "tanstack-start",
 *   structure,
 * });
 * ```
 */
export async function buildTanStackStartIntegration(
  ctx: IntegrationContext,
): Promise<IntegrationResult> {
  const { directory, structure } = ctx;
  const providerName = "AsheeProvider";

  // Priority: Always prefer __root.tsx for tanstack-start over router.tsx
  let rootRouteFile = await resolveRouterOrEntryPoint(
    directory,
    "tanstack-start",
  );
  if (!rootRouteFile && structure.entryPoint) {
    rootRouteFile = structure.entryPoint;
  }

  const cssFile = await resolveGlobalCss(directory);
  const configFile =
    structure.language === "typescript"
      ? "asheeui.config.ts"
      : "asheeui.config.js";

  const fileEdits: FileEdit[] = [];
  const integrityChecks: IntegrityCheck[] = [];
  const summary: string[] = [];

  const configPath = join(directory, configFile);
  const fileWrites: IntegrationResult["fileWrites"] = [];

  // Only create config if it does not already exist
  if (!(await pathExists(configPath))) {
    fileWrites.push({
      path: configPath,
      content: defaultConfigContent(structure.language),
      description: `Create ${configFile}`,
    });
    summary.push(`create ${configFile}`);
  } else {
    summary.push(`skip creating ${configFile} (already exists)`);
  }

  // 1. CSS Injection
  if (cssFile) {
    const cssRelative = toProjectRelative(directory, cssFile);
    fileEdits.push({
      path: cssFile,
      search: `@import "tailwindcss";`,
      replace: `@import "tailwindcss";\n@import "asheeui/styles";`,
      skipIfContentIncludes: STYLES_IMPORT_MARKER,
      notFoundMessage: `Could not find @import "tailwindcss"; in ${cssRelative}`,
      description: `Add asheeui styles import to ${cssRelative}`,
    });
    summary.push(`add asheeui styles import to ${cssRelative}`);
  }

  // 2. __root.tsx Integration
  if (rootRouteFile) {
    const rootRelative = toProjectRelative(directory, rootRouteFile);
    const configRel = relativeImport(rootRouteFile, configPath);

    // Import AsheeProvider and the generated config
    fileEdits.push({
      path: rootRouteFile,
      search: `import { HeadContent`,
      replace: `import { ${providerName} } from "asheeui";\nimport config from "${configRel}";\nimport { HeadContent`,
      skipIfContentIncludes: `from "asheeui"`,
      notFoundMessage: `Could not find import statement in ${rootRelative}`,
      description: `Import ${providerName} and config in ${rootRelative}`,
    });

    // Ensure suppressHydrationWarning is on <html ...>
    fileEdits.push({
      path: rootRouteFile,
      search: `<html lang="en">`,
      replace: `<html lang="en" suppressHydrationWarning>`,
      skipIfContentIncludes: "suppressHydrationWarning",
      notFoundMessage: `Could not inject suppressHydrationWarning (or custom <html ...> tag present) in ${rootRelative}`,
      description: `Add suppressHydrationWarning to <html /> in ${rootRelative}`,
    });

    // Wrap {children} with <AsheeProvider config={config}>
    fileEdits.push({
      path: rootRouteFile,
      search: `{children}`,
      replace: `<${providerName} config={config}>{children}</${providerName}>`,
      skipIfContentIncludes: `<${providerName}`,
      notFoundMessage: `Could not find {children} in ${rootRelative}`,
      description: `Wrap {children} with <${providerName}> in ${rootRelative}`,
    });

    integrityChecks.push({
      projectRelativeFile: rootRelative,
      pattern: providerName,
      message: `Wrap {children} with <${providerName}> in ${rootRelative}`,
    });

    summary.push(`wrap {children} with ${providerName} in ${rootRelative}`);
  }

  return {
    fileWrites,
    fileEdits,
    integrityChecks,
    dependenciesToInstall: ["asheeui"],
    summary,
  };
}

/**
 * Strip the `directory/` prefix from an absolute path to produce a
 * project-relative path for CLI output.
 *
 * @param directory - Project directory prefix to strip.
 * @param file - Absolute file path.
 * @returns A project-relative path string.
 */
function toProjectRelative(directory: string, file: string): string {
  const rel = file.replace(`${directory}/`, "");
  return rel === file ? file : rel;
}

/**
 * Vite + React integration builder for AsheeUI CLI.
 * This module provides the buildViteIntegration function that generates
 * all file writes, edits, and integrity checks required to wire AsheeUI
 * into a Vite + React project.
 */

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
 * to wire AsheeUI into a Vite + React project.
 *
 * Performs three logical steps:
 * 1. Create the `asheeui.config.*` file when it does not already exist.
 * 2. Inject `@import "asheeui/styles";` into the project's global
 *    stylesheet (right under `@import "tailwindcss";`).
 * 3. Wrap the application's entry component with `<AsheeUIProvider
 *    config={config}>`, passing the runtime config straight to the
 *    provider.
 *
 * @param ctx - {@link IntegrationContext} for the Vite project.
 * @returns A populated {@link IntegrationResult}.
 *
 * @example
 * ```ts
 * const result = await buildViteIntegration({
 *   directory: process.cwd(),
 *   framework: "vite-react",
 *   structure,
 * });
 * ```
 */
export async function buildViteIntegration(
  ctx: IntegrationContext,
): Promise<IntegrationResult> {
  const { directory, structure } = ctx;
  const providerName = "AsheeUIProvider";
  const configFile =
    structure.language === "typescript"
      ? "asheeui.config.ts"
      : "asheeui.config.js";

  // Resolve entry and CSS dynamically
  const entry =
    structure.entryPoint ??
    (await resolveRouterOrEntryPoint(directory, "vite-react"));
  const indexCssPath = await resolveGlobalCss(directory);

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

  // 1. Add asheeui styles import to the global stylesheet
  if (indexCssPath) {
    const cssRelative = toProjectRelative(directory, indexCssPath);
    fileEdits.push({
      path: indexCssPath,
      search: `@import "tailwindcss";`,
      replace: `@import "tailwindcss";\n@import "asheeui/styles";`,
      skipIfContentIncludes: STYLES_IMPORT_MARKER,
      notFoundMessage: `Could not find @import "tailwindcss"; in ${cssRelative}`,
      description: `Add asheeui styles import to ${cssRelative}`,
    });
    summary.push(`add asheeui styles import to ${cssRelative}`);
  } else {
    summary.push("skip CSS injection (no global stylesheet found)");
  }

  // 2. Update entry point (e.g. main.tsx) imports and provider wrapping
  if (entry) {
    const projectRelativeEntry = toProjectRelative(directory, entry);
    const configRel = relativeImport(entry, configPath);

    fileEdits.push(
      {
        path: entry,
        search: `import { StrictMode } from "react";`,
        replace: `import { StrictMode } from "react";\nimport { ${providerName} } from "asheeui";\nimport config from "${configRel}";`,
        skipIfContentIncludes: `from "asheeui"`,
        notFoundMessage: `Could not find StrictMode import in ${projectRelativeEntry}`,
        description: `Import ${providerName} and config in ${projectRelativeEntry}`,
      },
      {
        path: entry,
        search: `<StrictMode>`,
        replace: `<StrictMode>\n    <${providerName} config={config}>`,
        skipIfContentIncludes: `<${providerName}`,
        notFoundMessage: `Could not find <StrictMode> in ${projectRelativeEntry}`,
        description: `Wrap <StrictMode> with <${providerName}> in ${projectRelativeEntry}`,
      },
      {
        path: entry,
        search: `</StrictMode>`,
        replace: `    </${providerName}>\n  </StrictMode>`,
        skipIfContentIncludes: `</${providerName}>`,
        notFoundMessage: `Could not find </StrictMode> in ${projectRelativeEntry}`,
        description: `Close <${providerName}> wrapping in ${projectRelativeEntry}`,
      },
    );

    integrityChecks.push({
      projectRelativeFile: projectRelativeEntry,
      pattern: providerName,
      message: `Add <${providerName}> around your app in ${projectRelativeEntry}`,
    });

    summary.push(`wrap ${projectRelativeEntry} with ${providerName}`);
  } else {
    summary.push("skip entry wrapping (no src/main.* entry found)");
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

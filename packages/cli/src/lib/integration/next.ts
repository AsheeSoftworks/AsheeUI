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
 * to wire AsheeUI into a Next.js project.
 *
 * Performs the following steps:
 * 1. Create the `asheeui.config.*` file when missing.
 * 2. Inject `@import "asheeui/styles";` into the project's global
 *    stylesheet (right under `@import "tailwindcss";`).
 * 3. Wrap `{children}` (App Router) or `<Component />` (Pages Router)
 *    inside `<AsheeProvider config={config}>` in the layout / `_app`
 *    file, feeding the runtime config straight to the provider.
 *
 * @param ctx - {@link IntegrationContext} for the Next.js project.
 * @returns A populated {@link IntegrationResult}.
 *
 * @example
 * ```ts
 * const result = await buildNextIntegration({
 *   directory: process.cwd(),
 *   framework: "next",
 *   structure,
 * });
 * ```
 */
export async function buildNextIntegration(
  ctx: IntegrationContext,
): Promise<IntegrationResult> {
  const { directory, structure } = ctx;
  const providerName = "AsheeProvider";

  const globalsCssPath = await resolveGlobalCss(directory);
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

  // 1. Update Global CSS
  if (globalsCssPath) {
    const cssRelative = toProjectRelative(directory, globalsCssPath);
    fileEdits.push({
      path: globalsCssPath,
      search: `@import "tailwindcss";`,
      replace: `@import "tailwindcss";\n@import "asheeui/styles";`,
      skipIfContentIncludes: STYLES_IMPORT_MARKER,
      notFoundMessage: `Could not find @import "tailwindcss"; in ${cssRelative}`,
      description: `Add asheeui styles import to ${cssRelative}`,
    });
    summary.push(`add asheeui styles import to ${cssRelative}`);
  }

  // 2. Wrap the App or Pages Router Entry Point
  if (structure.nextRouter === "app") {
    const layout =
      structure.entryPoint ??
      (await resolveRouterOrEntryPoint(directory, "next"));

    if (layout) {
      const layoutRelative = toProjectRelative(directory, layout);

      // Import the runtime provider and the generated config
      const configRel = relativeImport(layout, configPath);
      fileEdits.push({
        path: layout,
        search: `import type { Metadata } from "next";`,
        replace: `import type { Metadata } from "next";\nimport { ${providerName} } from "asheeui";\nimport config from "${configRel}";`,
        skipIfContentIncludes: `from "asheeui"`,
        notFoundMessage: `Could not find Metadata import in ${layoutRelative}`,
        description: `Import ${providerName} and config in ${layoutRelative}`,
      });

      // Inject suppressHydrationWarning into <html ...> regardless of formatting
      fileEdits.push({
        path: layout,
        search: `<html`,
        replace: `<html suppressHydrationWarning`,
        skipIfContentIncludes: "suppressHydrationWarning",
        notFoundMessage: `Could not find <html tag in ${layoutRelative}`,
        description: `Add suppressHydrationWarning to <html /> in ${layoutRelative}`,
      });

      // Wrap {children} directly, passing the runtime config object
      fileEdits.push({
        path: layout,
        search: `{children}`,
        replace: `<${providerName} config={config}>{children}</${providerName}>`,
        skipIfContentIncludes: `<${providerName}`,
        notFoundMessage: `Could not find {children} in ${layoutRelative}`,
        description: `Wrap {children} with <${providerName}> in ${layoutRelative}`,
      });

      integrityChecks.push({
        projectRelativeFile: layoutRelative,
        pattern: providerName,
        message: `Wrap {children} with <${providerName}> in ${layoutRelative}`,
      });

      summary.push(
        `wrap {children} with <${providerName}> in ${layoutRelative}`,
      );
    }
  } else if (structure.nextRouter === "pages") {
    const appFile =
      structure.entryPoint ??
      (await resolveRouterOrEntryPoint(directory, "next"));

    if (appFile) {
      const appRelative = toProjectRelative(directory, appFile);

      const configRel = relativeImport(appFile, configPath);
      fileEdits.push(
        {
          path: appFile,
          search: `import type { AppProps } from "next/app";`,
          replace: `import type { AppProps } from "next/app";\nimport { ${providerName} } from "asheeui";\nimport config from "${configRel}";`,
          skipIfContentIncludes: `from "asheeui"`,
          notFoundMessage: `Could not find AppProps import in ${appRelative}`,
          description: `Import ${providerName} and config in ${appRelative}`,
        },
        {
          path: appFile,
          search: `<Component {...pageProps} />`,
          replace: `<${providerName} config={config}><Component {...pageProps} /></${providerName}>`,
          skipIfContentIncludes: `<${providerName}`,
          notFoundMessage: `Could not find <Component {...pageProps} /> in ${appRelative}`,
          description: `Wrap <Component /> with <${providerName}> in ${appRelative}`,
        },
      );

      integrityChecks.push({
        projectRelativeFile: appRelative,
        pattern: providerName,
        message: `Wrap <Component /> with <${providerName}> in ${appRelative}`,
      });

      summary.push(
        `wrap <Component /> with <${providerName}> in ${appRelative}`,
      );
    }
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

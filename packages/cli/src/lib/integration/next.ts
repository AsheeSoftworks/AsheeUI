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
import {
  resolveGlobalCss,
  resolveRouterOrEntryPoint,
  resolveViteOrAppConfig,
} from "./resolvers";

/**
 * Build the {@link IntegrationResult} describing every change required
 * to wire AsheeUI into a Next.js project.
 *
 * Performs the following steps:
 * 1. Create the `asheeui.config.*` file when missing.
 * 2. Inject `@import "asheeui/styles";` into the project's global
 *    stylesheet (right under `@import "tailwindcss";`).
 * 3. Wrap `next.config.*` with `withAsheeUI(nextConfig)`.
 * 4. Wrap `{children}` (App Router) or `<Component />` (Pages Router)
 *    inside `<AsheeUIProvider>` in the layout / `_app` file.
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
  const providerName = "AsheeUIProvider";

  const nextConfigPath = await resolveViteOrAppConfig(directory);
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

  // 2. Wrap Next.js Config
  if (nextConfigPath) {
    const configRelative = toProjectRelative(directory, nextConfigPath);

    fileEdits.push(
      {
        path: nextConfigPath,
        search: `import type { NextConfig } from "next";`,
        replace: `import { withAsheeUI } from "@asheeui/next";\nimport type { NextConfig } from "next";`,
        skipIfContentIncludes: "@asheeui/next",
        notFoundMessage: `Could not find NextConfig import in ${configRelative}`,
        description: `Import withAsheeUI in ${configRelative}`,
      },
      {
        path: nextConfigPath,
        search: `const nextConfig: NextConfig =`,
        replace: `const nextConfig: NextConfig =`,
        skipIfContentIncludes: "withAsheeUI(nextConfig)",
        notFoundMessage: `Could not find nextConfig in ${configRelative}`,
        description: `Verify nextConfig in ${configRelative}`,
      },
      {
        path: nextConfigPath,
        search: `};`,
        replace: `};\n\nexport default withAsheeUI(nextConfig);`,
        skipIfContentIncludes: "withAsheeUI(nextConfig)",
        notFoundMessage: `Could not find end of config block in ${configRelative}`,
        description: `Export wrapped nextConfig in ${configRelative}`,
      },
    );

    summary.push(`wrap next.config with withAsheeUI in ${configRelative}`);
  }

  // 3. Update App or Pages Router Entry Point
  if (structure.nextRouter === "app") {
    const layout =
      structure.entryPoint ??
      (await resolveRouterOrEntryPoint(directory, "next"));

    if (layout) {
      const layoutRelative = toProjectRelative(directory, layout);

      // Import AsheeUIProvider directly from asheeui
      fileEdits.push({
        path: layout,
        search: `import type { Metadata } from "next";`,
        replace: `import type { Metadata } from "next";\nimport { ${providerName} } from "asheeui";`,
        skipIfContentIncludes: `from "asheeui"`,
        notFoundMessage: `Could not find Metadata import in ${layoutRelative}`,
        description: `Import ${providerName} in ${layoutRelative}`,
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

      // Wrap {children} directly
      fileEdits.push({
        path: layout,
        search: `{children}`,
        replace: `<${providerName}>{children}</${providerName}>`,
        skipIfContentIncludes: `<${providerName}>`,
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

      fileEdits.push(
        {
          path: appFile,
          search: `import type { AppProps } from "next/app";`,
          replace: `import type { AppProps } from "next/app";\nimport { ${providerName} } from "asheeui";`,
          skipIfContentIncludes: `from "asheeui"`,
          notFoundMessage: `Could not find AppProps import in ${appRelative}`,
          description: `Import ${providerName} in ${appRelative}`,
        },
        {
          path: appFile,
          search: `<Component {...pageProps} />`,
          replace: `<${providerName}><Component {...pageProps} /></${providerName}>`,
          skipIfContentIncludes: `<${providerName}>`,
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
    dependenciesToInstall: ["asheeui", "@asheeui/next"],
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

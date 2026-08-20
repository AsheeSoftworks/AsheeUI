import { join } from "node:path";
import { defaultConfigContent } from "../templates";
import type {
  FileEdit,
  IntegrationContext,
  IntegrationResult,
  IntegrityCheck,
} from "../types";
import {
  resolveGlobalCss,
  resolveRouterOrEntryPoint,
  resolveViteOrAppConfig,
} from "./resolvers";
import { pathExists } from "../file-utils";

export async function buildTanStackStartIntegration(
  ctx: IntegrationContext,
): Promise<IntegrationResult> {
  const { directory, structure } = ctx;
  const providerName = "AsheeUIProvider";

  // Priority: Always prefer __root.tsx for tanstack-start over router.tsx
  let rootRouteFile = await resolveRouterOrEntryPoint(
    directory,
    "tanstack-start",
  );
  if (!rootRouteFile && structure.entryPoint) {
    rootRouteFile = structure.entryPoint;
  }

  const appConfigFile = await resolveViteOrAppConfig(directory);
  const cssFile = await resolveGlobalCss(directory);

  const fileEdits: FileEdit[] = [];
  const integrityChecks: IntegrityCheck[] = [];
  const summary: string[] = [];

  const configPath = join(directory, "asheeui.config.ts");
  const fileWrites: IntegrationResult["fileWrites"] = [];

  // Only create config if it does not already exist
  if (!(await pathExists(configPath))) {
    fileWrites.push({
      path: configPath,
      content: defaultConfigContent(structure.language),
      description: "Create asheeui.config.ts",
    });
    summary.push("create asheeui.config.ts");
  } else {
    summary.push("skip creating asheeui.config.ts (already exists)");
  }

  // 1. CSS Injection
  if (cssFile) {
    const cssRelative = toProjectRelative(directory, cssFile);
    fileEdits.push({
      path: cssFile,
      search: `@import "tailwindcss";`,
      replace: `@import "tailwindcss";\n@import "asheeui/styles";`,
      notFoundMessage: `Could not find @import "tailwindcss"; in ${cssRelative}`,
      description: `Add asheeui styles import to ${cssRelative}`,
    });
    summary.push(`add asheeui styles import to ${cssRelative}`);
  }

  // 2. Vite Config Injection
  if (appConfigFile) {
    const configRelative = toProjectRelative(directory, appConfigFile);
    fileEdits.push(
      {
        path: appConfigFile,
        search: `plugins: [`,
        replace: `plugins: [asheeui(), `,
        notFoundMessage: `Could not find plugins array in ${configRelative}`,
        description: `Register asheeui() plugin in ${configRelative}`,
      },
      {
        path: appConfigFile,
        search: `import { defineConfig } from "vite";`,
        replace: `import { defineConfig } from "vite";\nimport { asheeui } from "@asheeui/vite";`,
        notFoundMessage: `Could not find defineConfig import in ${configRelative}`,
        description: `Import asheeui from @asheeui/vite in ${configRelative}`,
      },
    );
    summary.push(`add asheeui() plugin to ${configRelative}`);
  }

  // 3. __root.tsx Integration
  if (rootRouteFile) {
    const rootRelative = toProjectRelative(directory, rootRouteFile);

    // Import AsheeUIProvider
    fileEdits.push({
      path: rootRouteFile,
      search: `import { HeadContent`,
      replace: `import { ${providerName} } from "asheeui";\nimport { HeadContent`,
      notFoundMessage: `Could not find import statement in ${rootRelative}`,
      description: `Import ${providerName} in ${rootRelative}`,
    });

    // Ensure suppressHydrationWarning is on <html ...>
    fileEdits.push({
      path: rootRouteFile,
      search: `<html lang="en">`,
      replace: `<html lang="en" suppressHydrationWarning>`,
      notFoundMessage: `Could not inject suppressHydrationWarning (or custom <html ...> tag present) in ${rootRelative}`,
      description: `Add suppressHydrationWarning to <html /> in ${rootRelative}`,
    });

    // Wrap {children} with <AsheeUIProvider>
    fileEdits.push({
      path: rootRouteFile,
      search: `{children}`,
      replace: `<${providerName}>{children}</${providerName}>`,
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
    dependenciesToInstall: ["asheeui", "@asheeui/vite"],
    summary,
  };
}

function toProjectRelative(directory: string, file: string): string {
  const rel = file.replace(`${directory}/`, "");
  return rel === file ? file : rel;
}

import { join } from "node:path";
import { defaultConfigContent, providerWrapperContent } from "../templates";
import type { FileEdit, IntegrationContext, IntegrityCheck } from "../types";
import { buildConfigImport, relativeImport } from "./helpers";

export function buildNextIntegration(ctx: IntegrationContext): {
  fileWrites: { path: string; content: string }[];
  fileEdits: FileEdit[];
  integrityChecks: IntegrityCheck[];
  dependenciesToInstall: string[];
  summary: string[];
} {
  const { directory, structure } = ctx;
  const configImport = buildConfigImport(
    join(directory, "components", "ashee-ui-provider.tsx"),
  );
  const providerComponentName = "AsheeProvider";
  const providerName = "AsheeUIProvider";
  const configPath = join(directory, "asheeui-config.ts");
  const providerPath = join(directory, "components", "ashee-ui-provider.tsx");

  const fileWrites = [
    {
      path: configPath,
      content: defaultConfigContent(structure.language),
    },
    {
      path: providerPath,
      content: providerWrapperContent({
        componentName: providerComponentName,
        providerName,
        configImport,
        hasNonAsheeChildren: true,
      }),
    },
  ];

  const fileEdits: FileEdit[] = [];
  const integrityChecks: IntegrityCheck[] = [];

  if (structure.nextRouter === "app") {
    const layout = structure.entryPoint ?? join(directory, "app", "layout.tsx");
    const layoutRelative = layout.replace(`${directory}/`, "");
    const providerImportPath = relativeImport(layout, providerPath);
    fileEdits.push({
      path: layout,
      search: `import type { Metadata } from "next";`,
      replace: `import type { Metadata } from "next";
import { ${providerComponentName} } from "${providerImportPath}"`,
      notFoundMessage: `Could not find next imports in ${layoutRelative}`,
    });

    fileEdits.push({
      path: layout,
      search: `{children}`,
      replace: `<${providerComponentName}>{children}</${providerComponentName}>`,
      notFoundMessage: `Could not find {children} in ${layoutRelative}`,
    });

    integrityChecks.push({
      projectRelativeFile: layoutRelative,
      pattern: providerComponentName,
      message: `Wrap {children} with <${providerComponentName}> in ${layoutRelative}`,
    });
  } else if (structure.nextRouter === "pages") {
    const appFile =
      structure.entryPoint ?? join(directory, "pages", "_app.tsx");
    const appRelative = appFile.replace(`${directory}/`, "");
    const providerImportPath = relativeImport(appFile, providerPath);

    fileEdits.push({
      path: appFile,
      search: `import type { AppProps } from "next/app";`,
      replace: `import type { AppProps } from "next/app";
import { ${providerComponentName} } from "${providerImportPath}"`,
      notFoundMessage: `Could not find AppProps import in ${appRelative}`,
    });

    fileEdits.push({
      path: appFile,
      search: `Component {...pageProps}`,
      replace: `<${providerComponentName}>
        <Component {...pageProps} />
      </${providerComponentName}>`,
      notFoundMessage: `Could not find <Component {...pageProps} /> in ${appRelative}`,
    });

    integrityChecks.push({
      projectRelativeFile: appRelative,
      pattern: providerComponentName,
      message: `Wrap <Component {...pageProps} /> with <${providerComponentName}> in ${appRelative}`,
    });
  } else {
    integrityChecks.push({
      projectRelativeFile: "app/layout.tsx",
      pattern: providerComponentName,
      message: `Create app/layout.tsx or pages/_app.tsx and wrap it with <${providerComponentName}>`,
    });
  }

  return {
    fileWrites,
    fileEdits,
    integrityChecks,
    dependenciesToInstall: [
      "asheeui",
      "asheeui",
      "@asheeui/settings",
      "@asheeui/utils",
    ],
    summary: [
      "created asheeui-config.ts",
      `created components/${providerPath.split("/").pop()}`,
    ],
  };
}

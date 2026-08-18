import { join } from "node:path";
import { defaultConfigContent } from "../templates";
import type { FileEdit, IntegrationContext, IntegrityCheck } from "../types";
import { buildConfigImport } from "./helpers";

export function buildTanStackStartIntegration(ctx: IntegrationContext): {
  fileWrites: { path: string; content: string }[];
  fileEdits: FileEdit[];
  integrityChecks: IntegrityCheck[];
  dependenciesToInstall: string[];
  summary: string[];
} {
  const { directory, structure } = ctx;
  const providerName = "AsheeUIProvider";
  const routerFile =
    structure.entryPoint ??
    firstOf([
      join(directory, "app", "router.tsx"),
      join(directory, "src", "router.tsx"),
    ]);
  const routerRelative = routerFile.replace(`${directory}/`, "");
  const configImport = buildConfigImport(routerFile);

  const fileWrites = [
    {
      path: join(directory, "asheeui-config.ts"),
      content: defaultConfigContent(structure.language),
    },
  ];

  const fileEdits: FileEdit[] = [];
  const integrityChecks: IntegrityCheck[] = [];

  fileEdits.push({
    path: routerFile,
    search: `import { createRootRoute } from "@tanstack/react-router"`,
    replace: `import { createRootRoute } from "@tanstack/react-router"
import { ${providerName} } from "asheeui"
import { config } from "${configImport}"`,
    notFoundMessage: `Could not find createRootRoute import in ${routerRelative}`,
  });

  integrityChecks.push({
    projectRelativeFile: routerRelative,
    pattern: providerName,
    message: `Wrap the root route with <${providerName}> in ${routerRelative}`,
  });

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
      `integrated ${providerName} into ${routerRelative}`,
    ],
  };
}

function firstOf(paths: string[]): string {
  return paths[0];
}

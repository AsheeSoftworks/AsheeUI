import { join } from "node:path";
import { defaultConfigContent } from "../templates";
import type { FileEdit, IntegrationContext, IntegrityCheck } from "../types";
import { buildConfigImport } from "./helpers";

export function buildViteIntegration(ctx: IntegrationContext): {
  fileWrites: { path: string; content: string }[];
  fileEdits: FileEdit[];
  integrityChecks: IntegrityCheck[];
  dependenciesToInstall: string[];
  summary: string[];
} {
  const { directory, structure } = ctx;
  const entry = structure.entryPoint ?? join(directory, "src", "main.tsx");
  const configImport = buildConfigImport(entry);
  const providerName = "AsheeUIProvider";
  const projectRelativeEntry = entry.replace(`${directory}/`, "");

  const fileWrites = [
    {
      path: join(directory, "asheeui-config.ts"),
      content: defaultConfigContent(structure.language),
    },
  ];

  const fileEdits: FileEdit[] = [
    {
      path: entry,
      search: `import { StrictMode } from "react";`,
      replace: `import { StrictMode } from "react";
import { ${providerName} } from "asheeui";
import { config } from "${configImport}";`,
    },
    {
      path: entry,
      search: `createRoot(document.getElementById("root")!).render(`,
      replace: `createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <${providerName} config={config}>`,
      notFoundMessage: `Could not find createRoot in ${projectRelativeEntry}`,
    },
    {
      path: entry,
      search: `  </StrictMode>,`,
      replace: `    </${providerName}>
  </StrictMode>,`,
      notFoundMessage: `Could not find closing StrictMode in ${projectRelativeEntry}`,
    },
  ];

  const integrityChecks: IntegrityCheck[] = [
    {
      projectRelativeFile: projectRelativeEntry,
      pattern: providerName,
      message: `Add <${providerName}> around your app in ${projectRelativeEntry}`,
    },
  ];

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
      `wrapped ${projectRelativeEntry} with ${providerName}`,
    ],
  };
}

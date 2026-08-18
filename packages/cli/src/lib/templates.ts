import type { IntegrityCheck } from "./types";

export function providerWrapperContent(opts: {
  componentName: string;
  providerName: string;
  configImport: string;
  hasNonAsheeChildren: boolean;
}): string {
  const { componentName, providerName, configImport, hasNonAsheeChildren } =
    opts;
  return `import type { ReactNode } from "react";
import { ${providerName} } from "asheeui";
import { config } from "${configImport}";

export interface ${componentName}Props {
  children: ReactNode;
}

export function ${componentName}({ children }: ${componentName}Props) {
  return (
    <${providerName} config={config}>
      ${hasNonAsheeChildren ? "{children}" : "<>{children}</>"}
    </${providerName}>
  );
}
`;
}

export function defaultConfigContent(
  language: "typescript" | "javascript",
): string {
  if (language === "typescript") {
    return `import type { ExternalConfig } from "asheeui";

export const config: ExternalConfig = {
  theme: {
    defaultTheme: "light",
    defaultVariant: "solid",
    defaultColor: "primary",
  },
  components: {},
};
`;
  }
  return `/** @type {import("asheeui").ExternalConfig} */
export const config = {
  theme: {
    defaultTheme: "light",
    defaultVariant: "solid",
    defaultColor: "primary",
  },
  components: {},
};
`;
}

export function isIntegrityFile(opts: {
  file: string;
  integrityChecks: IntegrityCheck[];
}): boolean {
  const { file, integrityChecks } = opts;
  return integrityChecks.some((check) => check.projectRelativeFile === file);
}

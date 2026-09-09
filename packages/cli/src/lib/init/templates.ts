/**
 * Template rendering utilities for AsheeUI CLI init command.
 * This module provides functions for generating provider wrapper content
 * and default configuration files.
 */

import type { IntegrityCheck } from "../common/types";

/**
 * Render the source code of a provider wrapper component.
 *
 * The wrapper imports `AsheeUIProvider` from `asheeui`, imports the
 * generated config, and renders `children` inside the provider. When
 * `hasNonAsheeChildren` is `false`, the children are wrapped in a
 * fragment so JSX still parses when the original entry file does not
 * contain a fragment.
 *
 * @param opts - Template options.
 * @param opts.componentName - Name of the wrapper component to emit.
 * @param opts.providerName - Name of the provider component to use.
 * @param opts.configImport - Relative import path for the config module.
 * @param opts.hasNonAsheeChildren - Whether the host already wraps children.
 * @returns A complete `.tsx` source string ready to write to disk.
 */
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

/**
 * Render the default contents of an `asheeui.config.ts` or `.js` file.
 *
 * The TypeScript variant uses an explicit `ExternalConfig` type; the
 * JavaScript variant uses a JSDoc typedef so editors still infer theming
 * options without a separate type step.
 *
 * @param language - Language variant to render.
 * @returns A complete configuration source string ready to write.
 *
 * @example
 * ```ts
 * const src = defaultConfigContent("typescript");
 * await fs.writeFile("asheeui.config.ts", src, "utf8");
 * ```
 */
export function defaultConfigContent(
  language: "typescript" | "javascript",
): string {
  if (language === "typescript") {
    return `import type { ExternalConfig } from "asheeui";

export const config: ExternalConfig = {
  defaultTheme: "light",
  defaultVariant: "solid",
  defaultColor: "primary",
  components: {},
};
`;
  }
  return `
export default const config = {
  defaultTheme: "light",
  defaultVariant: "solid",
  defaultColor: "primary",
  components: {},
};
`;
}

/**
 * Test whether `file` is one of the integrity-protected files that the
 * init flow needs to verify after writes and edits.
 *
 * @param opts - Lookup options.
 * @param opts.file - Project-relative file path to test.
 * @param opts.integrityChecks - Integrity checks collected from the integration.
 * @returns `true` when the file is referenced by any integrity check.
 */
export function isIntegrityFile(opts: {
  file: string;
  integrityChecks: IntegrityCheck[];
}): boolean {
  const { file, integrityChecks } = opts;
  return integrityChecks.some((check) => check.projectRelativeFile === file);
}

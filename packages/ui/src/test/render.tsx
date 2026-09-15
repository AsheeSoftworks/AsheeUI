/**
 * Render helper (`TEST-023`).
 *
 * Renders a component inside the framework provider using framework defaults,
 * or with an explicit configuration when a test needs one. Rendering through
 * the provider keeps configuration cascading exercised as it is in a consumer
 * application (`TEST-022`).
 */

import {
  type RenderOptions,
  type RenderResult,
  render,
} from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { AsheeUIProvider } from "../AsheeUIProvider";
import type { ExternalConfig } from "../config/config";

/** Options for {@link renderWithProvider}. */
export interface ProviderRenderOptions extends Omit<RenderOptions, "wrapper"> {
  /** Global configuration supplied to the provider. */
  config?: ExternalConfig;
}

/**
 * Render `ui` inside {@link AsheeUIProvider}.
 *
 * @param ui - Element under test.
 * @param options - Render options plus an optional global configuration.
 * @returns The standard testing-library render result.
 *
 * @example
 * ```tsx
 * const { getByRole } = renderWithProvider(<Button>Save</Button>);
 * ```
 */
export function renderWithProvider(
  ui: ReactElement,
  options: ProviderRenderOptions = {},
): RenderResult {
  const { config, ...renderOptions } = options;

  return render(ui, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <AsheeUIProvider config={config}>{children}</AsheeUIProvider>
    ),
    ...renderOptions,
  });
}

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";

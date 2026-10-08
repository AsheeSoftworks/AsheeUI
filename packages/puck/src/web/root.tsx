"use client";

/**
 * The page shell a published page renders into, on the web.
 *
 * A block resolves its theme through the framework provider, so the shell supplies one
 * when the consumer has not. An existing provider is respected rather than nested, so a
 * consumer's own configuration — a default theme, a component override — keeps applying
 * to a built page. That is the whole reason this reads the context instead of always
 * rendering a provider: a second provider would replace the resolved configuration with
 * the framework's own defaults.
 */

import { AsheeConfigContext, AsheeUIProvider } from "@asheeui/web";
import { useContext } from "react";
import type { AsheePuckRootProps } from "../shared";

/**
 * The published page's root.
 *
 * @param props - The page the builder composed.
 * @returns The page, inside the framework's provider when the application has none.
 */
export function PuckRoot({ children }: AsheePuckRootProps) {
  const existingConfig = useContext(AsheeConfigContext);

  const page = (
    <div className="flex min-h-dvh w-full flex-col bg-background text-foreground">
      {children}
    </div>
  );

  return existingConfig ? page : <AsheeUIProvider>{page}</AsheeUIProvider>;
}

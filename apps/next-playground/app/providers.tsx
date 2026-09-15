"use client";

import { AsheeUIProvider } from "asheeui";
import type { ReactNode } from "react";
import { config } from "../asheeui.config";

/**
 * The provider the root layout mounts.
 *
 * It is extracted so the end-to-end test renders exactly the tree the application
 * renders: a bare client island has no provider, because in an App Router
 * application the layout supplies it.
 *
 * @param props - The provider props.
 * @param props.children - The page being rendered.
 * @returns The application's provider.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <AsheeUIProvider config={config}>{children}</AsheeUIProvider>;
}

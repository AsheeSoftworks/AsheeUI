import { createRootRoute, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AsheeUIProvider } from "asheeui";
import { playgroundConfig } from "../playground-config";
import appCss from "../styles.css?url";

/**
 * The root route.
 *
 * Its shell is the document, which is where the provider lives: a consumer that
 * server-renders gets the provider in the same tree that the browser hydrates.
 */
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AsheeUI on TanStack Start" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootDocument,
});

/**
 * @param props - The shell props.
 * @param props.children - The matched route.
 * @returns The document.
 */
function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AsheeUIProvider config={playgroundConfig}>{children}</AsheeUIProvider>
        <Scripts />
      </body>
    </html>
  );
}

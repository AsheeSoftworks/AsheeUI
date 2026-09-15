import { createRootRoute, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";
import appCss from "../styles.css?url";

/**
 * The root route.
 *
 * Its shell is the document, and nothing else: the provider and the
 * configuration belong to the shared playground application the route renders,
 * so the root states only what the framework requires. The document arrives
 * server-rendered and hydrates in the browser, which is what the playground's
 * end-to-end tests assert.
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
        {children}
        <Scripts />
      </body>
    </html>
  );
}

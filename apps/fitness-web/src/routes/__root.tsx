import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { ToastProvider } from "asheeui";
import type { ReactNode } from "react";
import { AppShell } from "../shell/AppShell";
import { ThemeRoot } from "../shell/ThemeRoot";
import appCss from "../styles.css?url";

/** The HTML document, the provider, the toast queue and the top navigation. */
function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeRoot>
          <ToastProvider>
            <AppShell>{children}</AppShell>
          </ToastProvider>
        </ThemeRoot>
        <Scripts />
      </body>
    </html>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Pulse — a fitness tracker built with AsheeUI" },
      {
        name: "description",
        content:
          "The same fitness tracker on TanStack Start and Expo, importing the portable AsheeUI umbrella.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "data:," },
    ],
  }),
  shellComponent: RootDocument,
});

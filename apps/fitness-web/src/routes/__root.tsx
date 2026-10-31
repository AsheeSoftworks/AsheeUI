import { config } from "@asheeui/fitness-shared";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AsheeUIProvider, ToastProvider } from "asheeui";
import type { ReactNode } from "react";
import { AppShell } from "../shell/AppShell";
import appCss from "../styles.css?url";

/** The HTML document, the provider, the toast queue and the top navigation. */
function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <AsheeUIProvider config={config}>
          <ToastProvider>
            <AppShell>{children}</AppShell>
          </ToastProvider>
        </AsheeUIProvider>
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

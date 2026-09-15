import { PlaygroundProvider } from "@asheeui/e2e-gallery";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

/** Page metadata, as any Next.js application declares it. */
export const metadata: Metadata = {
  title: "AsheeUI on Next.js",
  description:
    "The AsheeUI end-to-end gallery rendered by a Next.js App Router application.",
};

/**
 * The root layout, a server component.
 *
 * The document and the framework's configuration boundary: the provider goes here
 * because the page renders more than one client island, and because that is the
 * setup the consumer documentation describes. The configuration itself comes from
 * the shared playground application.
 *
 * `suppressHydrationWarning` is on the `<html>` element because the pre-paint
 * theme script sets the theme class before the browser hydrates.
 *
 * @param props - The layout props.
 * @param props.children - The page being rendered.
 * @returns The document shell.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <PlaygroundProvider>{children}</PlaygroundProvider>
      </body>
    </html>
  );
}

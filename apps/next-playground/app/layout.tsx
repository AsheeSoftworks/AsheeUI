import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";

/** Page metadata, as any Next.js application declares it. */
export const metadata: Metadata = {
  title: "AsheeUI on Next.js",
  description:
    "The AsheeUI end-to-end gallery rendered by a Next.js App Router application.",
};

/**
 * The root layout, a server component.
 *
 * `suppressHydrationWarning` is on the `<html>` element because the pre-paint
 * theme script sets the theme class before the browser hydrates, which is the
 * setup the consumer documentation states.
 *
 * @param props - The layout props.
 * @param props.children - The page being rendered.
 * @returns The document shell.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

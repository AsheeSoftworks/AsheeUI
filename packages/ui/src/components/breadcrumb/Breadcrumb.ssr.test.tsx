// @vitest-environment node
/**
 * Server-rendering proof for Breadcrumb in a DOM-free environment.
 *
 * This file opts out of jsdom entirely, so any access to `window`, `document`
 * or another browser global during render fails the test rather than passing
 * silently against jsdom stubs. It is the browserless evidence for `TEST-034`.
 */

import { describe, expect, it } from "vitest";
import { renderToServerString } from "../../test";
import { Breadcrumb } from "./Breadcrumb";

const TRAIL = [
  { label: "Invoices", href: "/invoices" },
  { label: "March", href: "/invoices/2026-03" },
  { label: "INV-0042" },
];

describe("Breadcrumb server rendering (DOM-free environment)", () => {
  it("runs without DOM globals, so the render below is genuinely browserless", () => {
    expect(typeof document).toBe("undefined");
    expect(typeof window).toBe("undefined");
  });

  it("renders a named navigation landmark over an ordered list", () => {
    const html = renderToServerString(<Breadcrumb items={TRAIL} />);

    expect(html).toContain("<nav");
    expect(html).toContain('aria-label="Breadcrumb"');
    expect(html).toContain("<ol");
    expect(html).toContain('href="/invoices"');
  });

  it("renders the current location as the page rather than as a link", () => {
    const html = renderToServerString(<Breadcrumb items={TRAIL} />);

    expect(html).toContain('aria-current="page"');
    expect(html).toContain("INV-0042");
    expect(html).not.toContain('href="/invoices/2026-03/INV-0042"');
  });

  it("keeps the separators out of the accessibility tree", () => {
    const html = renderToServerString(<Breadcrumb items={TRAIL} />);

    expect(html).toContain('aria-hidden="true"');
  });
});

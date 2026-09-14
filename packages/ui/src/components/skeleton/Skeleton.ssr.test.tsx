// @vitest-environment node
/**
 * Server-rendering proof for Skeleton in a DOM-free environment.
 *
 * This file opts out of jsdom entirely, so any access to `window`, `document`
 * or another browser global during render fails the test rather than passing
 * silently against jsdom stubs. It is the browserless evidence for `TEST-034`.
 */

import { describe, expect, it } from "vitest";
import { renderToServerString } from "../../test";
import { Skeleton } from "./Skeleton";

describe("Skeleton server rendering (DOM-free environment)", () => {
  it("runs without DOM globals, so the render below is genuinely browserless", () => {
    expect(typeof document).toBe("undefined");
    expect(typeof window).toBe("undefined");
  });

  it("renders a decorative placeholder", () => {
    const html = renderToServerString(<Skeleton className="h-4 w-40" />);

    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("h-4 w-40");
    expect(html).toContain("motion-safe:animate-pulse");
  });

  it("renders a labelled busy status", () => {
    const html = renderToServerString(
      <Skeleton isBusy label="Loading invoices" />,
    );

    expect(html).toContain('role="status"');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain("Loading invoices");
    expect(html).not.toContain('aria-hidden="true"');
  });
});

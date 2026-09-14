// @vitest-environment node
/**
 * Server-rendering proof for Badge in a DOM-free environment.
 *
 * This file opts out of jsdom entirely, so any access to `window`, `document`
 * or another browser global during render fails the test rather than passing
 * silently against jsdom stubs. It is the browserless evidence for `TEST-034`
 * that a framework which server-renders its client components, as Next.js does
 * for every component marked `"use client"`, gets real markup.
 */

import { describe, expect, it } from "vitest";
import { renderToServerString } from "../../test";
import { Badge } from "./Badge";

describe("Badge server rendering (DOM-free environment)", () => {
  it("runs without DOM globals, so the render below is genuinely browserless", () => {
    expect(typeof document).toBe("undefined");
    expect(typeof window).toBe("undefined");
  });

  it("renders its content with the resolved colour", () => {
    const html = renderToServerString(<Badge color="success">Active</Badge>);

    expect(html).toContain("<span");
    expect(html).toContain("Active");
    expect(html).toContain("success");
  });

  it("renders an icon-only badge with its label as content", () => {
    const html = renderToServerString(<Badge label="Active" />);

    expect(html).toContain("sr-only");
    expect(html).toContain("Active");
  });
});

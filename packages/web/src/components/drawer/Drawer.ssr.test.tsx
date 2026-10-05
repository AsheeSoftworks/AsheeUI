// @vitest-environment node
/**
 * Server-rendering proof for Drawer in a DOM-free environment.
 *
 * This file opts out of jsdom entirely, so any access to `window`, `document`
 * or another browser global during render fails the test rather than passing
 * silently against jsdom stubs. It is the browserless evidence for `TEST-034`
 * and for the SSR-safe portal obligation in `COMP-036`.
 */

import { describe, expect, it } from "vitest";
import { renderToServerString } from "../../test";
import { Drawer } from "./Drawer";

describe("Drawer server rendering (DOM-free environment)", () => {
  it("runs without DOM globals, so the render below is genuinely browserless", () => {
    expect(typeof document).toBe("undefined");
    expect(typeof window).toBe("undefined");
  });

  it("renders no dialog markup on the server, because the portal is client only", () => {
    const html = renderToServerString(
      <Drawer isOpen aria-label="Server drawer" onClose={() => {}}>
        Drawer content
      </Drawer>,
    );

    expect(html).not.toContain("dialog");
    expect(html).not.toContain("Drawer content");
  });

  it("renders the closed state without a dialog", () => {
    const html = renderToServerString(
      <Drawer isOpen={false} onClose={() => {}}>
        Drawer content
      </Drawer>,
    );

    expect(html).not.toContain("dialog");
  });
});

// @vitest-environment node
/**
 * Server-rendering proof for Modal in a DOM-free environment.
 *
 * This file opts out of jsdom entirely, so any access to `window`, `document`
 * or another browser global during render fails the test rather than passing
 * silently against jsdom stubs. It is the browserless evidence for `TEST-034`
 * and for the SSR-safe portal obligation in `COMP-035`.
 */

import { describe, expect, it } from "vitest";
import { renderToServerString } from "../../test";
import { Modal } from "./Modal";

describe("Modal server rendering (DOM-free environment)", () => {
  it("runs without DOM globals, so the render below is genuinely browserless", () => {
    expect(typeof document).toBe("undefined");
    expect(typeof window).toBe("undefined");
  });

  it("renders no dialog markup on the server, because the portal is client only", () => {
    const html = renderToServerString(
      <Modal isOpen aria-label="Server dialog" onClose={() => {}}>
        Modal content
      </Modal>,
    );

    expect(html).not.toContain("dialog");
    expect(html).not.toContain("Modal content");
  });

  it("renders the closed state without a dialog", () => {
    const html = renderToServerString(
      <Modal isOpen={false} onClose={() => {}}>
        Modal content
      </Modal>,
    );

    expect(html).not.toContain("dialog");
  });
});

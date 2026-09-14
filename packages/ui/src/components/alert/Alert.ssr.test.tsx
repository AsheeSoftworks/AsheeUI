// @vitest-environment node
/**
 * Server-rendering proof for Alert in a DOM-free environment.
 *
 * This file opts out of jsdom entirely, so any access to `window`, `document`
 * or another browser global during render fails the test rather than passing
 * silently against jsdom stubs. It is the browserless evidence for `TEST-034`.
 */

import { describe, expect, it } from "vitest";
import { renderToServerString } from "../../test";
import { Alert } from "./Alert";

describe("Alert server rendering (DOM-free environment)", () => {
  it("runs without DOM globals, so the render below is genuinely browserless", () => {
    expect(typeof document).toBe("undefined");
    expect(typeof window).toBe("undefined");
  });

  it("renders an urgent message as an alert", () => {
    const html = renderToServerString(
      <Alert type="error" title="Payment failed">
        The card was declined.
      </Alert>,
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain("Payment failed");
    expect(html).toContain("The card was declined.");
    expect(html).toContain("danger");
  });

  it("renders an informational message as a status", () => {
    const html = renderToServerString(
      <Alert type="info" title="Update">
        A new version is available.
      </Alert>,
    );

    expect(html).toContain('role="status"');
    expect(html).not.toContain('role="alert"');
  });

  it("renders a labelled dismiss control when it is closable", () => {
    const html = renderToServerString(
      <Alert isClosable onClose={() => {}} closeLabel="Dismiss update notice">
        A new version is available.
      </Alert>,
    );

    expect(html).toContain("<button");
    expect(html).toContain('aria-label="Dismiss update notice"');
  });
});

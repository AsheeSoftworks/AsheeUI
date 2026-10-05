// @vitest-environment node
/**
 * Server-rendering proof for Avatar in a DOM-free environment.
 *
 * This file opts out of jsdom entirely, so any access to `window`, `document`
 * or another browser global during render fails the test rather than passing
 * silently against jsdom stubs. It is the browserless evidence for `TEST-034`,
 * and it matters most here because the avatar renders the framework's `Image`
 * primitive, whose own behaviour must also stay browserless.
 */

import { describe, expect, it } from "vitest";
import { renderToServerString } from "../../test";
import { Avatar } from "./Avatar";

describe("Avatar server rendering (DOM-free environment)", () => {
  it("runs without DOM globals, so the render below is genuinely browserless", () => {
    expect(typeof document).toBe("undefined");
    expect(typeof window).toBe("undefined");
  });

  it("renders the entity as a named image with its initials", () => {
    const html = renderToServerString(<Avatar name="Ada Lovelace" />);

    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Ada Lovelace"');
    expect(html).toContain("AL");
  });

  it("renders the picture as decoration beside the name", () => {
    const html = renderToServerString(
      <Avatar name="Ada Lovelace" src="/ada.png" />,
    );

    expect(html).toContain("<img");
    expect(html).toContain('alt=""');
    expect(html).toContain('role="img"');
  });

  it("renders an unnamed avatar out of the accessibility tree", () => {
    const html = renderToServerString(<Avatar src="/logo.png" />);

    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain("aria-label");
  });
});

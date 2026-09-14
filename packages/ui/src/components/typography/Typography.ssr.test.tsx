// @vitest-environment node
/**
 * Server-rendering proof for Typography in a DOM-free environment.
 *
 * This file opts out of jsdom entirely, so any access to `window`, `document`
 * or another browser global during render fails the test rather than passing
 * silently against jsdom stubs. It is the browserless evidence for `TEST-034`
 * and for the SSR claim in the Milestone M2 report.
 */

import { describe, expect, it } from "vitest";
import { renderToServerString } from "../../test";
import { Typography } from "./Typography";

describe("Typography server rendering (DOM-free environment)", () => {
  it("runs without DOM globals, so the render below is genuinely browserless", () => {
    expect(typeof document).toBe("undefined");
    expect(typeof window).toBe("undefined");
  });

  it("renders a heading role to its semantic element", () => {
    const html = renderToServerString(
      <Typography role="heading-lg">Server heading</Typography>,
    );

    expect(html).toContain("<h2");
    expect(html).toContain("text-xl");
    expect(html).toContain("font-semibold");
    expect(html).toContain("Server heading");
  });

  it("renders the default role with its tone class", () => {
    const html = renderToServerString(
      <Typography tone="muted">Body copy</Typography>,
    );

    expect(html).toContain("<p");
    expect(html).toContain("text-base");
    expect(html).toContain("text-foreground/60");
  });

  it("renders configured role overrides on the server", () => {
    const html = renderToServerString(
      <Typography role="body-md">Retuned</Typography>,
      {
        config: {
          components: { typography: { roles: { "body-md": { size: "sm" } } } },
        },
      },
    );

    expect(html).toContain("text-sm");
    expect(html).not.toContain("text-base");
  });
});

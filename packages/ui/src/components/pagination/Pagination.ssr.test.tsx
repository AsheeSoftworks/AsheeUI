// @vitest-environment node
/**
 * Server-rendering proof for Pagination in a DOM-free environment.
 *
 * This file opts out of jsdom entirely, so any access to `window`, `document`
 * or another browser global during render fails the test rather than passing
 * silently against jsdom stubs. It is the browserless evidence for `TEST-034`.
 */

import { describe, expect, it } from "vitest";
import { renderToServerString } from "../../test";
import { Pagination } from "./Pagination";

describe("Pagination server rendering (DOM-free environment)", () => {
  it("runs without DOM globals, so the render below is genuinely browserless", () => {
    expect(typeof document).toBe("undefined");
    expect(typeof window).toBe("undefined");
  });

  it("renders the collection state as a named navigation landmark", () => {
    const html = renderToServerString(<Pagination page={2} pageCount={5} />);

    expect(html).toContain("<nav");
    expect(html).toContain('aria-label="Pagination"');
    expect(html).toContain("<ul");
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('aria-label="Page 2"');
  });

  it("renders its edge controls as unavailable", () => {
    const html = renderToServerString(<Pagination page={1} pageCount={5} />);

    expect(html).toContain('aria-label="Previous page"');
    expect(html).toContain("disabled");
  });

  it("renders links when destinations are supplied", () => {
    const html = renderToServerString(
      <Pagination
        page={2}
        pageCount={3}
        hrefForPage={(target) => `/invoices?page=${target}`}
      />,
    );

    expect(html).toContain('href="/invoices?page=3"');
    expect(html).toContain('aria-current="page"');
    expect(html).not.toContain("<button");
  });
});

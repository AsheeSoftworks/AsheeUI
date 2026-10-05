// @vitest-environment node
/**
 * Server-rendering proof for Form in a DOM-free environment.
 *
 * This file opts out of jsdom entirely, so any access to `window`, `document`
 * or another browser global during render fails the test rather than passing
 * silently against jsdom stubs. It is the browserless evidence for `TEST-034`,
 * and it is the one that matters for a form: a server-rendered form has to
 * carry its submission contract in the markup, before hydration.
 */

import { describe, expect, it } from "vitest";
import { renderToServerString } from "../../test";
import { Form } from "./Form";

describe("Form server rendering (DOM-free environment)", () => {
  it("runs without DOM globals, so the render below is genuinely browserless", () => {
    expect(typeof document).toBe("undefined");
    expect(typeof window).toBe("undefined");
  });

  it("carries the native submission contract in the markup", () => {
    const html = renderToServerString(
      <Form action="/invoices" method="post" noValidate>
        <input name="reference" />
      </Form>,
    );

    expect(html).toContain("<form");
    expect(html).toContain('action="/invoices"');
    expect(html).toContain('method="post"');
    // React serialises this property in camel case on the server; HTML
    // attribute names are case insensitive, so the browser reads it either way.
    expect(html).toMatch(/novalidate/i);
  });

  it("groups its fields under the legend", () => {
    const html = renderToServerString(
      <Form legend="Invoice details">
        <input name="reference" />
      </Form>,
    );

    expect(html).toContain("<fieldset");
    expect(html).toContain("<legend");
    expect(html).toContain("Invoice details");
  });

  it("renders the submit control it is asked for", () => {
    const html = renderToServerString(
      <Form submitLabel="Save" isPending>
        <input name="reference" />
      </Form>,
    );

    expect(html).toContain('type="submit"');
    expect(html).toContain("Save");
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain("disabled");
  });
});

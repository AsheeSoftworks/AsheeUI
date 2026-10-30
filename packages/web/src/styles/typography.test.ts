/**
 * The web renderer's typography table, tested where it lives.
 *
 * `TYPOGRAPHY_ROLE_DEFAULT_ELEMENT` was `@asheeui/core`'s until C3, beside the role table both
 * renderers read. An element name is the browser's — the platform draws a `Text` for every role —
 * so the assertions that read it moved here with the table, and core's suite kept the ones about
 * the treatment, which is the part the two platforms must agree on.
 */

import type { TypographyRole } from "@asheeui/core";
import { describe, expect, it } from "vitest";
import { TYPOGRAPHY_ROLE_DEFAULT_ELEMENT } from "./typography";

/** Every semantic role the typography scale names. */
const ROLES: TypographyRole[] = [
  "display",
  "page-title",
  "heading-xl",
  "heading-lg",
  "heading-md",
  "heading-sm",
  "body-lg",
  "body-md",
  "body-sm",
  "label",
  "caption",
  "overline",
];

/** The elements a typography role may render as: a heading, or inline text. */
const ELEMENTS = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span"];

describe("the element a role renders as, on the web", () => {
  it("renders headings as headings and body copy as paragraphs", () => {
    expect(TYPOGRAPHY_ROLE_DEFAULT_ELEMENT["page-title"]).toBe("h1");
    expect(TYPOGRAPHY_ROLE_DEFAULT_ELEMENT["heading-lg"]).toBe("h2");
    expect(TYPOGRAPHY_ROLE_DEFAULT_ELEMENT["body-md"]).toBe("p");
    expect(TYPOGRAPHY_ROLE_DEFAULT_ELEMENT.label).toBe("span");
    expect(TYPOGRAPHY_ROLE_DEFAULT_ELEMENT.display).toBe("h1");
  });

  it("states an element for every role, so no role renders as an empty element", () => {
    expect(Object.keys(TYPOGRAPHY_ROLE_DEFAULT_ELEMENT).sort()).toEqual(
      [...ROLES].sort(),
    );
    for (const role of ROLES) {
      expect(ELEMENTS).toContain(TYPOGRAPHY_ROLE_DEFAULT_ELEMENT[role]);
    }
  });
});

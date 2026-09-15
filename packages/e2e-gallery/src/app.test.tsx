/**
 * The playground application's own test: the empty configuration contract.
 *
 * The official playgrounds deliberately configure nothing, so this file proves
 * the property they exist to demonstrate: AsheeUI resolves its documented
 * baseline from an empty configuration, and a consumer does not have to restate
 * the framework's own defaults to get a working themed page.
 */

import { AsheeUIProvider, Button } from "asheeui";
import { describe, expect, it } from "vitest";
import { PlaygroundApp } from "./app";
import { hydrateMarkup, renderServerMarkup } from "./harness";
import { playgroundConfig } from "./playground-config";

/**
 * The baseline the consumer documentation states, written out here on purpose.
 *
 * `docs/configuration.md` documents these values as the framework's defaults, so
 * asserting them is asserting a documented contract rather than an internal. The
 * test compares the empty configuration against this explicit statement of the
 * same values, which is the equivalence a consumer depends on.
 */
const DOCUMENTED_BASELINE = {
  defaultTheme: "system",
  defaultVariant: "faded",
  defaultColor: "primary",
  defaultRadius: "xs",
} as const;

/**
 * Read the classes a rendered button carries.
 *
 * @param markup - The rendered markup.
 * @returns The button's class string.
 */
function buttonClasses(markup: string): string {
  const button = new DOMParser()
    .parseFromString(markup, "text/html")
    .querySelector("button");

  return button?.className ?? "";
}

describe("playground application", () => {
  it("configures nothing, so the framework's own defaults are what it shows", () => {
    expect(playgroundConfig).toEqual({});
  });

  it("resolves the documented baseline from the empty configuration", () => {
    const withEmptyConfig = renderServerMarkup(
      <AsheeUIProvider config={playgroundConfig}>
        <Button>Save invoice</Button>
      </AsheeUIProvider>,
    );
    const withExplicitBaseline = renderServerMarkup(
      <AsheeUIProvider config={DOCUMENTED_BASELINE}>
        <Button>Save invoice</Button>
      </AsheeUIProvider>,
    );

    expect(buttonClasses(withEmptyConfig)).not.toBe("");
    expect(buttonClasses(withEmptyConfig)).toBe(
      buttonClasses(withExplicitBaseline),
    );
  });

  it("renders the whole application from the empty configuration", () => {
    expect(renderServerMarkup(<PlaygroundApp />)).toContain("data-gallery");
  });

  it("hydrates the application without a mismatch", () => {
    const result = hydrateMarkup(
      renderServerMarkup(<PlaygroundApp />),
      <PlaygroundApp />,
    );

    try {
      expect(result.errors).toEqual([]);
    } finally {
      result.unmount();
    }
  });
});

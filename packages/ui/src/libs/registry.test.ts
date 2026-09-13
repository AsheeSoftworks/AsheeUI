import { afterEach, describe, expect, it } from "vitest";
import { defaultAccordionConfig } from "../components/accordion/accordion-config";
import { defaultButtonConfig } from "../components/button/button-config";
import { defaultScrollbarConfig } from "../components/scrollbar/scrollbar-config";
import {
  getAllComponentDefaults,
  getComponentDefaults,
  registerComponentDefaults,
} from "./registry";

afterEach(() => {
  // The registry has no unregister API, so restore the value under test.
  registerComponentDefaults("scrollbar", defaultScrollbarConfig);
});

describe("component config registry", () => {
  it("is populated by importing a component config module", () => {
    expect(getComponentDefaults("button")).toEqual(defaultButtonConfig);
    expect(getComponentDefaults("accordion")).toEqual(defaultAccordionConfig);
  });

  it("holds the configuration-only scrollbar module as a registered entry", () => {
    expect(getComponentDefaults("scrollbar")).toEqual(defaultScrollbarConfig);
  });

  it("returns the most recently registered defaults for a key", () => {
    expect(getComponentDefaults("scrollbar")?.width).toBe(
      defaultScrollbarConfig.width,
    );

    registerComponentDefaults("scrollbar", {
      ...defaultScrollbarConfig,
      width: "6px",
    });

    expect(getComponentDefaults("scrollbar")?.width).toBe("6px");
  });

  it("exposes every registered default through the aggregate accessor", () => {
    const defaults = getAllComponentDefaults();

    expect(defaults.scrollbar).toEqual(defaultScrollbarConfig);
    expect(defaults.button).toEqual(defaultButtonConfig);
    expect(defaults.accordion).toEqual(defaultAccordionConfig);
  });

  it("only holds configs whose module has been imported, then picks up new imports", async () => {
    // The registry is populated by import side effects, which is why
    // `resolveConfig` reads it lazily instead of freezing it at first render.
    expect(getComponentDefaults("field")).toBeUndefined();

    await import("../components/field");

    expect(getComponentDefaults("field")).toBeDefined();
  });
});

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AsheeUIProvider } from "../AsheeUIProvider";
import { THEME_VARS_STYLE_ID } from "../scripts/AsheeThemeScript";
import { themeController } from "../theme/controller";

/**
 * A custom theme is a value in the configuration rather than a stylesheet: it is declared,
 * resolved against the built-in palette it extends, and applied through the same theme
 * class and CSS variables the built-in themes use. These tests state that chain, because
 * a break anywhere in it shows up as "the theme fell back to light".
 */
const CONFIG = {
  defaultTheme: "dark" as const,
  color: {
    brand: {
      extends: "dark" as const,
      background: "#0b0b12",
      primary: "#8b5cf6",
    },
  },
};

describe("custom theme", () => {
  it("registers the theme and generates its CSS block", () => {
    render(
      <AsheeUIProvider config={CONFIG as never}>
        <div />
      </AsheeUIProvider>,
    );

    const css = document.getElementById(THEME_VARS_STYLE_ID)?.textContent ?? "";

    expect(themeController.getAvailableThemes()).toContain("brand");
    expect(css).toContain(".theme-brand");
  });

  it("resolves the values it states and inherits the palette it extends", () => {
    render(
      <AsheeUIProvider config={CONFIG as never}>
        <div />
      </AsheeUIProvider>,
    );

    const css = document.getElementById(THEME_VARS_STYLE_ID)?.textContent ?? "";
    const block = css.slice(css.indexOf(".theme-brand"));
    const declared = CONFIG.color.brand;

    // The two values the theme states, and one it inherits from the dark palette.
    expect(block).toContain(declared.background);
    expect(block).toContain(declared.primary);
    expect(block).toContain("#22c55e");
  });

  it("switches to the custom theme when it is selected", () => {
    window.localStorage.clear();
    render(
      <AsheeUIProvider config={CONFIG as never}>
        <div />
      </AsheeUIProvider>,
    );

    themeController.setTheme("brand" as never);

    expect(themeController.getResolvedTheme()).toBe("brand");
    expect(document.documentElement.className).toBe("theme-brand");
  });
});

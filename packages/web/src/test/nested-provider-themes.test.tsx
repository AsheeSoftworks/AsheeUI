import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { AsheeUIProvider } from "../AsheeUIProvider";
import { THEME_VARS_STYLE_ID } from "../scripts/AsheeThemeScript";
import { themeController } from "../theme/controller";

/**
 * The theme controller is a single instance for the whole application, and every
 * `AsheeUIProvider` configures it. A provider mounted *below* the application's own — a
 * page that demonstrates its own configuration, which is what the showcase's theming band
 * does — states only the themes it knows about, usually just the built-ins.
 *
 * Taking that provider's list as the application's list made a custom theme invalid:
 * `setTheme` failed validation and fell back to the default, so the theme silently
 * resolved to the light palette. These tests pin the fix: a provider can add a theme but
 * never take one away.
 */
const APP_CONFIG = {
  color: { brand: { extends: "dark" as const, primary: "#8b5cf6" } },
};

const NESTED_CONFIG = {
  defaultRadius: "none" as const,
  defaultVariant: "bordered" as const,
};

// The theme stylesheet and the controller are module-level singletons, so each test
// starts from a document that has no stylesheet yet and a cleared selection.
beforeEach(() => {
  document.getElementById(THEME_VARS_STYLE_ID)?.remove();
  window.localStorage.clear();
});

describe("a nested provider", () => {
  it("does not remove the application's custom themes", () => {
    window.localStorage.clear();

    const { rerender } = render(
      <AsheeUIProvider config={APP_CONFIG as never}>
        <div />
      </AsheeUIProvider>,
    );

    expect(themeController.getAvailableThemes()).toContain("brand");

    rerender(
      <AsheeUIProvider config={APP_CONFIG as never}>
        <AsheeUIProvider config={NESTED_CONFIG}>
          <div />
        </AsheeUIProvider>
      </AsheeUIProvider>,
    );

    expect(themeController.getAvailableThemes()).toEqual(
      expect.arrayContaining(["light", "dark", "brand"]),
    );
  });

  it("still lets the application select its custom theme", () => {
    window.localStorage.clear();

    const { rerender } = render(
      <AsheeUIProvider config={APP_CONFIG as never}>
        <div />
      </AsheeUIProvider>,
    );

    rerender(
      <AsheeUIProvider config={APP_CONFIG as never}>
        <AsheeUIProvider config={NESTED_CONFIG}>
          <div />
        </AsheeUIProvider>
      </AsheeUIProvider>,
    );

    themeController.setTheme("brand" as never);

    expect(themeController.getResolvedTheme()).toBe("brand");
    expect(document.documentElement.className).toContain("theme-brand");
  });

  it("emits the custom theme's variables even though the nested provider mounts first", () => {
    window.localStorage.clear();

    // Both providers mount in the same commit, and React runs a child's effects before
    // its parent's. The nested provider therefore reaches the stylesheet first, with a
    // configuration that declares no custom theme, and the stylesheet still has to end
    // up holding the application's themes.
    render(
      <AsheeUIProvider config={APP_CONFIG as never}>
        <AsheeUIProvider config={NESTED_CONFIG}>
          <div />
        </AsheeUIProvider>
      </AsheeUIProvider>,
    );

    const css = document.getElementById("ashee-theme-vars")?.textContent ?? "";

    console.log("stylesheet holds .theme-brand:", css.includes(".theme-brand"));

    expect(css).toContain(".theme-brand");
    expect(css).toContain("#8b5cf6");
  });
});

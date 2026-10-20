import type { ExternalConfig } from "@asheeui/core";
import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it } from "vitest";
import { AsheeUIProvider } from "../AsheeUIProvider";
import {
  THEME_SCRIPT_ID,
  THEME_VARS_STYLE_ID,
} from "../scripts/AsheeThemeScript";
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
 * never take one away, and it cannot replace what a first visit shows either.
 */
const APP_CONFIG = {
  defaultTheme: "dark",
  color: { brand: { extends: "dark", primary: "#8b5cf6" } },
} satisfies ExternalConfig;

const NESTED_CONFIG = {
  defaultTheme: "light",
  defaultRadius: "none",
  defaultVariant: "bordered",
} satisfies ExternalConfig;

// The theme stylesheet and the controller are module-level singletons, so each test
// starts from a document that has no stylesheet yet and a cleared selection.
beforeEach(() => {
  document.getElementById(THEME_VARS_STYLE_ID)?.remove();
  window.localStorage.clear();
});

/** The application's provider wrapping a provider that belongs to one of its pages. */
function nestedTree() {
  return (
    <AsheeUIProvider config={APP_CONFIG}>
      <AsheeUIProvider config={NESTED_CONFIG}>
        <div />
      </AsheeUIProvider>
    </AsheeUIProvider>
  );
}

describe("a nested provider", () => {
  it("does not remove the application's custom themes", () => {
    window.localStorage.clear();

    const { rerender } = render(
      <AsheeUIProvider config={APP_CONFIG}>
        <div />
      </AsheeUIProvider>,
    );

    expect(themeController.getAvailableThemes()).toContain("brand");

    rerender(nestedTree());

    expect(themeController.getAvailableThemes()).toEqual(
      expect.arrayContaining(["light", "dark", "brand"]),
    );
  });

  it("still lets the application select its custom theme", () => {
    window.localStorage.clear();

    const { rerender } = render(
      <AsheeUIProvider config={APP_CONFIG}>
        <div />
      </AsheeUIProvider>,
    );

    rerender(nestedTree());

    themeController.setTheme("brand");

    expect(themeController.getResolvedTheme()).toBe("brand");
    expect(document.documentElement.className).toContain("theme-brand");
  });

  it("emits the custom theme's variables even though the nested provider mounts first", () => {
    window.localStorage.clear();

    // Both providers mount in the same commit, and React runs a child's effects before
    // its parent's. The nested provider therefore reaches the stylesheet first, with a
    // configuration that declares no custom theme, and the stylesheet still has to end
    // up holding the application's themes.
    render(nestedTree());

    const css = document.getElementById(THEME_VARS_STYLE_ID)?.textContent ?? "";

    expect(css).toContain(".theme-brand");
    expect(css).toContain("#8b5cf6");
  });

  it("does not replace the application's default theme", () => {
    // With nothing stored, the controller seeds the selection from the default theme of
    // the provider that owns the document. A nested provider's `defaultTheme` describes
    // its own subtree; taking it for the application's meant a docs demo or a preview
    // panel silently changed what every first visit to the site showed.
    window.localStorage.clear();

    const { rerender } = render(
      <AsheeUIProvider config={APP_CONFIG}>
        <div />
      </AsheeUIProvider>,
    );

    expect(themeController.getSelection()).toBe("dark");

    rerender(nestedTree());

    expect(themeController.getSelection()).toBe("dark");
    expect(themeController.getResolvedTheme()).toBe("dark");
  });

  it("emits the pre-paint script only from the provider that owns the document", () => {
    // Every provider used to emit a script carrying its own theme list and default theme.
    // A nested provider's script ran later in the parse, so it painted *its* default until
    // the controller's effect ran — the override the union rule prevents for the
    // stylesheet. Only the application's provider may write the pre-paint state.
    const markup = renderToString(nestedTree());
    const scripts = markup.match(new RegExp(`id="${THEME_SCRIPT_ID}"`, "g"));

    expect(scripts).toHaveLength(1);

    const script =
      markup.match(
        new RegExp(
          `<script id="${THEME_SCRIPT_ID}"[^>]*>([\\s\\S]*?)</script>`,
        ),
      )?.[1] ?? "";

    // The application's themes, and the application's default theme.
    expect(script).toContain('["light","dark","brand"]');
    expect(script).toContain('var defaultTheme = "dark"');
  });
});

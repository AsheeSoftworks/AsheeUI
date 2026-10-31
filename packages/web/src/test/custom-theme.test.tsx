import type { ExternalConfig, ThemeName } from "@asheeui/core";
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
 *
 * The declaration itself is part of the contract: `satisfies ExternalConfig` fails to
 * compile if a theme name the library has never heard of cannot be written in the public
 * types, which is what made the documented version of this object need a cast.
 */
const CONFIG = {
  defaultTheme: "dark",
  color: {
    brand: {
      extends: "dark",
      background: "#0b0b12",
      primary: "#8b5cf6",
    },
  },
} satisfies ExternalConfig;

/**
 * Type-level assertions — this function is never called, and `tsc` is the runner.
 *
 * A custom theme's name is a first-class string: it is accepted as a palette key, as
 * `defaultTheme`, and by `setTheme`, and an entry from `availableThemes` can be passed
 * straight back into `setTheme` by a picker. Before the types were opened each of these
 * needed a cast, and the documented declaration shipped in the docs did not compile.
 *
 * The parameters exist so the checks need no live values: nothing here runs.
 */
function _customThemeNamesAreFirstClass(
  controller: typeof themeController,
  availableThemes: readonly ThemeName[],
): void {
  // F-176: setTheme accepts a name the library has never heard of.
  controller.setTheme("midnight");

  // F-177: the list and the setter agree, so no cast is needed between them.
  for (const theme of availableThemes) {
    controller.setTheme(theme);
  }

  // The picker the theming docs demonstrate: "system" beside the available names.
  // Never empty, so the first choice is a plain `string`.
  const choices: [string, ...string[]] = ["system", ...availableThemes];
  controller.setTheme(choices[0]);

  // F-176: the documented declaration compiles as written.
  const config: ExternalConfig = {
    defaultTheme: "midnight",
    color: {
      midnight: {
        extends: "dark",
        background: "#0b0b12",
        primary: "#8b5cf6",
      },
    },
  };

  // The palette key is readable without a registry entry, and it is a theme name.
  const named: ThemeName = "midnight";
  void config;
  void named;
}

/**
 * Type-level assertion: `extends` may name another custom theme.
 *
 * Closing `extends` over the built-ins made `brand: { extends: "midnight" }` fail to compile, and
 * typed code could not reach the resolver's cross-theme support at all. The assertion lived in
 * `@asheeui/core`'s `theme/color.ts` until C4, as a local alias kept alive by an exported
 * `_ColorConfigGuards` carrier — and that carrier was an export nothing read, which core may not
 * publish. It belongs here: this is where the configuration vocabulary is consumed, and `tsc` is
 * part of the gate. Never called; `tsc` is the runner.
 */
function _aCustomThemeMayExtendAnotherCustomTheme(): void {
  const config: ExternalConfig = {
    color: {
      midnight: { extends: "dark", background: "#0b0b12", primary: "#8b5cf6" },
      brand: { extends: "midnight", primary: "#a78bfa" },
    },
  };

  void config;
}

describe("custom theme", () => {
  it("registers the theme and generates its CSS block", () => {
    render(
      <AsheeUIProvider config={CONFIG}>
        <div />
      </AsheeUIProvider>,
    );

    const css = document.getElementById(THEME_VARS_STYLE_ID)?.textContent ?? "";

    expect(themeController.getAvailableThemes()).toContain("brand");
    expect(css).toContain(".theme-brand");
  });

  it("resolves the values it states and inherits the palette it extends", () => {
    render(
      <AsheeUIProvider config={CONFIG}>
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
      <AsheeUIProvider config={CONFIG}>
        <div />
      </AsheeUIProvider>,
    );

    themeController.setTheme("brand");

    expect(themeController.getResolvedTheme()).toBe("brand");
    // The root carries whatever classes the rest of the page has put there, so the theme
    // class is asserted present rather than as the whole string.
    expect(document.documentElement.className).toContain("theme-brand");
  });

  it("let a picker drive setTheme from availableThemes", () => {
    window.localStorage.clear();
    render(
      <AsheeUIProvider config={CONFIG}>
        <div />
      </AsheeUIProvider>,
    );

    const picker = themeController.getAvailableThemes();
    const chosen = picker.at(-1);

    expect(chosen).toBe("brand");

    // The whole point of F-177: the entry goes back into the setter with no cast.
    if (chosen !== undefined) themeController.setTheme(chosen);

    expect(document.documentElement.className).toContain("theme-brand");
  });
});

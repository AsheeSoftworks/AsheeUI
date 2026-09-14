/**
 * Tests for the pre-paint theme script.
 *
 * The script is the anti-flash mechanism: it runs while the document is parsed,
 * applies the stored or configured theme class to the root element, and injects
 * the theme CSS variables before the first paint. Because jsdom does not run
 * scripts by itself, these tests execute the emitted script explicitly, which is
 * also what proves the emitted text is self-contained.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ExternalConfig } from "../config/config";
import { resolveConfig } from "../config/resolve-config";
import { render } from "../test";
import { THEME_STORAGE_KEY } from "../theme/controller";
import { AsheeThemeScript, THEME_VARS_STYLE_ID } from "./AsheeThemeScript";

const SCRIPT_ID = "ashee-theme-script";

/** Render the script for a configuration and return the emitted script text. */
function emitScript(overrides: ExternalConfig = {}): string {
  const config = resolveConfig(overrides);
  const { container } = render(<AsheeThemeScript config={config} />);

  return container.querySelector(`#${SCRIPT_ID}`)?.innerHTML ?? "";
}

/** Run the emitted script the way the browser runs it during parsing. */
function runScript(script: string): void {
  new Function(script)();
}

/** Stub the system preference query for the duration of one test. */
function setSystemDark(matches: boolean): void {
  vi.spyOn(window, "matchMedia").mockReturnValue({
    matches,
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  } as unknown as MediaQueryList);
}

const root = () => document.documentElement;
const themeClasses = () => Array.from(root().classList).filter((c) => c.startsWith("theme-"));

beforeEach(() => {
  localStorage.clear();
  root().className = "";
  document.getElementById(THEME_VARS_STYLE_ID)?.remove();
});

describe("AsheeThemeScript", () => {
  it("emits a script carrying the storage key, the variables and the themes", () => {
    const script = emitScript();

    expect(script).toContain(THEME_STORAGE_KEY);
    expect(script).toContain(THEME_VARS_STYLE_ID);
    expect(script).toContain("--ashee-background");
    expect(script).toContain(":root, .theme-light");
    expect(script).toContain(".theme-dark");
  });

  it("emits a block for a custom theme", () => {
    const script = emitScript({
      color: { brand: { background: "#123456" } },
    } as ExternalConfig);

    expect(script).toContain(".theme-brand");
    expect(script).toContain("#123456");
  });

  it("emits identical text for the same configuration", () => {
    expect(emitScript({ defaultTheme: "dark" })).toBe(
      emitScript({ defaultTheme: "dark" }),
    );
  });

  it("applies the stored theme to the root element before paint", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");

    runScript(emitScript());

    expect(themeClasses()).toEqual(["theme-dark"]);
    expect(document.getElementById(THEME_VARS_STYLE_ID)?.textContent).toContain(
      "--ashee-background",
    );
  });

  it("replaces a theme class left over from a previous render", () => {
    root().classList.add("theme-light");
    localStorage.setItem(THEME_STORAGE_KEY, "dark");

    runScript(emitScript());

    expect(themeClasses()).toEqual(["theme-dark"]);
  });

  it("falls back to the configured default when the stored theme is unknown", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "legacy-theme");

    runScript(emitScript({ defaultTheme: "dark" }));

    expect(themeClasses()).toEqual(["theme-dark"]);
  });

  it("resolves the system selection from the system preference", () => {
    setSystemDark(true);

    runScript(emitScript({ defaultTheme: "system" }));

    expect(themeClasses()).toEqual(["theme-dark"]);
  });

  it("never applies a theme that has no CSS block", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "legacy-theme");

    runScript(emitScript({ defaultTheme: "system" }));

    expect(themeClasses()).toEqual(["theme-light"]);
  });
});

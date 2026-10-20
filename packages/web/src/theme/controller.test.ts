/**
 * Tests for the theme controller.
 *
 * The controller owns theme state after hydration: it validates a selection
 * against the available themes, resolves the system preference, persists the
 * preference, and keeps the root element's theme class in sync - including
 * removing the class the pre-paint script already applied. The script itself is
 * covered separately in `scripts/AsheeThemeScript.test.tsx`.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { THEME_STORAGE_KEY, themeController } from "./controller";

const root = () => document.documentElement;
const themeClasses = () =>
  Array.from(root().classList).filter((name) => name.startsWith("theme-"));

/** Select a theme name that this controller has not been told about, to test validation. */
const select = (value: string) => themeController.setTheme(value);

beforeEach(() => {
  localStorage.clear();
  root().className = "";
  themeController.configure({
    defaultTheme: "system",
    themes: ["light", "dark"],
  });
  themeController.setTheme("light");
});

describe("themeController", () => {
  it("applies the theme class and stores the selection", () => {
    themeController.setTheme("dark");

    expect(themeClasses()).toEqual(["theme-dark"]);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("replaces the theme class the pre-paint script applied", () => {
    root().classList.add("theme-dark");

    themeController.setTheme("light");

    expect(themeClasses()).toEqual(["theme-light"]);
  });

  it("falls back to the default selection when a theme does not exist", () => {
    themeController.configure({ defaultTheme: "light", themes: ["light"] });

    select("midnight");

    expect(themeClasses()).toEqual(["theme-light"]);
    expect(themeController.getResolvedTheme()).toBe("light");
  });

  it("honours a changed default selection", () => {
    themeController.setDefault("dark");
    themeController.configure({
      defaultTheme: "dark",
      themes: ["light", "dark"],
    });

    select("midnight");

    expect(themeClasses()).toEqual(["theme-dark"]);
  });

  it("resolves the system selection", () => {
    themeController.setTheme("system");

    expect(themeController.getSelection()).toBe("system");
    expect(themeController.getResolvedTheme()).toBe("light");
  });

  it("cycles through the available themes", () => {
    themeController.setTheme("light");

    themeController.toggleTheme();
    expect(themeController.getSelection()).toBe("dark");

    themeController.toggleTheme();
    expect(themeController.getSelection()).toBe("light");
  });

  it("reports the available themes", () => {
    expect(themeController.getAvailableThemes()).toEqual(["light", "dark"]);
  });

  it("notifies subscribers until they unsubscribe", () => {
    const listener = vi.fn();
    const unsubscribe = themeController.subscribe(listener);

    themeController.setTheme("dark");
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    themeController.setTheme("light");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("writes the resolved theme to the root's color-scheme", () => {
    // The pre-paint script writes this while the document is parsed; a theme switched
    // after that has to write it too, or the browser's own surfaces keep the old scheme.
    themeController.setTheme("dark");
    expect(root().style.colorScheme).toBe("dark");

    themeController.setTheme("light");
    expect(root().style.colorScheme).toBe("light");
  });

  it("writes color-scheme on a client-only configuration too", () => {
    // No server output means no pre-paint script, so the first paint is the controller's.
    localStorage.clear();
    themeController.configure({
      defaultTheme: "dark",
      themes: ["light", "dark"],
    });

    expect(root().style.colorScheme).toBe("dark");
  });
});

describe("themeController default theme ownership", () => {
  it("keeps the owning provider's default theme when a nested provider configures", () => {
    localStorage.clear();
    themeController.configure({
      defaultTheme: "dark",
      themes: ["light", "dark"],
    });

    themeController.configure({
      defaultTheme: "light",
      themes: ["light", "dark"],
      ownsDocument: false,
    });

    expect(themeController.getSelection()).toBe("dark");
    expect(themeController.getResolvedTheme()).toBe("dark");
  });

  it("still lets the owning provider change its own default theme", () => {
    // First-writer-wins is about *which* provider, not about locking the value: the
    // application re-configuring with a new default is a supported change.
    localStorage.clear();
    themeController.configure({
      defaultTheme: "dark",
      themes: ["light", "dark"],
    });

    themeController.configure({
      defaultTheme: "light",
      themes: ["light", "dark"],
    });

    expect(themeController.getSelection()).toBe("light");
  });

  it("lets a nested provider add a theme without touching the default", () => {
    localStorage.clear();
    themeController.configure({
      defaultTheme: "dark",
      themes: ["light", "dark"],
    });

    themeController.configure({
      defaultTheme: "system",
      themes: ["light", "dark", "brand"],
      ownsDocument: false,
    });

    expect(themeController.getAvailableThemes()).toEqual([
      "light",
      "dark",
      "brand",
    ]);
    expect(themeController.getSelection()).toBe("dark");
  });
});

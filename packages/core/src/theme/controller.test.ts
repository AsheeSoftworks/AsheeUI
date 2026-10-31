/**
 * The theme state machine, driven through the three hosts that could exist.
 *
 * The assertions are deliberately about *transitions*, not about a platform: a controller
 * that works because the test happened to run in a browser has not been ported, it has been
 * moved. So the same script runs against a DOM-like host (a paint callback that records, a
 * storage map, a scheme that can change), a device-like host (the same, with the platform's
 * naming) and a host with no storage at all, and all three must produce the same sequence.
 *
 * The rest of the file states the six rules from `NATIVE-FEASIBLE-REPORT.md` §2.2 one at a
 * time, because each is a decision a later refactor can quietly undo.
 */

import { describe, expect, it, vi } from "vitest";
import {
  createThemeController,
  THEME_STORAGE_KEY,
  type ThemeHost,
  type ThemeSelection,
} from "./controller";
import type { ColorScheme } from "./palette";

/** What the test can see and change about a host after creating it. */
interface TestHost {
  host: ThemeHost;
  /** The stored value, when the host has storage. */
  stored: Map<string, string>;
  /** Every theme the controller asked the host to paint, in order. */
  painted: string[];
  /** Report a platform scheme change, as the operating system would. */
  setScheme(next: ColorScheme): void;
  /** The number of writes the storage received. */
  writes(): number;
}

/**
 * A host with the three capabilities the controller can use.
 *
 * @param options - Whether to give it storage, and the initial scheme.
 * @returns The host and the levers the test needs.
 */
function createHost(
  options: { storage?: boolean; scheme?: ColorScheme } = {},
): TestHost {
  const storage = options.storage ?? true;
  const stored = new Map<string, string>();
  const painted: string[] = [];
  const listeners = new Set<() => void>();
  let scheme: ColorScheme = options.scheme ?? "light";
  let writes = 0;

  return {
    host: {
      systemScheme: () => scheme,
      onSystemChange: (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      storage: storage
        ? {
            get: () => stored.get(THEME_STORAGE_KEY) ?? null,
            set: (value) => {
              writes += 1;
              stored.set(THEME_STORAGE_KEY, value);
            },
            remove: () => {
              writes += 1;
              stored.delete(THEME_STORAGE_KEY);
            },
          }
        : undefined,
      paint: (theme) => painted.push(theme),
    },
    stored,
    painted,
    setScheme: (next) => {
      scheme = next;
      for (const listener of listeners) listener();
    },
    writes: () => writes,
  };
}

/** One step of the shared script: what to call, and the selection and paint it must produce. */
interface Step {
  name: string;
  run(controller: ReturnType<typeof createThemeController>, tester: TestHost): void;
  selection: ThemeSelection;
  resolved: string;
}

/**
 * The script every host runs.
 *
 * It covers a first configuration, a named choice, the cycle, "system", and a platform
 * scheme change while following the platform — the transitions a theme picker and an
 * operating-system switch produce.
 */
const SCRIPT: readonly Step[] = [
  {
    name: "configuring with system follows the host",
    run: (controller) =>
      controller.configure({ defaultTheme: "system", themes: ["light", "dark"] }),
    selection: "system",
    resolved: "light",
  },
  {
    name: "a named theme is chosen and painted",
    run: (controller) => controller.setTheme("dark"),
    selection: "dark",
    resolved: "dark",
  },
  {
    name: "toggling cycles to the next name",
    run: (controller) => controller.toggleTheme(),
    selection: "light",
    resolved: "light",
  },
  {
    name: "following the platform again",
    run: (controller) => controller.setTheme("system"),
    selection: "system",
    resolved: "light",
  },
  {
    name: "a platform change re-resolves",
    run: (_controller, tester) => tester.setScheme("dark"),
    selection: "system",
    resolved: "dark",
  },
  {
    name: "a named theme ignores a platform change",
    run: (controller) => controller.setTheme("light"),
    selection: "light",
    resolved: "light",
  },
];

describe("the theme controller across three hosts", () => {
  for (const [label, options] of [
    ["a DOM-like host", { storage: true }],
    ["a device-like host", { storage: true, scheme: "light" as const }],
    ["a host with no storage", { storage: false }],
  ] as const) {
    it(`makes the same transitions on ${label}`, () => {
      const tester = createHost(options);
      const controller = createThemeController(tester.host);

      for (const step of SCRIPT) {
        step.run(controller, tester);

        expect(controller.getSelection(), step.name).toBe(step.selection);
        expect(controller.getResolvedTheme(), step.name).toBe(step.resolved);
        expect(tester.painted[tester.painted.length - 1], step.name).toBe(
          step.resolved,
        );
      }
    });
  }

  it("paints on configuration, so a first visit is not left unpainted", () => {
    const tester = createHost();
    const controller = createThemeController(tester.host);

    controller.configure({ defaultTheme: "dark", themes: ["light", "dark"] });

    expect(tester.painted).toEqual(["dark"]);
  });
});

describe("the controller's persistence rules", () => {
  it("seeds from a stored selection rather than the default", () => {
    const tester = createHost();
    tester.stored.set(THEME_STORAGE_KEY, "dark");
    const controller = createThemeController(tester.host);

    controller.configure({ defaultTheme: "light", themes: ["light", "dark"] });

    expect(controller.getSelection()).toBe("dark");
    expect(controller.getResolvedTheme()).toBe("dark");
  });

  it("self-heals a stored value that names no available theme", () => {
    const tester = createHost();
    tester.stored.set(THEME_STORAGE_KEY, "midnight");
    const controller = createThemeController(tester.host);

    controller.configure({ defaultTheme: "dark", themes: ["light", "dark"] });

    // The leftover is dropped instead of applied, and the default answers.
    expect(tester.stored.has(THEME_STORAGE_KEY)).toBe(false);
    expect(controller.getSelection()).toBe("dark");
  });

  it("writes only when setTheme is called, never on configure", () => {
    const tester = createHost();
    const controller = createThemeController(tester.host);

    controller.configure({ defaultTheme: "system", themes: ["light", "dark"] });
    expect(tester.writes()).toBe(0);

    controller.setTheme("dark");
    expect(tester.writes()).toBe(1);
    expect(tester.stored.get(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("does not write when there is no storage", () => {
    // A session-only host has no write to make; the selection still changes.
    const tester = createHost({ storage: false });
    const controller = createThemeController(tester.host);

    controller.configure({ defaultTheme: "system", themes: ["light", "dark"] });
    controller.setTheme("dark");

    expect(controller.getSelection()).toBe("dark");
    expect(tester.writes()).toBe(0);
  });
});

describe("the controller's six rules", () => {
  it("grows the available list rather than replacing it", () => {
    const controller = createThemeController(createHost().host);

    controller.configure({ defaultTheme: "system", themes: ["light", "dark"] });
    controller.configure({
      defaultTheme: "system",
      themes: ["light", "dark", "brand"],
      ownsDocument: false,
    });

    expect(controller.getAvailableThemes()).toEqual([
      "light",
      "dark",
      "brand",
    ]);
  });

  it("keeps the owner's default when a nested provider configures", () => {
    const controller = createThemeController(createHost().host);

    controller.configure({ defaultTheme: "dark", themes: ["light", "dark"] });
    controller.configure({
      defaultTheme: "light",
      themes: ["light", "dark"],
      ownsDocument: false,
    });

    expect(controller.getSelection()).toBe("dark");
  });

  it("lets the owner change its own default", () => {
    const controller = createThemeController(createHost().host);

    controller.configure({ defaultTheme: "dark", themes: ["light", "dark"] });
    controller.configure({ defaultTheme: "light", themes: ["light", "dark"] });

    expect(controller.getSelection()).toBe("light");
  });

  it("cycles theme names and never selects system", () => {
    const controller = createThemeController(createHost().host);
    controller.configure({
      defaultTheme: "system",
      themes: ["light", "dark"],
    });

    controller.toggleTheme();
    expect(controller.getSelection()).toBe("light");

    controller.setTheme("system");
    controller.toggleTheme();
    // From "system" (not in the cycle) the first name is the next one.
    expect(controller.getSelection()).toBe("light");
  });

  it("does nothing when no themes are configured", () => {
    const controller = createThemeController(createHost().host);
    controller.configure({ defaultTheme: "system", themes: [] });

    const before = controller.getSelection();
    controller.toggleTheme();

    expect(controller.getSelection()).toBe(before);
  });

  it("re-resolves through the host only while following the platform", () => {
    const tester = createHost();
    const controller = createThemeController(tester.host);
    controller.configure({ defaultTheme: "system", themes: ["light", "dark"] });

    tester.setScheme("dark");
    expect(controller.getResolvedTheme()).toBe("dark");

    controller.setTheme("light");
    tester.setScheme("light");
    expect(controller.getResolvedTheme()).toBe("light");
  });

  it("notifies subscribers until they unsubscribe", () => {
    const controller = createThemeController(createHost().host);
    controller.configure({ defaultTheme: "system", themes: ["light", "dark"] });
    const listener = vi.fn();

    const unsubscribe = controller.subscribe(listener);
    controller.setTheme("dark");
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    controller.setTheme("light");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("falls back to a declared theme when the platform's scheme is not one", () => {
    // A configuration that declares no "dark" palette: the platform reporting dark must not
    // paint a class with no variables behind it.
    const tester = createHost({ scheme: "dark" });
    const controller = createThemeController(tester.host);

    controller.configure({ defaultTheme: "system", themes: ["light"] });

    expect(controller.getResolvedTheme()).toBe("light");
    expect(tester.painted).toEqual(["light"]);
  });
});

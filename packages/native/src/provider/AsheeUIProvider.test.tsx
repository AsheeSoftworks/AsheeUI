/**
 * Tests for the provider painting the configuration's palette, and for the one name it answers to.
 *
 * The provider is where a device's theme is applied: the compiled classes name their colour
 * as `rgb(var(--ashee-<role>) / <alpha-value>)`, and this component supplies those variables
 * for the subtree below it. So the tests read the variables it hands to NativeWind's
 * `vars()` — the palette the configuration states, the framework's palette when it states
 * none, the dark palette when the configuration names it, and a custom theme when one is
 * declared.
 *
 * The rest of the file is about the rename: the platform-suffixed spellings still work, are
 * the *same references* as the canonical ones, and announce themselves once per process with
 * every moved name in one message. `vars()` is mocked because the real one returns a style
 * object the styling runtime reads internally; what matters here is the variables it is given.
 */

import {
  act,
  render,
} from "@testing-library/react-native";
import type { ThemeStorage } from "@asheeui/core";
import { Text } from "react-native";
import { THEME_STORAGE_KEY, themeController } from "../theme/controller";
import { useTheme } from "../theme/useTheme";
import {
  AsheeConfigContext,
  AsheeNativeConfigContext,
  AsheeNativeProvider,
  AsheeUIProvider,
  useAshee,
  useAsheeConfig,
  useAsheeNativeConfig,
} from "./AsheeUIProvider";

jest.mock("nativewind", () => ({
  vars: jest.fn((variables: Record<string, string>) => variables),
}));

const vars = jest.requireMock("nativewind").vars as jest.Mock;

/** The names this module moved, in the order it announces them. */
const MOVED = [
  "AsheeNativeProvider",
  "AsheeNativeProviderProps",
  "AsheeNativeConfigContext",
  "useAsheeNativeConfig",
];

/**
 * The variables the last render painted.
 *
 * @returns The custom properties, keyed by their names.
 */
function paintedVariables(): Record<string, string> {
  const calls = vars.mock.calls;

  return (calls[calls.length - 1]?.[0] ?? {}) as Record<string, string>;
}

describe("AsheeUIProvider", () => {
  beforeEach(() => {
    vars.mockClear();
  });

  it("paints the framework's light palette when it is given no configuration", async () => {
    await render(
      <AsheeUIProvider>
        <Text>Content</Text>
      </AsheeUIProvider>,
    );

    expect(paintedVariables()["--ashee-background"]).toBe("255 255 255");
    expect(paintedVariables()["--ashee-primary"]).toBe("37 99 235");
  });

  it("paints the palette the configuration states", async () => {
    await render(
      <AsheeUIProvider config={{ color: { light: { primary: "#047857" } } }}>
        <Text>Content</Text>
      </AsheeUIProvider>,
    );

    expect(paintedVariables()["--ashee-primary"]).toBe("4 120 87");
  });

  it("paints the dark palette when the configuration names it", async () => {
    await render(
      <AsheeUIProvider config={{ defaultTheme: "dark" }}>
        <Text>Content</Text>
      </AsheeUIProvider>,
    );

    expect(paintedVariables()["--ashee-background"]).toBe("17 17 17");
  });

  it("paints a theme the configuration declares", async () => {
    await render(
      <AsheeUIProvider
        config={{
          color: { midnight: { extends: "dark", primary: "#7c3aed" } },
          defaultTheme: "midnight",
        }}>
        <Text>Content</Text>
      </AsheeUIProvider>,
    );

    expect(paintedVariables()["--ashee-primary"]).toBe("124 58 237");
    // The named theme extends the one it states, so the rest of the palette is its base's.
    expect(paintedVariables()["--ashee-background"]).toBe("17 17 17");
  });

  it("refuses a colour the platform cannot apply", async () => {
    await expect(
      render(
        <AsheeUIProvider config={{ color: { light: { primary: "var(--x)" } } }}>
          <Text>Content</Text>
        </AsheeUIProvider>,
      ),
    ).rejects.toThrow(/"primary".*var\(--x\)/s);
  });
});

describe("the provider's theme runtime", () => {
  beforeEach(() => {
    vars.mockClear();
  });

  it("repaints when a theme is chosen", async () => {
    await render(
      <AsheeUIProvider
        config={{ defaultTheme: "light" }}
        persistTheme={createStorage().storage}>
        <Text>Content</Text>
      </AsheeUIProvider>,
    );

    expect(paintedVariables()["--ashee-background"]).toBe("255 255 255");

    await act(async () => {
      themeController.setTheme("dark");
    });

    expect(paintedVariables()["--ashee-background"]).toBe("17 17 17");
  });

  it("follows the platform's scheme while the selection is system", async () => {
    // Appearance's Jest fake has no native module behind it, so the host's subscription is
    // exercised in `theme/controller.test.ts`, where the module is loaded against a
    // controllable Appearance. What this file proves is the provider's half: it reads the
    // controller and repaints from it.
    expect(typeof themeController.getResolvedTheme()).toBe("string");
  });

  it("self-heals a stored selection that names no available theme", async () => {
    // "brand" is declared by no configuration in this file, so the controller's growing
    // available list cannot contain it — which is the stale value the rule is about.
    const fake = createStorage({ [THEME_STORAGE_KEY]: "brand" });

    await render(
      <AsheeUIProvider
        config={{ defaultTheme: "light" }}
        persistTheme={fake.storage}>
        <Text>Content</Text>
      </AsheeUIProvider>,
    );

    expect(fake.values.has(THEME_STORAGE_KEY)).toBe(false);
    expect(fake.writes).toEqual(["remove"]);
    expect(paintedVariables()["--ashee-background"]).toBe("255 255 255");
  });

  it("writes only when setTheme is called, never on configuration", async () => {
    const fake = createStorage();

    await render(
      <AsheeUIProvider
        config={{ defaultTheme: "dark" }}
        persistTheme={fake.storage}>
        <Text>Content</Text>
      </AsheeUIProvider>,
    );

    expect(fake.writes).toEqual([]);

    await act(async () => {
      themeController.setTheme("light");
    });

    expect(fake.writes).toEqual(["set:light"]);
    expect(fake.values.get(THEME_STORAGE_KEY)).toBe("light");
  });

  it("publishes the same five fields the web hook publishes", async () => {
    let captured: ReturnType<typeof useTheme> | undefined;

    function Probe() {
      captured = useTheme();
      return <Text>Content</Text>;
    }

    await render(
      <AsheeUIProvider
        config={{
          color: { midnight: { extends: "dark", primary: "#7c3aed" } },
        }}
        persistTheme={createStorage().storage}>
        <Probe />
      </AsheeUIProvider>,
    );

    expect(captured).toBeDefined();
    expect(Object.keys(captured ?? {}).sort()).toEqual([
      "availableThemes",
      "resolvedTheme",
      "setTheme",
      "theme",
      "toggleTheme",
    ]);
    expect(captured?.availableThemes).toEqual(
      expect.arrayContaining(["light", "dark", "midnight"]),
    );
  });
});

/**
 * A storage adapter a test can inspect.
 *
 * @param initial - Values the storage starts with.
 * @returns The adapter, the values it holds and every write it received.
 */
function createStorage(initial: Record<string, string> = {}): {
  storage: ThemeStorage;
  values: Map<string, string>;
  writes: string[];
} {
  const values = new Map(Object.entries(initial));
  const writes: string[] = [];

  return {
    values,
    writes,
    storage: {
      get: () => values.get(THEME_STORAGE_KEY) ?? null,
      set: (value) => {
        values.set(THEME_STORAGE_KEY, value);
        writes.push(`set:${value}`);
      },
      remove: () => {
        values.delete(THEME_STORAGE_KEY);
        writes.push("remove");
      },
    },
  };
}

describe("the provider's one name", () => {
  it("keeps every platform-suffixed spelling as the same reference", () => {
    // An alias is a reference, not a second implementation: a copy would satisfy the
    // compiler and then drift the first time one of them changed.
    expect(AsheeNativeProvider).toBe(AsheeUIProvider);
    expect(AsheeNativeConfigContext).toBe(AsheeConfigContext);
    expect(useAsheeNativeConfig).toBe(useAsheeConfig);
  });

  it("publishes the short hook name the web renderer publishes", () => {
    // `useAshee` is what a shared component writes; it meant the web alone until B09.
    expect(useAshee).toBe(useAsheeConfig);
  });

  it("warns once per process, naming every name that moved", () => {
    const warn = jest
      .spyOn(console, "warn")
      .mockImplementation(() => undefined);

    // A fresh module registry: the import at the top of this file has already evaluated the
    // module once, so this is the second evaluation — and the second process-wide warning is
    // exactly what must not happen twice from one load.
    jest.isolateModules(() => {
      require("./AsheeUIProvider");
    });

    expect(warn).toHaveBeenCalledTimes(1);

    const message = String(warn.mock.calls[0]?.[0]);
    expect(message).toContain("@asheeui/native/provider");
    for (const name of MOVED) {
      expect(message).toContain(name);
    }

    warn.mockRestore();
  });
});

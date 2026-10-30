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

import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import {
  AsheeConfigContext,
  AsheeNativeConfigContext,
  AsheeNativeProvider,
  AsheeUIProvider,
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

describe("the provider's one name", () => {
  it("keeps every platform-suffixed spelling as the same reference", () => {
    // An alias is a reference, not a second implementation: a copy would satisfy the
    // compiler and then drift the first time one of them changed.
    expect(AsheeNativeProvider).toBe(AsheeUIProvider);
    expect(AsheeNativeConfigContext).toBe(AsheeConfigContext);
    expect(useAsheeNativeConfig).toBe(useAsheeConfig);
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

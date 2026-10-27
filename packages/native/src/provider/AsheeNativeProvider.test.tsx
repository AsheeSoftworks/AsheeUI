/**
 * Tests for the provider painting the configuration's palette.
 *
 * The provider is where a device's theme is applied: the compiled classes name their colour
 * as `rgb(var(--ashee-<role>) / <alpha-value>)`, and this component supplies those variables
 * for the subtree below it. So the tests read the variables it hands to NativeWind's
 * `vars()` — the palette the configuration states, the framework's palette when it states
 * none, the dark palette when the configuration names it, and a custom theme when one is
 * declared.
 *
 * `vars()` is mocked because the real one returns a style object the styling runtime reads
 * internally; what matters here is the variables it is given. The doctor's own check is
 * gated on a development bundle, so nothing in this suite mounts a styling pipeline.
 */

import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import {
  AsheeNativeProvider,
  AsheeUIProvider,
  useAsheeConfig,
  useAsheeNativeConfig,
} from "./AsheeNativeProvider";

jest.mock("nativewind", () => ({
  vars: jest.fn((variables: Record<string, string>) => variables),
}));

const vars = jest.requireMock("nativewind").vars as jest.Mock;

/**
 * The variables the last render painted.
 *
 * @returns The custom properties, keyed by their names.
 */
function paintedVariables(): Record<string, string> {
  const calls = vars.mock.calls;

  return (calls[calls.length - 1]?.[0] ?? {}) as Record<string, string>;
}

describe("AsheeNativeProvider", () => {
  beforeEach(() => {
    vars.mockClear();
  });

  it("paints the framework's light palette when it is given no configuration", async () => {
    await render(
      <AsheeNativeProvider>
        <Text>Content</Text>
      </AsheeNativeProvider>,
    );

    expect(paintedVariables()["--ashee-background"]).toBe("255 255 255");
    expect(paintedVariables()["--ashee-primary"]).toBe("37 99 235");
  });

  it("paints the palette the configuration states", async () => {
    await render(
      <AsheeNativeProvider
        config={{ color: { light: { primary: "#047857" } } }}>
        <Text>Content</Text>
      </AsheeNativeProvider>,
    );

    expect(paintedVariables()["--ashee-primary"]).toBe("4 120 87");
  });

  it("paints the dark palette when the configuration names it", async () => {
    await render(
      <AsheeNativeProvider config={{ defaultTheme: "dark" }}>
        <Text>Content</Text>
      </AsheeNativeProvider>,
    );

    expect(paintedVariables()["--ashee-background"]).toBe("17 17 17");
  });

  it("paints a theme the configuration declares", async () => {
    await render(
      <AsheeNativeProvider
        config={{
          color: { midnight: { extends: "dark", primary: "#7c3aed" } },
          defaultTheme: "midnight",
        }}>
        <Text>Content</Text>
      </AsheeNativeProvider>,
    );

    expect(paintedVariables()["--ashee-primary"]).toBe("124 58 237");
    // The named theme extends the one it states, so the rest of the palette is its base's.
    expect(paintedVariables()["--ashee-background"]).toBe("17 17 17");
  });

  it("refuses a colour the platform cannot apply", async () => {
    await expect(
      render(
        <AsheeNativeProvider
          config={{ color: { light: { primary: "var(--x)" } } }}>
          <Text>Content</Text>
        </AsheeNativeProvider>,
      ),
    ).rejects.toThrow(/"primary".*var\(--x\)/s);
  });

  it("answers to the umbrella's names, because one root is the point", () => {
    expect(AsheeUIProvider).toBe(AsheeNativeProvider);
    expect(useAsheeConfig).toBe(useAsheeNativeConfig);
  });
});

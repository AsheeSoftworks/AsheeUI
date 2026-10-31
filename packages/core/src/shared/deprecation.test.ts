import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { deprecatedAlias, type MovedName } from "./deprecation";

/** The names a renderer moved in one release, as a module would state them. */
const MOVED: MovedName[] = [
  { from: "AsheeNativeProvider", to: "AsheeUIProvider", since: "2.8.0" },
  {
    from: "AsheeNativeConfigContext",
    to: "AsheeConfigContext",
    since: "2.8.0",
  },
  { from: "useAsheeNativeConfig", to: "useAsheeConfig", since: "2.8.0" },
];

/** Everything the helper printed, as one string, so a test reads the whole message. */
function warned(): string {
  return vi
    .mocked(console.warn)
    .mock.calls.map((call) => call.join(" "))
    .join("\n");
}

describe("the deprecation helper", () => {
  beforeEach(() => {
    // The helper remembers the modules it has warned about for the life of the
    // process, which is the behaviour under test. A fresh module per test is what
    // lets one test observe the first import and another the second.
    vi.resetModules();
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("warns once for a module with three moved names, and names every one", async () => {
    const { deprecateMany } = await import("./deprecation");

    deprecateMany("@asheeui/native/provider", MOVED);
    deprecateMany("@asheeui/native/provider", MOVED);

    expect(console.warn).toHaveBeenCalledTimes(1);

    const message = warned();
    expect(message).toContain("@asheeui/native/provider");
    for (const { from, to, since } of MOVED) {
      expect(message).toContain(`${from} → ${to} (since ${since})`);
    }
  });

  it("says nothing in production", async () => {
    vi.stubEnv("NODE_ENV", "production");

    const { deprecateMany } = await import("./deprecation");
    deprecateMany("@asheeui/native/provider", MOVED);

    expect(console.warn).not.toHaveBeenCalled();
  });

  it("says nothing on a second import in the same process", async () => {
    const first = await import("./deprecation");
    first.deprecateMany("@asheeui/native/provider", MOVED);

    // A second import of a loaded module hands back the same instance, which is
    // the case this test exists for: re-importing must not repeat the warning.
    const second = await import("./deprecation");
    expect(second.deprecateMany).toBe(first.deprecateMany);
    second.deprecateMany("@asheeui/native/provider", MOVED);

    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it("says nothing when a module moved nothing", async () => {
    const { deprecateMany } = await import("./deprecation");

    // A module that uses only canonical names still calls the helper, so the call
    // sites all look the same; an empty list is how it stays silent.
    deprecateMany("@asheeui/native/provider", []);

    expect(console.warn).not.toHaveBeenCalled();
  });

  it("keeps an alias the same reference as its canonical name", () => {
    const canonical = function canonical(): string {
      return "canonical";
    };
    const context = { name: "AsheeConfigContext" };

    expect(deprecatedAlias(canonical)).toBe(canonical);
    expect(deprecatedAlias(context)).toBe(context);
  });
});

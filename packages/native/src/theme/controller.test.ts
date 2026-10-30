/**
 * The native theme host: `Appearance` and the storage adapter.
 *
 * The state machine is core's and is tested there against a fake host. What is the
 * platform's own is the *wiring*: that this adapter subscribes to `Appearance`, re-resolves
 * when the platform reports a different scheme, and reads and writes the storage it was
 * given. React Native's Jest fake has no native module behind `Appearance`, so the module is
 * loaded against a controllable one — that is the only way to prove the subscription exists
 * rather than the state machine being re-tested.
 */

describe("the native theme host", () => {
  /** A fresh module graph, so the controller subscribes to the Appearance this test controls. */
  function loadController() {
    jest.resetModules();

    const rn = require("react-native") as typeof import("react-native");
    let scheme: "light" | "dark" = "light";
    const listeners: Array<() => void> = [];

    jest
      .spyOn(rn.Appearance, "getColorScheme")
      .mockImplementation(() => scheme);
    jest
      .spyOn(rn.Appearance, "addChangeListener")
      .mockImplementation((listener) => {
        listeners.push(listener as () => void);
        return { remove: jest.fn() };
      });

    const { themeController } =
      require("./controller") as typeof import("./controller");

    return {
      themeController,
      setScheme: (next: "light" | "dark") => {
        scheme = next;
        for (const listener of listeners) listener();
      },
    };
  }

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("re-resolves through Appearance when the platform changes scheme", () => {
    const { themeController, setScheme } = loadController();

    themeController.configure({
      defaultTheme: "system",
      themes: ["light", "dark"],
    });
    expect(themeController.getResolvedTheme()).toBe("light");

    setScheme("dark");
    expect(themeController.getResolvedTheme()).toBe("dark");
  });

  it("keeps a chosen theme when the platform changes scheme", () => {
    const { themeController, setScheme } = loadController();

    themeController.configure({
      defaultTheme: "system",
      themes: ["light", "dark"],
    });
    themeController.setTheme("light");

    setScheme("dark");
    expect(themeController.getSelection()).toBe("light");
    expect(themeController.getResolvedTheme()).toBe("light");
  });

  it("keeps the choice in memory without a persistence adapter", () => {
    const { themeController } = loadController();

    themeController.configure({
      defaultTheme: "light",
      themes: ["light", "dark"],
    });
    themeController.setTheme("dark");

    // A second configuration of the same controller reads the session store rather than
    // forgetting the choice, which is what "the default host keeps the value in memory" means.
    themeController.configure({
      defaultTheme: "light",
      themes: ["light", "dark"],
    });

    expect(themeController.getSelection()).toBe("dark");
  });
});

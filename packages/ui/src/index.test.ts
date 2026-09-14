import { describe, expect, it } from "vitest";
import * as AsheeUI from "./index";
import { getAllComponentDefaults } from "./libs/registry";

/**
 * Public surface tests (`TEST-037`). These import only through the package
 * entry point, proving the exports consumers rely on exist and work.
 */
describe("public entry point", () => {
  it("exports the provider and theme API", () => {
    expect(typeof AsheeUI.AsheeUIProvider).toBe("function");
    expect(typeof AsheeUI.useTheme).toBe("function");
    expect(AsheeUI.themeController).toBeDefined();
    expect(AsheeUI.THEME_STORAGE_KEY).toBeDefined();
  });

  it("exports the shipped component surface", () => {
    const components = [
      "Accordion",
      "Alert",
      "Autocomplete",
      "Avatar",
      "Badge",
      "Button",
      "Card",
      "Carousel",
      "Chip",
      "Calendar",
      "Drawer",
      "Image",
      "Input",
      "Link",
      "Marquee",
      "Modal",
      "MultiSelect",
      "OnScreenKeyboard",
      "PasswordInput",
      "Radio",
      "RadioGroup",
      "ResizableScreen",
      "Dropmenu",
      "Sidebar",
      "Skeleton",
      "Spinner",
      "Switch",
      "Table",
      "Tabs",
      "Textarea",
      "ToastProvider",
      "Tooltip",
      "Typography",
    ];

    for (const component of components) {
      expect(AsheeUI).toHaveProperty(component);
    }
  });

  it("keeps internal helpers and the configuration-only module out of the public surface", () => {
    expect(AsheeUI).not.toHaveProperty("FieldShell");
    expect(AsheeUI).not.toHaveProperty("Menu");
    expect(AsheeUI).not.toHaveProperty("useMenuFloating");
    expect(AsheeUI).not.toHaveProperty("defaultScrollbarConfig");
  });

  it("registers component defaults, including the configuration-only scrollbar module", () => {
    const defaults = getAllComponentDefaults();

    expect(defaults.button).toBeDefined();
    expect(defaults.accordion).toBeDefined();
    expect(defaults.scrollbar).toBeDefined();
  });
});

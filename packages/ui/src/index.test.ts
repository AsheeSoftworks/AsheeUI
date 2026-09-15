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
      "AuthLayout",
      "Autocomplete",
      "Avatar",
      "Badge",
      "Breadcrumb",
      "Button",
      "CTA",
      "Card",
      "Carousel",
      "Centered",
      "Chip",
      "Calendar",
      "Clipboard",
      "Container",
      "CopyButton",
      "DataTable",
      "DocsLayout",
      "Drawer",
      "EmptyState",
      "ErrorState",
      "FeatureGrid",
      "FileUpload",
      "Footer",
      "Grid",
      "HStack",
      "Hero",
      "Image",
      "Input",
      "Link",
      "LoadingState",
      "Marquee",
      "MarketingLayout",
      "Modal",
      "MultiSelect",
      "Navbar",
      "OnScreenKeyboard",
      "Page",
      "PageContent",
      "PageFooter",
      "PageHeader",
      "Pagination",
      "PasswordInput",
      "PinInput",
      "PricingCard",
      "Radio",
      "RadioGroup",
      "ResizableScreen",
      "Dropmenu",
      "SearchInput",
      "Section",
      "Sidebar",
      "SidebarLayout",
      "Skeleton",
      "Spinner",
      "Split",
      "Stack",
      "Stepper",
      "Switch",
      "Table",
      "Tabs",
      "Testimonials",
      "Textarea",
      "ToastProvider",
      "Tooltip",
      "Typography",
      "VStack",
    ];

    for (const component of components) {
      expect(AsheeUI).toHaveProperty(component);
    }
  });

  it("exports the shared configuration vocabulary the patterns use", () => {
    const values = [
      "FALLBACK_CONTAINER_CONFIG",
      "FALLBACK_STACK_CONFIG",
      "defaultHeroConfig",
      "defaultNavbarConfig",
    ];

    for (const value of values) {
      expect(AsheeUI).toHaveProperty(value);
    }
  });

  it("keeps internal helpers and the configuration-only module out of the public surface", () => {
    expect(AsheeUI).not.toHaveProperty("FieldShell");
    expect(AsheeUI).not.toHaveProperty("Menu");
    expect(AsheeUI).not.toHaveProperty("useMenuFloating");
    expect(AsheeUI).not.toHaveProperty("defaultScrollbarConfig");
  });

  it("keeps component-internal helpers and contexts out of the public surface", () => {
    // Each of these serves one component only, and every other component keeps
    // its equivalent private, so they were public by accident rather than by
    // design. They are not documented as public API.
    expect(AsheeUI).not.toHaveProperty("getInitials");
    expect(AsheeUI).not.toHaveProperty("getPaginationRange");
    expect(AsheeUI).not.toHaveProperty("RadioContext");
    expect(AsheeUI).not.toHaveProperty("useRadioGroupContext");
    expect(AsheeUI).not.toHaveProperty("formatFileSize");
    expect(AsheeUI).not.toHaveProperty("describeRejectedFiles");
    expect(AsheeUI).not.toHaveProperty("SkipLink");
  });

  it("keeps every component's class maps out of the public surface", () => {
    // Styles are the component's own business: a consumer restyles through the
    // cascade, `className` or configuration, never by importing a class string.
    expect(AsheeUI).not.toHaveProperty("CENTERED_AXIS_CLASS");
    expect(AsheeUI).not.toHaveProperty("SPLIT_STACK_CLASS");
    expect(AsheeUI).not.toHaveProperty("DATA_TABLE_CLASS");
    expect(AsheeUI).not.toHaveProperty("STEPPER_LIST_CLASS");
  });

  it("keeps the section kit and the Puck configuration off the main entry point", () => {
    // The kit is an implementation detail the patterns share, and the Puck
    // configuration is deliberately behind its own subpath (`asheeui/puck`),
    // so an application that does not build pages never loads it.
    expect(AsheeUI).not.toHaveProperty("SectionHeading");
    expect(AsheeUI).not.toHaveProperty("ActionGroup");
    expect(AsheeUI).not.toHaveProperty("asheePuckConfig");
  });

  it("registers component defaults, including the configuration-only scrollbar module", () => {
    const defaults = getAllComponentDefaults();

    expect(defaults.button).toBeDefined();
    expect(defaults.accordion).toBeDefined();
    expect(defaults.scrollbar).toBeDefined();
    expect(defaults.container).toBeDefined();
    expect(defaults.hero).toBeDefined();
    expect(defaults.navbar).toBeDefined();
  });
});

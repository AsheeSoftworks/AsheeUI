/**
 * The component compatibility matrix.
 *
 * Every public component is classified by what it means on each platform, so
 * platform support is a stated fact rather than an assumption a developer has to
 * discover by trying. The matrix is data, not prose, so the documentation can be
 * generated from it and a test can keep it complete.
 *
 * The classifications are deliberate:
 *
 * - `shared`: one contract and a real implementation on both platforms, used the
 *   same way by a developer.
 * - `shared-api`: the concept is shared and the platform implementation differs in
 *   behaviour or presentation, which is allowed and documented rather than hidden.
 * - `web-only`: the component exists only on the web, because the concept has no
 *   meaningful native equivalent.
 * - `native-only`: the reverse, a native concept the web has no equivalent for.
 * - `not-applicable`: the component compensates for a browser constraint that the
 *   platform itself solves, so porting it would add a defect rather than a feature.
 */

/**
 * What a component means on each platform.
 */
export type PlatformSupport =
  | "shared"
  | "shared-api"
  | "web-only"
  | "native-only"
  | "not-applicable";

/**
 * One entry of the compatibility matrix.
 */
export interface ComponentSupport {
  /** The exported component name, as an application imports it. */
  name: string;

  /** The inventory module name, as `asheeui list` reports it. */
  module: string;

  /** What the component means across platforms. */
  support: PlatformSupport;

  /** The native equivalent when the two implementations differ. */
  native?: string;

  /** The reason for the classification, where it is not self-evident. */
  note?: string;
}

/**
 * Every public component, classified.
 *
 * The order follows the component inventory so the matrix reads alongside the
 * documentation, and the test suite keeps the two in step.
 */
export const COMPONENT_SUPPORT: readonly ComponentSupport[] = [
  {
    name: "Accordion",
    module: "accordion",
    support: "shared-api",
    native: "Accordion",
    note: "Native expands in place with the platform's own animation",
  },
  { name: "Alert", module: "alert", support: "shared" },
  {
    name: "AuthLayout",
    module: "auth-layout",
    support: "shared-api",
    native: "AuthLayout",
    note: "Native is a full-screen form with safe-area handling",
  },
  {
    name: "Autocomplete",
    module: "autocomplete",
    support: "shared-api",
    native: "Autocomplete",
  },
  { name: "Avatar", module: "avatar", support: "shared" },
  { name: "Badge", module: "badge", support: "shared" },
  {
    name: "Breadcrumb",
    module: "breadcrumb",
    support: "web-only",
    native: "Screen header",
    note: "A hierarchical trail is a web navigation idiom; native shows a titled header with a back control",
  },
  { name: "Button", module: "button", support: "shared" },
  {
    name: "Calendar",
    module: "calendar",
    support: "shared-api",
    native: "Calendar",
    note: "Native presents the platform date picker where one exists",
  },
  { name: "Card", module: "card", support: "shared" },
  {
    name: "Carousel",
    module: "carousel",
    support: "shared-api",
    native: "Carousel",
    note: "Native scrolls with the platform's own paging",
  },
  { name: "Chip", module: "chip", support: "shared" },
  {
    name: "Clipboard",
    module: "clipboard",
    support: "shared-api",
    native: "Clipboard",
    note: "Native copies through the platform clipboard module",
  },
  {
    name: "Container",
    module: "container",
    support: "shared-api",
    native: "Container",
    note: "Native caps the content width and applies safe-area insets instead of a gutter",
  },
  { name: "CTA", module: "cta", support: "shared-api", native: "CTA" },
  {
    name: "Drawer",
    module: "drawer",
    support: "shared-api",
    native: "Drawer",
    note: "Native presents a bottom sheet a thumb can reach, not a side panel",
  },
  {
    name: "Dropmenu",
    module: "dropmenu",
    support: "shared-api",
    native: "Dropmenu",
    note: "Native uses the platform selection control or an action sheet",
  },
  { name: "EmptyState", module: "empty-state", support: "shared" },
  {
    name: "FeatureGrid",
    module: "feature-grid",
    support: "shared-api",
    native: "FeatureGrid",
    note: "Native wraps a row of cards instead of using a column grid",
  },
  {
    name: "Footer",
    module: "footer",
    support: "shared-api",
    native: "Footer",
    note: "A native footer carries less navigation; the contract still holds",
  },
  { name: "Form", module: "form", support: "shared" },
  {
    name: "Grid",
    module: "grid",
    support: "shared-api",
    native: "Grid",
    note: "Native expresses columns as a wrapped row of fixed-basis children",
  },
  { name: "Hero", module: "hero", support: "shared-api", native: "Hero" },
  { name: "Image", module: "image", support: "shared" },
  { name: "Input", module: "input", support: "shared" },
  {
    name: "Keyboard",
    module: "keyboard",
    support: "not-applicable",
    note: "A rendered keyboard compensates for a browser constraint; the platform provides its own",
  },
  {
    name: "Link",
    module: "link",
    support: "shared-api",
    native: "Link",
    note: "Native opens a URL or navigates through the application's navigator",
  },
  {
    name: "Marquee",
    module: "marquee",
    support: "shared-api",
    native: "Marquee",
    note: "Native animates a scroller and respects the platform's motion preference",
  },
  {
    name: "Modal",
    module: "modal",
    support: "shared-api",
    native: "Modal",
    note: "Native presents a platform modal with its own dismissal behaviour",
  },
  {
    name: "MultiSelect",
    module: "multi-select",
    support: "shared-api",
    native: "MultiSelect",
  },
  {
    name: "Navbar",
    module: "navbar",
    support: "shared-api",
    native: "Header and TabBar",
    note: "Native navigation is a header with a tab bar, not a bar of links",
  },
  {
    name: "Page",
    module: "page",
    support: "shared-api",
    native: "Screen",
    note: "Native composes a screen with safe areas and a scroll view",
  },
  {
    name: "Pagination",
    module: "pagination",
    support: "shared-api",
    native: "List footer",
    note: "Native lists load more rather than paging",
  },
  { name: "PinInput", module: "pin-input", support: "shared" },
  {
    name: "PricingCard",
    module: "pricing-card",
    support: "shared-api",
    native: "PricingCard",
    note: "Composes the shared card contract",
  },
  { name: "Radio", module: "radio", support: "shared" },
  {
    name: "ResizableScreen",
    module: "resizable-screen",
    support: "web-only",
    note: "A draggable split is a desktop idiom; native split views come from the platform",
  },
  { name: "Section", module: "section", support: "shared" },
  {
    name: "Sidebar",
    module: "sidebar",
    support: "shared-api",
    native: "Drawer navigation",
    note: "Native navigation is a drawer or a tab bar",
  },
  {
    name: "SidebarLayout",
    module: "sidebar-layout",
    support: "shared-api",
    native: "DrawerLayout",
    note: "Native stacks or draws the navigation column",
  },
  { name: "Skeleton", module: "skeleton", support: "shared" },
  { name: "Spinner", module: "spinner", support: "shared" },
  { name: "Stack", module: "stack", support: "shared" },
  { name: "Switch", module: "switch", support: "shared" },
  {
    name: "Table",
    module: "table",
    support: "shared-api",
    native: "RowList",
    note: "Native renders rows rather than a table, because a table is not a native reading pattern",
  },
  {
    name: "Tabs",
    module: "tabs",
    support: "shared-api",
    native: "Tabs",
    note: "Native tabs are scrollable segments or platform tabs",
  },
  {
    name: "Testimonials",
    module: "testimonials",
    support: "shared-api",
    native: "Testimonials",
  },
  { name: "Textarea", module: "textarea", support: "shared" },
  {
    name: "Toast",
    module: "toast",
    support: "shared-api",
    native: "Toast",
    note: "Native presents the platform snackbar where one exists",
  },
  {
    name: "Tooltip",
    module: "tooltip",
    support: "shared-api",
    native: "Tooltip",
    note: "Native triggers on long press, because there is no hover",
  },
  {
    name: "Typography",
    module: "typography",
    support: "shared-api",
    native: "Text",
    note: "Native resolves the same roles to platform text styles",
  },
];

/**
 * Find one component's classification by its exported name.
 *
 * @param name - The exported component name.
 * @returns The classification, or undefined when the component is unknown.
 */
export function findComponentSupport(
  name: string,
): ComponentSupport | undefined {
  return COMPONENT_SUPPORT.find((entry) => entry.name === name);
}

/**
 * The classification vocabulary, for documentation and for a consumer that wants
 * to render the matrix.
 */
export const PLATFORM_SUPPORT_LABEL: Record<PlatformSupport, string> = {
  shared: "Shared",
  "shared-api": "Shared API, separate implementation",
  "web-only": "Web only",
  "native-only": "Native only",
  "not-applicable": "Not applicable to native",
};

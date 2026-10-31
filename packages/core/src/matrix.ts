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
 *
 * ## Decisions this matrix records
 *
 * - `Breadcrumb` stays **web-only** (WP-13 is not taken): a URL trail has no device
 *   counterpart, and a web application imports it from `@asheeui/web`.
 * - `ResizableScreen` is **web-only** (D-6): a draggable split is a desktop idiom; a
 *   platform's split view comes from the platform.
 * - The keyboard family is **not-applicable** (D-7): a rendered keyboard compensates for a
 *   browser constraint, and the device already supplies one.
 * - Shadows and blur **diverge** (D-4): each renderer uses its platform's elevation and
 *   blur, and the matrix does not pretend the two are pixel-equal. The shared token scale
 *   is the vocabulary, not a guarantee that every level renders identically.
 * - The two Tailwind majors (D-8) are a packaging decision rather than a component one:
 *   the web renderer is Tailwind 4 and the native renderer is NativeWind on Tailwind 3, so
 *   an application that targets both keeps the two pipelines separate. `asheeui`'s README
 *   states the peer range.
 *
 * A component that is missing from this list is a component whose platform support nobody
 * decided; `scripts/lib/matrix-coverage.mjs` fails the build for it. An export that is an
 * alias or a part of a bigger module (`Text` → `Typography`, `PageHeader` → `Page`) is
 * declared in `scripts/matrix-coverage.json` instead.
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
  native?: string | undefined;

  /**
   * The subpath that publishes the component when the root entry does not.
   *
   * The section kit is public through the `section-kit` subpath rather than the root entry,
   * so its components are classified here but are not part of the umbrella's root surface.
   */
  subpath?: string | undefined;

  /** The reason for the classification, where it is not self-evident. */
  note?: string | undefined;
}

/**
 * Every public component, classified.
 *
 * The order follows the component inventory so the matrix reads alongside the
 * documentation, and the test suite keeps the two in step.
 */
export const COMPONENT_SUPPORT: readonly ComponentSupport[] = [
  { name: "AsheeUIProvider", module: "provider", support: "shared" },
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
    note: "Native picks from one surface at a time and steps the time, because the platform has no floating layer beside a control; `picker`, `portal` and `lockScroll` are accepted and warn",
  },
  { name: "Card", module: "card", support: "shared" },
  {
    name: "Carousel",
    module: "carousel",
    support: "shared-api",
    native: "Carousel",
    note: "Native scrolls with the platform's own paging",
  },
  {
    name: "Centered",
    module: "centered",
    support: "shared-api",
    native: "Centered",
    note: "Native centres on the axis and claims the height, but has no contained width: the platform's own screen width is the measure",
  },
  { name: "Chip", module: "chip", support: "shared" },
  {
    name: "Clipboard",
    module: "clipboard",
    support: "shared-api",
    native: "Clipboard",
    note: "Native copies through the platform clipboard module",
  },
  { name: "ColorSwatch", module: "color-swatch", support: "shared" },
  { name: "CopyButton", module: "copy-button", support: "shared" },
  {
    name: "Container",
    module: "container",
    support: "shared-api",
    native: "Container",
    note: "Native caps the content width and applies safe-area insets instead of a gutter",
  },
  { name: "CTA", module: "cta", support: "shared-api", native: "CTA" },
  {
    name: "DataTable",
    module: "data-table",
    support: "shared-api",
    native: "DataTable",
    note: "Native's DataTable is the same rows with the search, the count and the paging around them, drawn through RowList, for the same reason Table is",
  },
  {
    name: "DocsLayout",
    module: "docs-layout",
    support: "shared-api",
    native: "DocsLayout",
    note: "Native shows the same three regions as stacked sections, because a three-column reading layout is a large-window web arrangement",
  },
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
    note: "Native uses the platform selection control or an action sheet; both renderers also export it as `Dropdown`, the name the documentation uses; `name` and `searchInputName` are accepted and warn",
  },
  { name: "EmptyState", module: "empty-state", support: "shared" },
  {
    name: "ErrorState",
    module: "error-state",
    support: "shared",
    note: "Composes the framework's empty presentation with the error tone and a retry",
  },
  {
    name: "FeatureGrid",
    module: "feature-grid",
    support: "shared-api",
    native: "FeatureGrid",
    note: "Native reads the window itself rather than using breakpoint variants, so a stated column count lands on the cards' cell widths",
  },
  {
    name: "FileUpload",
    module: "file-upload",
    support: "shared-api",
    native: "File picker",
    note: "Native opens the platform's document picker, so a drop zone has no equivalent",
  },
  {
    name: "Footer",
    module: "footer",
    support: "shared-api",
    native: "Footer",
    note: "Native keeps the groups stacked and wrapped rather than turning them into a row at a breakpoint, and has no anchor to substitute",
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
  { name: "Image", module: "image", support: "shared", note: "`loading` is accepted and warns; a native picture is fetched when its view mounts" },
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
    name: "LoadingState",
    module: "loading-state",
    support: "shared",
    note: "Composes the framework's spinner, and claims room so a screen does not jump",
  },
  {
    name: "MarketingLayout",
    module: "marketing-layout",
    support: "shared-api",
    native: "Screen",
    note: "Native stacks the sections in a scroll view and keeps the same landmarks",
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
    note: "Native navigation is a header with a tab bar, not a bar of links; `mobileOpen`, `onMobileOpenChange` and `mobileLabel` are accepted and warn",
  },
  {
    name: "Page",
    module: "page",
    support: "shared-api",
    native: "Screen",
    note: "Native composes a screen with safe areas and a scroll view; `sticky` is accepted and warns",
  },
  {
    name: "Pagination",
    module: "pagination",
    support: "shared-api",
    native: "List footer",
    note: "Native lists load more rather than paging",
  },
  { name: "PasswordInput", module: "password-input", support: "shared" },
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
  {
    name: "RowList",
    module: "row-list",
    support: "native-only",
    note: "The platform's own renderer of the table and data-table contracts, which native's Table and DataTable draw through; the web has no counterpart to port",
  },
  {
    name: "SearchInput",
    module: "search-input",
    support: "shared",
    note: "Composes the shared input contract with a search landmark and a clear control; `shortcut` is accepted and warns",
  },
  { name: "Section", module: "section", support: "shared" },
  {
    name: "ActionGroup",
    module: "action-group",
    support: "shared",
    subpath: "section-kit",
    note: "The section kit's action row; both renderers publish it on their section-kit subpath",
  },
  {
    name: "SectionHeading",
    module: "section-heading",
    support: "shared",
    subpath: "section-kit",
    note: "The section kit's heading block; both renderers publish it on their section-kit subpath",
  },
  {
    name: "SkipLink",
    module: "skip-link",
    support: "web-only",
    subpath: "section-kit",
    note: "A skip link compensates for a browser's tab order; the platform's focus order and accessibility rotor need no equivalent, so `asheeui/section-kit` does not carry it",
  },
  {
    name: "Sidebar",
    module: "sidebar",
    support: "shared-api",
    native: "Sidebar",
    note: "Native draws the same list and collapses it to a rail; a collapsed row explains itself through the platform's long press rather than a hover, and the control that folds the column is the application's own on both platforms",
  },
  {
    name: "SidebarLayout",
    module: "sidebar-layout",
    support: "shared-api",
    native: "SidebarLayout",
    note: "Native states the direction once from the window — stacked, and beside the content from lg — because a platform screen has no media query",
  },
  { name: "Skeleton", module: "skeleton", support: "shared" },
  { name: "Spinner", module: "spinner", support: "shared" },
  {
    name: "Split",
    module: "split",
    support: "shared-api",
    native: "Split",
    note: "Native reads the window width rather than a media query, and `stickyEnd` resolves through the contract without stating a class, because the platform has no scroll-linked positioning; `stickyEnd` is accepted and warns",
  },
  { name: "Stack", module: "stack", support: "shared" },
  {
    name: "Stepper",
    module: "stepper",
    support: "shared",
    note: "A native stepper is the same ordered list, with touch-sized steps",
  },
  { name: "Switch", module: "switch", support: "shared" },
  {
    name: "TabBar",
    module: "tab-bar",
    support: "native-only",
    note: "The platform's bar of destinations at the edge a thumb reaches, shipped from the navbar module; the web keeps its destinations in the bar at the top of the page",
  },
  {
    name: "Table",
    module: "table",
    support: "shared-api",
    native: "Table",
    note: "Native's Table draws the same rows through RowList, because a table is not a native reading pattern: a row is a set of labelled lines",
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
  { name: "Textarea", module: "textarea", support: "shared", note: "`enableVirtualKeyboard` is accepted and warns; the system keyboard is the one that appears" },
  {
    name: "Toast",
    module: "toast",
    support: "shared-api",
    native: "ToastProvider",
    note: "Native stacks the messages in a layer above the screen and anchors them to the bottom by default, because the platform's own snackbar cannot carry the title, the action or the dismissal the contract names; `portal` and `portalTarget` are accepted and warn",
  },
  {
    name: "Tooltip",
    module: "tooltip",
    support: "shared-api",
    native: "Tooltip",
    note: "Native triggers on long press, because there is no hover; `zIndex` is accepted and warns",
  },
  {
    name: "Typography",
    module: "typography",
    support: "shared-api",
    native: "Typography",
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

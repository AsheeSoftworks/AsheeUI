/**
 * The portable surface: the names `asheeui` offers on both platforms.
 *
 * A contract is the part of a component both platforms agree on — the prop names, the values they
 * accept, which props are required, and what the component means by them — and it deliberately says
 * nothing about how the component is built, so a web component and a native component can satisfy
 * the same contract with completely different implementations. The contracts are types rather than
 * components because the framework's promise is a contract, not shared source. A component's
 * implementation is free to be exactly what its platform needs; what a shared file may write is the
 * list below.
 *
 * This is the umbrella's declared surface, and it is declared rather than inferred for the same
 * reason `COMPONENT_SUPPORT` is: a fact inferred from two renderers' barrels changes whenever either
 * barrel changes and nobody decides it. `asheeui` used to be `export *` over each renderer, so a
 * shared file compiled against the union and found `undefined` on the other platform. The umbrella
 * is the intersection now, generated into both of its entries from this list (B20), and a guard
 * (B21) keeps the two entries equal to it.
 *
 * Three properties make this the right home:
 *
 * - **It is the same kind of data as the matrix**, so the two can be cross-checked: every
 *   `shared`/`shared-api` component in `COMPONENT_SUPPORT` must appear here, and nothing the matrix
 *   calls `web-only`, `native-only` or `not-applicable` may.
 * - **`pending` is a ratchet**, mirroring `scripts/native-parity.json`: a name listed with a pending
 *   plan batch is allowed to be missing today, and the guard fails once it is published by both
 *   renderers, so the list can only shrink.
 * - **The docs and the CLI can render it.** The site already generates component pages from the
 *   matrix; the umbrella's page is generated from this list.
 *
 * ## `source`, a documented extension of `UMBRELLA-REPORT.md` §3.2
 *
 * The report's shape says *what* is portable but not *where it lives*, and the generator has to
 * route every name to a package. The names do not all have one home: `mergeObject`, `resolveCascade`,
 * `resolveClassKey`, `resolveConfigCascade`, `resolveRadiusKey`, `resolveGridColumns`,
 * `resolveBreakpoint`, `resolveCardVariant`, `THEME_STORAGE_KEY` and the shared type vocabulary are
 * published by `@asheeui/core`; `cn`, `resolveAnimate`, every hook, every provider and every
 * component are published by the renderers. `source` states which one, and the guard checks the
 * declaration instead of assuming a rule: a `core` entry must be published by core, and a `renderer`
 * entry by both renderer entries. It is not a way to route `cn` from core — that would make the
 * umbrella's `cn` a second implementation, which is the drift this list exists to prevent.
 *
 * The list is a flat array of object literals because two guards read it as data: `check-umbrella`
 * and `generate-umbrella` parse `{ … }` entries with a regular expression rather than importing
 * this module (a script cannot import TypeScript). A nested object, a computed key or a spread would
 * silently disappear from what those two see, so every entry states its five facts inline.
 *
 * No entry names a class string. C1–C3 moved the class dictionaries into the renderers, so a
 * `*_CLASS`, `*_STYLE` or `*_GLYPH` name is not part of this surface even if a renderer exports it;
 * the test proves it by reading the dictionaries.
 *
 * @see UMBRELLA-REPORT.md §3.2 for the shape, §6 for the six assertions and Appendix C for the seed.
 */

import type { PlatformSupport } from "./matrix";

/**
 * How a portable name reaches a consumer.
 *
 * The generator needs this to emit the right verb: a `type` is exported with `export type`, and
 * everything else with `export`. The remaining distinctions are documentation and the grouping the
 * generated entries carry.
 */
export type PortableKind =
  | "component"
  | "provider"
  | "hook"
  | "helper"
  | "type"
  | "constant";

/**
 * The package that publishes a portable name.
 *
 * `core` is `@asheeui/core`; `renderer` is whichever renderer the umbrella's branch resolves to
 * (`@asheeui/web` or `@asheeui/native`). A renderer name must be published by both, because an
 * umbrella that offered it on one platform would be the union again.
 */
export type PortableSource = "core" | "renderer";

/** One name a shared file may import from `asheeui`. */
export interface PortableExport {
  /** The name a consumer writes — identical on both branches by construction. */
  name: string;

  /** Which export form the generator emits. */
  kind: PortableKind;

  /**
   * The matrix classification the name inherits (`shared` or `shared-api`). A component that is
   * `web-only`, `native-only` or `not-applicable` may not appear here, and a test proves it.
   */
  support: Extract<PlatformSupport, "shared" | "shared-api">;

  /** The package that publishes it; see the module documentation for why this field exists. */
  source: PortableSource;

  /** What a shared file must know about the difference, when there is one. */
  note?: string;

  /** Work that must land before this name can be portable. The guard ratchets on these. */
  pending?: readonly string[];
}

/**
 * Every name `asheeui` offers on both platforms, and nothing else.
 *
 * Sorted by name so a diff reads as an addition or a removal rather than a rearrangement. A
 * component's `support` is the matrix's classification; a non-component is `shared` unless the
 * concept itself differs across platforms.
 */
export const PORTABLE_API: readonly PortableExport[] = [
  { name: "Accordion", kind: "component", support: "shared-api", source: "renderer" },
  { name: "AccordionItem", kind: "type", support: "shared", source: "core" },
  { name: "AccordionSizeKey", kind: "type", support: "shared", source: "core" },
  { name: "AccordionVariant", kind: "type", support: "shared", source: "core" },
  { name: "Alert", kind: "component", support: "shared", source: "renderer" },
  { name: "AsheeColorRegistry", kind: "type", support: "shared", source: "core" },
  { name: "AsheeConfigContext", kind: "constant", support: "shared", source: "renderer" },
  { name: "AsheeUIProvider", kind: "provider", support: "shared", source: "renderer" },
  { name: "AsheeUIProviderProps", kind: "type", support: "shared", source: "renderer" },
  { name: "AuthLayout", kind: "component", support: "shared-api", source: "renderer" },
  { name: "AuthLayoutAlign", kind: "type", support: "shared", source: "core" },
  { name: "AuthLayoutMediaPosition", kind: "type", support: "shared", source: "core" },
  { name: "Autocomplete", kind: "component", support: "shared-api", source: "renderer" },
  { name: "Avatar", kind: "component", support: "shared", source: "renderer" },
  { name: "Badge", kind: "component", support: "shared", source: "renderer" },
  { name: "BreakpointName", kind: "type", support: "shared", source: "core" },
  { name: "BreakpointState", kind: "type", support: "shared", source: "core" },
  { name: "Button", kind: "component", support: "shared", source: "renderer" },
  { name: "CTA", kind: "component", support: "shared-api", source: "renderer" },
  { name: "Calendar", kind: "component", support: "shared-api", source: "renderer" },
  { name: "Card", kind: "component", support: "shared", source: "renderer" },
  { name: "CardImageLoading", kind: "type", support: "shared", source: "core" },
  { name: "CardImagePosition", kind: "type", support: "shared", source: "core" },
  { name: "CardVariant", kind: "type", support: "shared", source: "core" },
  { name: "Carousel", kind: "component", support: "shared-api", source: "renderer" },
  { name: "CarouselItem", kind: "type", support: "shared", source: "core" },
  { name: "CarouselVariant", kind: "type", support: "shared", source: "core" },
  { name: "Centered", kind: "component", support: "shared-api", source: "renderer" },
  { name: "CenteredAxis", kind: "type", support: "shared", source: "core" },
  { name: "Chip", kind: "component", support: "shared", source: "renderer" },
  { name: "Clipboard", kind: "component", support: "shared-api", source: "renderer" },
  { name: "ClipboardState", kind: "type", support: "shared", source: "renderer" },
  { name: "Color", kind: "type", support: "shared", source: "core" },
  { name: "ColorVariant", kind: "type", support: "shared", source: "core" },
  { name: "ColumnDef", kind: "type", support: "shared", source: "core" },
  { name: "Container", kind: "component", support: "shared-api", source: "renderer" },
  { name: "ContainerSize", kind: "type", support: "shared", source: "core" },
  { name: "CopyButton", kind: "component", support: "shared", source: "renderer" },
  { name: "CtaPanel", kind: "type", support: "shared", source: "core" },
  { name: "DataTable", kind: "component", support: "shared-api", source: "renderer" },
  { name: "DocsLayout", kind: "component", support: "shared-api", source: "renderer" },
  { name: "Drawer", kind: "component", support: "shared-api", source: "renderer" },
  { name: "DrawerConfigOptions", kind: "type", support: "shared", source: "core" },
  { name: "DrawerPlacement", kind: "type", support: "shared", source: "core" },
  { name: "DrawerSize", kind: "type", support: "shared", source: "core" },
  { name: "Dropdown", kind: "component", support: "shared", source: "renderer" },
  { name: "Dropmenu", kind: "component", support: "shared-api", source: "renderer" },
  { name: "EmptyState", kind: "component", support: "shared", source: "renderer" },
  { name: "ErrorState", kind: "component", support: "shared", source: "renderer" },
  { name: "ErrorStateRole", kind: "type", support: "shared", source: "core" },
  { name: "ExternalConfig", kind: "type", support: "shared", source: "core" },
  { name: "FeatureGrid", kind: "component", support: "shared-api", source: "renderer" },
  { name: "FeatureGridLink", kind: "type", support: "shared", source: "renderer" },
  { name: "FeatureItem", kind: "type", support: "shared", source: "core" },
  { name: "FileUpload", kind: "component", support: "shared-api", source: "renderer" },
  { name: "Footer", kind: "component", support: "shared-api", source: "renderer" },
  { name: "FooterGroup", kind: "type", support: "shared", source: "core" },
  { name: "FooterLink", kind: "type", support: "shared", source: "renderer" },
  { name: "FooterLinkItem", kind: "type", support: "shared", source: "core" },
  { name: "FooterVariant", kind: "type", support: "shared", source: "core" },
  { name: "Form", kind: "component", support: "shared", source: "renderer" },
  { name: "Grid", kind: "component", support: "shared-api", source: "renderer" },
  { name: "GridAlign", kind: "type", support: "shared", source: "core" },
  { name: "GridColumns", kind: "type", support: "shared", source: "core" },
  { name: "HStack", kind: "component", support: "shared", source: "renderer" },
  { name: "Hero", kind: "component", support: "shared-api", source: "renderer" },
  { name: "HeroAlign", kind: "type", support: "shared", source: "core" },
  { name: "HeroMediaPosition", kind: "type", support: "shared", source: "core" },
  { name: "Image", kind: "component", support: "shared", source: "renderer" },
  { name: "ImageFit", kind: "type", support: "shared", source: "core" },
  { name: "ImageRatioKey", kind: "type", support: "shared", source: "core" },
  { name: "Input", kind: "component", support: "shared", source: "renderer" },
  { name: "Link", kind: "component", support: "shared-api", source: "renderer" },
  { name: "LinkSubstitution", kind: "type", support: "shared", source: "core" },
  { name: "LinkUnderline", kind: "type", support: "shared", source: "core" },
  { name: "LinkVariant", kind: "type", support: "shared", source: "core" },
  { name: "LoadingState", kind: "component", support: "shared", source: "renderer" },
  { name: "MarketingLayout", kind: "component", support: "shared-api", source: "renderer" },
  { name: "MarketingLayoutBackground", kind: "type", support: "shared", source: "core" },
  { name: "Marquee", kind: "component", support: "shared-api", source: "renderer" },
  { name: "MarqueeAxis", kind: "type", support: "shared", source: "core" },
  { name: "MarqueeDirection", kind: "type", support: "shared", source: "core" },
  { name: "MarqueeSpeedPreset", kind: "type", support: "shared", source: "core" },
  { name: "Modal", kind: "component", support: "shared-api", source: "renderer" },
  { name: "ModalPosition", kind: "type", support: "shared", source: "core" },
  { name: "ModalSizeKey", kind: "type", support: "shared", source: "core" },
  { name: "MultiSelect", kind: "component", support: "shared-api", source: "renderer" },
  { name: "Navbar", kind: "component", support: "shared-api", source: "renderer" },
  { name: "NavbarAlign", kind: "type", support: "shared", source: "core" },
  { name: "NavbarLink", kind: "type", support: "shared", source: "core" },
  { name: "NavbarLinkItem", kind: "type", support: "shared", source: "core" },
  { name: "NavbarPosition", kind: "type", support: "shared", source: "core" },
  { name: "NavbarVariant", kind: "type", support: "shared", source: "core" },
  { name: "Page", kind: "component", support: "shared-api", source: "renderer" },
  { name: "PageContent", kind: "component", support: "shared", source: "renderer" },
  { name: "PageFooter", kind: "component", support: "shared", source: "renderer" },
  { name: "PageHeader", kind: "component", support: "shared", source: "renderer" },
  { name: "Pagination", kind: "component", support: "shared-api", source: "renderer" },
  { name: "PaginationLink", kind: "type", support: "shared", source: "renderer" },
  { name: "PasswordInput", kind: "component", support: "shared", source: "renderer" },
  { name: "PinInput", kind: "component", support: "shared", source: "renderer" },
  { name: "PricingCard", kind: "component", support: "shared-api", source: "renderer" },
  { name: "PricingCardVariant", kind: "type", support: "shared", source: "core" },
  { name: "PricingFeatureItem", kind: "type", support: "shared", source: "core" },
  { name: "Radio", kind: "component", support: "shared", source: "renderer" },
  { name: "RadioGroup", kind: "type", support: "shared", source: "renderer" },
  { name: "Radius", kind: "type", support: "shared", source: "core" },
  { name: "SearchInput", kind: "component", support: "shared", source: "renderer" },
  { name: "Section", kind: "component", support: "shared", source: "renderer" },
  { name: "Sidebar", kind: "component", support: "shared-api", source: "renderer" },
  { name: "SidebarCollapse", kind: "type", support: "shared", source: "renderer" },
  { name: "SidebarCollapseContext", kind: "constant", support: "shared", source: "renderer" },
  { name: "SidebarItem", kind: "type", support: "shared", source: "core" },
  { name: "SidebarItems", kind: "type", support: "shared", source: "core" },
  { name: "SidebarLayout", kind: "component", support: "shared-api", source: "renderer" },
  { name: "SidebarLayoutSide", kind: "type", support: "shared", source: "core" },
  { name: "SidebarLayoutWidth", kind: "type", support: "shared", source: "core" },
  { name: "SidebarLinkSubstitution", kind: "type", support: "shared", source: "core" },
  { name: "SidebarSection", kind: "type", support: "shared", source: "core" },
  { name: "SidebarSizeKey", kind: "type", support: "shared", source: "core" },
  { name: "SidebarVariant", kind: "type", support: "shared", source: "core" },
  { name: "Size", kind: "type", support: "shared", source: "core" },
  { name: "Skeleton", kind: "component", support: "shared", source: "renderer" },
  { name: "Space", kind: "type", support: "shared", source: "core" },
  { name: "Spinner", kind: "component", support: "shared", source: "renderer" },
  { name: "Split", kind: "component", support: "shared-api", source: "renderer" },
  { name: "SplitAlign", kind: "type", support: "shared", source: "core" },
  { name: "SplitRatio", kind: "type", support: "shared", source: "core" },
  { name: "SplitStackAt", kind: "type", support: "shared", source: "core" },
  { name: "Stack", kind: "component", support: "shared", source: "renderer" },
  { name: "StackAlign", kind: "type", support: "shared", source: "core" },
  { name: "StackDirection", kind: "type", support: "shared", source: "core" },
  { name: "StackJustify", kind: "type", support: "shared", source: "core" },
  { name: "Stepper", kind: "component", support: "shared", source: "renderer" },
  { name: "StepperStep", kind: "type", support: "shared", source: "renderer" },
  { name: "Substitution", kind: "type", support: "shared", source: "core" },
  { name: "Switch", kind: "component", support: "shared", source: "renderer" },
  { name: "THEME_STORAGE_KEY", kind: "constant", support: "shared", source: "core" },
  { name: "TabItem", kind: "type", support: "shared", source: "core" },
  { name: "Table", kind: "component", support: "shared-api", source: "renderer" },
  { name: "TableVariant", kind: "type", support: "shared", source: "core" },
  { name: "Tabs", kind: "component", support: "shared-api", source: "renderer" },
  { name: "TabsVariant", kind: "type", support: "shared", source: "core" },
  { name: "TestimonialItem", kind: "type", support: "shared", source: "core" },
  { name: "Testimonials", kind: "component", support: "shared-api", source: "renderer" },
  { name: "Text", kind: "component", support: "shared-api", source: "renderer" },
  { name: "Textarea", kind: "component", support: "shared", source: "renderer" },
  { name: "ThemeName", kind: "type", support: "shared", source: "core" },
  { name: "ThemeSelection", kind: "type", support: "shared", source: "core" },
  { name: "ToastContext", kind: "constant", support: "shared", source: "renderer" },
  { name: "ToastContextType", kind: "type", support: "shared", source: "renderer" },
  { name: "ToastItem", kind: "component", support: "shared", source: "renderer" },
  { name: "ToastItemData", kind: "type", support: "shared", source: "core" },
  { name: "ToastPlacement", kind: "type", support: "shared", source: "core" },
  { name: "ToastProvider", kind: "provider", support: "shared-api", source: "renderer" },
  { name: "ToastShowOptions", kind: "type", support: "shared", source: "core" },
  { name: "ToastType", kind: "type", support: "shared", source: "core" },
  { name: "Tooltip", kind: "component", support: "shared-api", source: "renderer" },
  { name: "TooltipPlacement", kind: "type", support: "shared", source: "core" },
  { name: "TooltipSizeKey", kind: "type", support: "shared", source: "core" },
  { name: "Typography", kind: "component", support: "shared-api", source: "renderer" },
  { name: "VStack", kind: "component", support: "shared", source: "renderer" },
  { name: "Variant", kind: "type", support: "shared", source: "core" },
  { name: "cn", kind: "helper", support: "shared", source: "renderer" },
  { name: "mergeObject", kind: "helper", support: "shared", source: "core" },
  { name: "resolveAnimate", kind: "helper", support: "shared", source: "renderer" },
  { name: "resolveBreakpoint", kind: "helper", support: "shared", source: "core" },
  { name: "resolveCardVariant", kind: "helper", support: "shared", source: "core" },
  { name: "resolveCascade", kind: "helper", support: "shared", source: "core" },
  { name: "resolveClassKey", kind: "helper", support: "shared", source: "core" },
  { name: "resolveConfigCascade", kind: "helper", support: "shared", source: "core" },
  { name: "resolveGridColumns", kind: "helper", support: "shared", source: "core" },
  { name: "resolveRadiusKey", kind: "helper", support: "shared", source: "core" },
  { name: "themeController", kind: "constant", support: "shared", source: "renderer" },
  { name: "useAshee", kind: "hook", support: "shared", source: "renderer" },
  { name: "useBreakpoint", kind: "hook", support: "shared", source: "renderer" },
  { name: "usePrefersReducedMotion", kind: "hook", support: "shared", source: "renderer" },
  { name: "useReduceMotion", kind: "hook", support: "shared", source: "renderer" },
  { name: "useSidebarCollapse", kind: "hook", support: "shared", source: "renderer" },
  { name: "useTheme", kind: "hook", support: "shared", source: "renderer" },
  { name: "useToast", kind: "hook", support: "shared", source: "renderer" },
];

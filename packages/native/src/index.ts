/**
 * The native package's public surface.
 *
 * The native implementation shares the framework's component vocabulary, its prop
 * contracts and its design language with the web implementation, and shares none of
 * its source. An application importing from `@asheeui/native` therefore finds the
 * components it already knows, behaving the way the platform behaves.
 */

/**
 * The shared vocabulary, under the names `@asheeui/core` declares.
 *
 * These are the types a consumer writes: the design language's tokens, the palette's
 * roles, the typography roles, and the configuration shape a shared `asheeui.config.ts`
 * exports. A shared component imports them from the renderer it already depends on rather
 * than reaching into core, and `@asheeui/web` exports the same list — the point of the
 * naming phase is that a type has one name on both platforms, not a spelling per renderer.
 */
export type {
  ActionConfig,
  AsheeColorRegistry,
  Color,
  ColorConfig,
  ColorVariant,
  DefaultColorConfig,
  ExternalConfig,
  Radius,
  Size,
  Space,
  ThemeName,
  TypographyAlign,
  TypographyRole,
  TypographyTone,
  Variant,
} from "@asheeui/core";

/**
 * The configuration sections a consumer writes, under the names `@asheeui/core` declares.
 *
 * `components.button` is configured by `ButtonConfig` on both platforms, so the name a
 * consumer's `asheeui.config.ts` imports does not depend on the renderer it is compiled
 * against. The platform's own spellings (`NativeButtonConfig` and the rest) stay exported
 * for a minor, each pointing here — they are the renderer's narrowing of the shared shape,
 * not a second contract.
 */
export type {
  AccordionConfig,
  AlertConfig,
  AuthLayoutConfig,
  AvatarConfig,
  BadgeConfig,
  ButtonConfig,
  CalendarConfig,
  CarouselConfig,
  ChipConfig,
  ClipboardConfig,
  ComponentsConfig,
  Config,
  ContainerSize,
  CtaConfig,
  DataTableConfig,
  DocsLayoutConfig,
  DrawerConfig,
  EmptyStateConfig,
  ErrorStateConfig,
  FeatureGridConfig,
  FileUploadConfig,
  FooterConfig,
  FormConfig,
  HeroConfig,
  ImageConfig,
  InputConfig,
  LinkConfig,
  LoadingStateConfig,
  MarketingLayoutConfig,
  MarqueeConfig,
  ModalConfig,
  NavbarConfig,
  PageConfig,
  PaginationConfig,
  PinInputConfig,
  PricingCardConfig,
  RadioConfig,
  SearchInputConfig,
  SidebarConfig,
  SidebarLayoutConfig,
  SkeletonConfig,
  SpinnerConfig,
  SplitConfig,
  StepperConfig,
  SwitchConfig,
  TableConfig,
  TabsConfig,
  TestimonialsConfig,
  ToastConfig,
  TooltipConfig,
} from "@asheeui/core";

export * from "./components/data-display/accordion";
export * from "./components/data-display/avatar";
export * from "./components/data-display/badge";
export * from "./components/data-display/card";
export * from "./components/data-display/carousel";
export * from "./components/data-display/chip";
export * from "./components/data-display/clipboard";
export * from "./components/data-display/image";
export * from "./components/data-display/marquee";
export * from "./components/data-display/row-list";
export * from "./components/feedback/alert";
export * from "./components/feedback/empty-state";
export * from "./components/feedback/error-state";
export * from "./components/feedback/loading-state";
export * from "./components/feedback/skeleton";
export * from "./components/feedback/spinner";
export * from "./components/feedback/toast";
export * from "./components/forms/autocomplete";
export * from "./components/forms/button";
export * from "./components/forms/calendar";
export * from "./components/forms/dropmenu";
export * from "./components/forms/file-upload";
export * from "./components/forms/form";
export * from "./components/forms/input";
export * from "./components/forms/multi-select";
export * from "./components/forms/pin-input";
export * from "./components/forms/radio";
export * from "./components/forms/search-input";
export * from "./components/forms/stepper";
export * from "./components/forms/switch";
export * from "./components/forms/textarea";
export * from "./components/layouts/auth-layout";
export * from "./components/layouts/docs-layout";
export * from "./components/layouts/marketing-layout";
export * from "./components/layouts/page";
export * from "./components/layouts/sidebar-layout";
export * from "./components/layouts/split";
export * from "./components/marketing/cta";
export * from "./components/marketing/feature-grid";
export * from "./components/marketing/hero";
export * from "./components/marketing/pricing-card";
export * from "./components/marketing/testimonials";
export * from "./components/navigation/footer";
export * from "./components/navigation/link";
export * from "./components/navigation/navbar";
export * from "./components/navigation/pagination";
export * from "./components/navigation/sidebar";
export * from "./components/navigation/tabs";
export * from "./components/overlays/drawer";
export * from "./components/overlays/modal";
export * from "./components/overlays/tooltip";
export * from "./components/typography/text";
export * from "./config/resolve-config";
export * from "./hooks/use-breakpoint";
export * from "./hooks/use-reduce-motion";
export * from "./layout";
export * from "./provider";
export * from "./utils/class-names";
export * from "./utils/cn";

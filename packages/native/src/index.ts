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
/**
 * The configuration sections a consumer writes, under the names `@asheeui/core` declares.
 *
 * `components.button` is configured by `ButtonConfig` on both platforms, so the name a
 * consumer's `asheeui.config.ts` imports does not depend on the renderer it is compiled
 * against. The platform's own spellings (`NativeButtonConfig` and the rest) stay exported
 * for a minor, each pointing here — they are the renderer's own shape of the same section
 * (narrowed where the platform has no such option, widened where it has one more), not a
 * second contract.
 */
export type {
  AccordionConfig,
  ActionConfig,
  AlertConfig,
  AsheeColorRegistry,
  AuthLayoutConfig,
  AvatarConfig,
  BadgeConfig,
  ButtonConfig,
  CalendarConfig,
  CarouselConfig,
  ChipConfig,
  ClipboardConfig,
  Color,
  ColorConfig,
  ColorVariant,
  ComponentsConfig,
  Config,
  ContainerSize,
  CtaConfig,
  DataTableConfig,
  DefaultColorConfig,
  DocsLayoutConfig,
  DrawerConfig,
  EmptyStateConfig,
  ErrorStateConfig,
  ExternalConfig,
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
  Radius,
  SearchInputConfig,
  SidebarConfig,
  SidebarLayoutConfig,
  Size,
  SkeletonConfig,
  Space,
  SpinnerConfig,
  SplitConfig,
  StepperConfig,
  SwitchConfig,
  TableConfig,
  TabsConfig,
  TestimonialsConfig,
  ThemeName,
  ToastConfig,
  TooltipConfig,
  TypographyAlign,
  TypographyRole,
  TypographyTone,
  Variant,
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
/**
 * The configuration module's public face.
 *
 * A consumer writes one configuration object for an application, so the type it is declared
 * with (`AsheeConfig`, and the platform's spelling of it) and the resolver the provider
 * passes it through are API. The internal shapes are not: `NativeConfig` is what a
 * component reads *after* resolution, `NativePlatformConfig` and `NativeComponentsConfig`
 * are the pieces it is resolved from, and `NATIVE_FALLBACK_CONFIG` is the baseline the
 * cascade starts at. Nothing outside this package can use a resolved configuration, so
 * exporting them published an implementation detail as a contract — they stay in their
 * module and leave the entry.
 *
 * `NativeExternalConfig` and `resolveNativeConfig` stay: the first is what a configuration
 * file is typed with today, the second is what a root passes the configuration to, and both
 * are on their way to shared names (`ExternalConfig` here, the shared resolver in B09).
 */
export {
  type AsheeConfig,
  type NativeExternalConfig,
  resolveNativeConfig,
} from "./config/resolve-config";
export * from "./config/shared-config-names";

export * from "./hooks/use-breakpoint";
export * from "./hooks/use-reduce-motion";
export * from "./layout";
export * from "./provider";
/**
 * The platform's own class dictionaries and its announcement vocabulary.
 *
 * They were `@asheeui/core`'s until C1. A class string states a decision about pixels, and the
 * two platforms' pixels differ, so the strings a device compiles live here and the shared
 * contract keeps the tokens, the rules and the types. The names did not change.
 */
export * from "./shared/announcement";
export * from "./styles";
export * from "./theme";
export * from "./utils/accessibility";
export * from "./utils/class-names";
export * from "./utils/cn";
export * from "./utils/resolve-animate";

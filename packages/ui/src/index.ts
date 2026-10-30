/**
 * The AsheeUI umbrella package, web branch.
 *
 * GENERATED FILE — do not edit. This entry is written from PORTABLE_API in
 * packages/core/src/portable.ts by scripts/generate-umbrella.mjs, and the other
 * branch from the same list, so the two cannot drift: a name that is portable is
 * exported by both, and a name that is not is exported by neither.
 *
 * The bundler reaches this file for the browser. It re-exports the portable surface and
 * nothing else, which is what keeps a shared file compiling on both platforms. The
 * names cross a package boundary rather than a runtime check, so an import that is
 * not on the list is a compile error on the platform that lacks it.
 *
 * Edit the list, then run `node scripts/generate-umbrella.mjs` (or
 * `pnpm --filter asheeui build`, which runs it first).
 */

"use client";

import "@asheeui/web";

import type { ExternalConfig } from "@asheeui/core";

/**
 * The renderer's values: every component, provider and hook, plus the helpers and
 * constants the renderer owns.
 */

export {
  Accordion,
  Alert,
  AsheeConfigContext,
  AsheeUIProvider,
  AuthLayout,
  Autocomplete,
  Avatar,
  Badge,
  Button,
  CTA,
  Calendar,
  Card,
  Carousel,
  Centered,
  Chip,
  Clipboard,
  Container,
  CopyButton,
  DataTable,
  DocsLayout,
  Drawer,
  Dropdown,
  Dropmenu,
  EmptyState,
  ErrorState,
  FeatureGrid,
  FileUpload,
  Footer,
  Form,
  Grid,
  HStack,
  Hero,
  Image,
  Input,
  Link,
  LoadingState,
  MarketingLayout,
  Marquee,
  Modal,
  MultiSelect,
  Navbar,
  Page,
  PageContent,
  PageFooter,
  PageHeader,
  Pagination,
  PasswordInput,
  PinInput,
  PricingCard,
  Radio,
  SearchInput,
  Section,
  Sidebar,
  SidebarCollapseContext,
  SidebarLayout,
  Skeleton,
  Spinner,
  Split,
  Stack,
  Stepper,
  Switch,
  Table,
  Tabs,
  Testimonials,
  Text,
  Textarea,
  ToastContext,
  ToastItem,
  ToastProvider,
  Tooltip,
  Typography,
  VStack,
  cn,
  resolveAnimate,
  themeController,
  useAshee,
  useBreakpoint,
  usePrefersReducedMotion,
  useReduceMotion,
  useSidebarCollapse,
  useTheme,
  useToast,
} from "@asheeui/web";

/**
 * Core's values: the cascade helpers and the constants both platforms share.
 */

export {
  THEME_STORAGE_KEY,
  mergeObject,
  resolveBreakpoint,
  resolveCardVariant,
  resolveCascade,
  resolveClassKey,
  resolveConfigCascade,
  resolveGridColumns,
  resolveRadiusKey,
} from "@asheeui/core";

/**
 * Core's types: the vocabulary both platforms name.
 */

export type {
  AccordionItem,
  AccordionSizeKey,
  AccordionVariant,
  AsheeColorRegistry,
  AuthLayoutAlign,
  AuthLayoutMediaPosition,
  BreakpointName,
  BreakpointState,
  CardImageLoading,
  CardImagePosition,
  CardVariant,
  CarouselItem,
  CarouselVariant,
  CenteredAxis,
  Color,
  ColorVariant,
  ColumnDef,
  ContainerSize,
  CtaPanel,
  DrawerConfigOptions,
  DrawerPlacement,
  DrawerSize,
  ErrorStateRole,
  ExternalConfig,
  FeatureItem,
  FooterGroup,
  FooterLinkItem,
  FooterVariant,
  GridAlign,
  GridColumns,
  HeroAlign,
  HeroMediaPosition,
  ImageFit,
  ImageRatioKey,
  LinkSubstitution,
  LinkUnderline,
  LinkVariant,
  MarketingLayoutBackground,
  MarqueeAxis,
  MarqueeDirection,
  MarqueeSpeedPreset,
  ModalPosition,
  ModalSizeKey,
  NavbarAlign,
  NavbarLink,
  NavbarLinkItem,
  NavbarPosition,
  NavbarVariant,
  PricingCardVariant,
  PricingFeatureItem,
  Radius,
  SidebarItem,
  SidebarItems,
  SidebarLayoutSide,
  SidebarLayoutWidth,
  SidebarLinkSubstitution,
  SidebarSection,
  SidebarSizeKey,
  SidebarVariant,
  Size,
  Space,
  SplitAlign,
  SplitRatio,
  SplitStackAt,
  StackAlign,
  StackDirection,
  StackJustify,
  Substitution,
  TabItem,
  TableVariant,
  TabsVariant,
  TestimonialItem,
  ThemeName,
  ThemeSelection,
  ToastItemData,
  ToastPlacement,
  ToastShowOptions,
  ToastType,
  TooltipPlacement,
  TooltipSizeKey,
  Variant,
} from "@asheeui/core";

/**
 * The renderer's types: the shapes its own components state.
 */

export type {
  AsheeUIProviderProps,
  ClipboardState,
  FeatureGridLink,
  FooterLink,
  PaginationLink,
  RadioGroup,
  SidebarCollapse,
  StepperStep,
  ToastContextType,
} from "@asheeui/web";

/**
 * Platform-specific section.
 *
 * These are the only hand-written lines in the file. `AsheeConfig` is the
 * configuration type of the renderer this branch resolves to; both branches spell it
 * the same so one configuration file can be typed on either platform, and the two
 * describe the same axes with the options the platform actually has.
 */

export type AsheeConfig = ExternalConfig;

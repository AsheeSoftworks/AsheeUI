/**
 * Every class string the Sidebar renders, for both renderers, kept side by side so a change to the
 * component's shape lands on both platforms at once. Every entry is a complete, static class
 * string, because both Tailwind and NativeWind compile the classes they can read in the source.
 */

import type { TypographyRole } from "../../shared/typography";
import type { Color, Variant } from "../../shared/variant";
import type { SidebarSizeKey, SidebarVariant } from "./sidebar-config";

// ─── Web ──────────────────────────────────────────────────────────────────────

/**
 * CSS classes for sidebar width when expanded.
 * Maps size keys to Tailwind width classes.
 */
export const SIDEBAR_EXPANDED_WIDTH_CLASS: Record<SidebarSizeKey, string> = {
  sm: "w-56",
  md: "w-64",
  lg: "w-72",
};

/**
 * CSS classes for sidebar width when collapsed.
 * Maps size keys to Tailwind width classes.
 */
export const SIDEBAR_COLLAPSED_WIDTH_CLASS: Record<SidebarSizeKey, string> = {
  sm: "w-16",
  md: "w-18",
  lg: "w-20",
};

/**
 * CSS classes for sidebar header height and padding.
 * Maps size keys to Tailwind height and padding classes.
 */
export const SIDEBAR_HEADER_CLASS: Record<SidebarSizeKey, string> = {
  sm: "h-12 text-xs px-2.5",
  md: "h-14 text-sm px-3",
  lg: "h-16 text-base px-4",
};

/**
 * CSS classes for section label typography and spacing.
 * Maps size keys to Tailwind text size and padding classes.
 */
export const SIDEBAR_SECTION_LABEL_CLASS: Record<SidebarSizeKey, string> = {
  sm: "text-[10px] px-2 py-1.5",
  md: "text-xs px-3 py-2",
  lg: "text-sm px-4 py-2.5",
};

/**
 * CSS classes for individual navigation items.
 * Maps size keys to Tailwind height, text size, and padding classes.
 */
export const SIDEBAR_ITEM_CLASS: Record<SidebarSizeKey, string> = {
  sm: "h-9 text-xs px-2",
  md: "h-11 text-sm px-3",
  lg: "h-13 text-base px-4",
};

/**
 * CSS classes for sidebar variants.
 * Each variant has a distinct border, background, and shadow treatment.
 */
export const SIDEBAR_VARIANT_CLASS: Record<SidebarVariant, string> = {
  default: "border-r border-border bg-background/80 backdrop-blur-xs",
  bordered: "border-r-2 border-border bg-background/80 backdrop-blur-xs",
  floating:
    "m-2 rounded-xl border border-border shadow-md bg-background/80 backdrop-blur-xs",
  ghost: "border-none bg-background/80 backdrop-blur-xs",
};

// ─── Native ───────────────────────────────────────────────────────────────────

/**
 * The native sidebar.
 *
 * The web states the direction its rows are laid out in as a block column, which a browser already
 * does; the platform states the direction it means rather than relying on a default.
 */
export const NATIVE_SIDEBAR_BASE_CLASS = "flex flex-col";

/**
 * The surface each native variant is drawn as.
 *
 * The web's treatments are the same ones here: a border on the edge a sidebar sits against, the
 * thicker border of `bordered`, the floating panel of `floating` and the plain background of
 * `ghost`. What is left out is the translucency: the platform has no backdrop filter, so the
 * sidebar paints the theme's own background solidly rather than claiming a blur it cannot show.
 */
export const NATIVE_SIDEBAR_VARIANT_CLASS: Record<SidebarVariant, string> = {
  default: "border-r border-border bg-background",
  bordered: "border-r-2 border-border bg-background",
  floating: "m-2 rounded-xl border border-border bg-background",
  ghost: "bg-background",
};

/** The native sidebar's expanded width at each size. */
export const NATIVE_SIDEBAR_EXPANDED_WIDTH_CLASS: Record<
  SidebarSizeKey,
  string
> = {
  sm: "w-56",
  md: "w-64",
  lg: "w-72",
};

/**
 * The native sidebar's collapsed width at each size.
 * A collapsed sidebar keeps room for an icon and for the control that expands it, which is the
 * same promise the web makes.
 */
export const NATIVE_SIDEBAR_COLLAPSED_WIDTH_CLASS: Record<
  SidebarSizeKey,
  string
> = {
  sm: "w-16",
  md: "w-18",
  lg: "w-20",
};

/** The row the native sidebar's header is laid out in. */
export const NATIVE_SIDEBAR_HEADER_BASE_CLASS =
  "flex flex-row items-center gap-3 border-b border-dashed border-border shrink-0";

/**
 * The native header's height and padding at each size.
 * The web states a text size alongside them, because its text inherits the row's; the platform
 * states the type on each `Text`, which is why the role map below exists.
 */
export const NATIVE_SIDEBAR_HEADER_CLASS: Record<SidebarSizeKey, string> = {
  sm: "h-12 px-2.5",
  md: "h-14 px-3",
  lg: "h-16 px-4",
};

/** The typography role of the native header's title at each size. */
export const NATIVE_SIDEBAR_TITLE_ROLE: Record<SidebarSizeKey, TypographyRole> =
  {
    sm: "label",
    md: "body-md",
    lg: "body-lg",
  };

/** The native sidebar's scrolling body. */
export const NATIVE_SIDEBAR_BODY_CLASS = "flex-1 flex-col gap-3 px-2 py-3";

/** One native section: its label and its items. */
export const NATIVE_SIDEBAR_SECTION_CLASS = "flex w-full flex-col gap-0.5";

/**
 * The native section label's spacing at each size.
 * The web states the type size here as well; the platform states it on the `Text` it renders.
 */
export const NATIVE_SIDEBAR_SECTION_LABEL_CLASS: Record<
  SidebarSizeKey,
  string
> = {
  sm: "px-2 py-1.5",
  md: "px-3 py-2",
  lg: "px-4 py-2.5",
};

/**
 * The typography role of the native section label.
 * The web states the quiet, wide-tracked treatment with classes; the platform states it as a role,
 * so its own text scale decides what the treatment looks like.
 */
export const NATIVE_SIDEBAR_SECTION_LABEL_ROLE = "overline" as const;

/** Shared classes for every native navigation row. */
export const NATIVE_SIDEBAR_ITEM_BASE_CLASS =
  "flex w-full flex-row items-center gap-3";

/**
 * The native row's height and padding at each size.
 * The platform states the type on the row's `Text`, so a size stays a size rather than a height
 * and a font size at once.
 */
export const NATIVE_SIDEBAR_ITEM_CLASS: Record<SidebarSizeKey, string> = {
  sm: "h-9 px-2",
  md: "h-11 px-3",
  lg: "h-13 px-4",
};

/** The typography role of a native row's label at each size. */
export const NATIVE_SIDEBAR_ITEM_ROLE: Record<SidebarSizeKey, TypographyRole> =
  {
    sm: "body-sm",
    md: "body-md",
    lg: "body-lg",
  };

/** The row's icon, which keeps its size while the label truncates. */
export const NATIVE_SIDEBAR_ITEM_ICON_CLASS = "shrink-0";

/** The label of a native row, which takes the room the icon and the badge leave. */
export const NATIVE_SIDEBAR_ITEM_LABEL_CLASS = "flex-1";

/** The badge of a native row. */
export const NATIVE_SIDEBAR_ITEM_BADGE_CLASS = "shrink-0";

/**
 * The surface a native navigation row is drawn with, for each variant and colour.
 *
 * The variant and the colour resolve together, because a row's emphasis comes from the pair: a
 * solid row carries its colour in its background while a ghost or bordered one leaves the surface
 * alone. It mirrors what the shared variant map draws on the web, in the platform's vocabulary —
 * what the web shows while a pointer rests on a row, a touch screen shows while the row is being
 * pressed, and the transition a browser animates is not declared here at all, because a class
 * cannot promise movement the platform does not have.
 */
export const NATIVE_SIDEBAR_ITEM_VARIANT_CLASS: Record<
  Variant,
  Record<Color, string>
> = {
  solid: {
    none: "bg-background",
    primary: "bg-primary",
    secondary: "bg-secondary",
    danger: "bg-danger",
    warning: "bg-warning",
    success: "bg-success",
  },
  faded: {
    none: "bg-secondary/40",
    primary: "bg-primary/10 border border-primary/20",
    secondary: "bg-secondary/15 border border-secondary/30",
    danger: "bg-danger/10 border border-danger/20",
    warning: "bg-warning/10 border border-warning/20",
    success: "bg-success/10 border border-success/20",
  },
  bordered: {
    none: "bg-transparent border border-background",
    primary: "bg-transparent border border-primary",
    secondary: "bg-transparent border border-border",
    danger: "bg-transparent border border-danger",
    warning: "bg-transparent border border-warning",
    success: "bg-transparent border border-success",
  },
  underlined: {
    none: "bg-transparent border-b border-background",
    primary: "bg-transparent border-b border-primary",
    secondary: "bg-transparent border-b border-border",
    danger: "bg-transparent border-b border-danger",
    warning: "bg-transparent border-b border-warning",
    success: "bg-transparent border-b border-success",
  },
  ghost: {
    none: "bg-transparent active:bg-foreground/20",
    primary: "bg-transparent active:bg-primary/20",
    secondary: "bg-transparent active:bg-secondary/20",
    danger: "bg-transparent active:bg-danger/20",
    warning: "bg-transparent active:bg-warning/20",
    success: "bg-transparent active:bg-success/20",
  },
};

/**
 * The colour a native row's label takes, for each variant and colour.
 *
 * A filled row leaves its label in the framework's foreground whatever the colour is, because the
 * colour is already carrying the surface; the quieter treatments carry it in the label instead.
 * The platform cannot inherit a colour from the row, so the label states the same role the web
 * lets its row pass down.
 */
export const NATIVE_SIDEBAR_ITEM_TEXT_CLASS: Record<
  Variant,
  Record<Color, string>
> = {
  solid: {
    none: "text-foreground",
    primary: "text-foreground",
    secondary: "text-foreground",
    danger: "text-foreground",
    warning: "text-foreground",
    success: "text-foreground",
  },
  faded: {
    none: "text-foreground",
    primary: "text-primary",
    secondary: "text-foreground",
    danger: "text-danger",
    warning: "text-warning",
    success: "text-success",
  },
  bordered: {
    none: "text-primary",
    primary: "text-primary",
    secondary: "text-foreground",
    danger: "text-danger",
    warning: "text-warning",
    success: "text-success",
  },
  underlined: {
    none: "text-primary",
    primary: "text-primary",
    secondary: "text-foreground",
    danger: "text-danger",
    warning: "text-warning",
    success: "text-success",
  },
  ghost: {
    none: "text-foreground",
    primary: "text-primary",
    secondary: "text-foreground",
    danger: "text-danger",
    warning: "text-warning",
    success: "text-success",
  },
};

/**
 * A native row that is drawn but cannot be used.
 *
 * The web greys the row and takes its pointer events away, because a browser has a pointer to take
 * them from. The platform has no pointer, so the row states that it is disabled and the platform
 * stops delivering presses to it, and the dimmed treatment is what is left to say.
 */
export const NATIVE_SIDEBAR_ITEM_DISABLED_CLASS = "opacity-50";

/** The native row that leads to the page being shown. */
export const NATIVE_SIDEBAR_ITEM_ACTIVE_CLASS = "font-medium";

/** The native footer, which holds the optional slot and the collapse control. */
export const NATIVE_SIDEBAR_FOOTER_CLASS =
  "flex w-full flex-col gap-2 border-t border-border shrink-0";

/** The native footer's padding at each size. */
export const NATIVE_SIDEBAR_FOOTER_PADDING_CLASS: Record<
  SidebarSizeKey,
  string
> = {
  sm: "p-2",
  md: "p-3",
  lg: "p-3",
};

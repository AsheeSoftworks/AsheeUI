/**
 * Navbar component for AsheeUI.
 *
 * This file provides the `Navbar` pattern: a banner region with a brand, a set
 * of navigation links, an action region, an optional second row and a mobile
 * disclosure. It exposes composition points rather than an application's
 * navigation structure, and every link renders through the framework's `Link`
 * primitive so a consumer keeps its router.
 */

"use client";

import {
  type ElementType,
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useId,
  useRef,
  useState,
} from "react";
import { ChevronDownIcon } from "../../icons/ChevronDownIcon";
import { ChevronUpIcon } from "../../icons/ChevronUpIcon";
import { useAsheeConfig } from "../../libs/context";
import { cn } from "../../utils";
import { resolveConfigCascade } from "../../utils/resolve-token";
import { Button } from "../button/Button";
import { Container } from "../container/Container";
import { Link } from "../link";
import { FALLBACK_NAVBAR_CONFIG, type NavbarConfig } from "./navbar-config";
import {
  NAVBAR_ACTIONS_CLASS,
  NAVBAR_BRAND_CLASS,
  NAVBAR_INNER_CLASS,
  NAVBAR_LINK_ACTIVE_CLASS,
  NAVBAR_LINK_CLASS,
  NAVBAR_LINKS_CENTER_CLASS,
  NAVBAR_LINKS_CLASS,
  NAVBAR_LINKS_END_CLASS,
  NAVBAR_MOBILE_PANEL_CLASS,
  NAVBAR_POSITION_CLASS,
  NAVBAR_SECONDARY_CLASS,
  NAVBAR_TOGGLE_CLASS,
  NAVBAR_VARIANT_CLASS,
} from "./navbar-styles";

/**
 * One destination in the bar.
 */
export interface NavbarLinkItem {
  /** Stable identifier for the link. Defaults to its position in the list. */
  id?: string | number;

  /** Visible name of the link. */
  label: ReactNode;

  /** Destination of the link. */
  href?: string;

  /**
   * Whether this link leads to the page currently shown.
   * An active link is marked `aria-current="page"`, which is what tells
   * assistive technology where the reader is, and is styled with emphasis as
   * well.
   */
  isActive?: boolean;

  /** Content before the label, typically an icon. */
  icon?: ReactNode;

  /** Component that replaces the anchor for this link only. */
  component?: ElementType;

  /** Additional props for that component. */
  componentProps?: Record<string, unknown>;
}

/**
 * Substitution applied to every link in the bar.
 */
export interface NavbarLink {
  /** Component that replaces the anchor, such as a framework router link. */
  component?: ElementType;

  /** Additional props for that component. */
  props?: Record<string, unknown>;
}

type BaseNavbarProps = NavbarConfig &
  Omit<HTMLAttributes<HTMLElement>, "color" | "title">;

/**
 * Props for the Navbar component.
 */
export interface NavbarProps extends BaseNavbarProps {
  /** Brand content, typically a logo and a product name. */
  brand?: ReactNode;

  /** Destination of the brand. */
  brandHref?: string;

  /** The navigation links. */
  links?: NavbarLinkItem[];

  /** Actions shown at the trailing edge, typically a sign-in and a signup. */
  actions?: ReactNode;

  /** Substitution applied to every link the bar renders. */
  link?: NavbarLink;

  /**
   * Name of the navigation landmark.
   * Distinguishes this region from any other navigation on the page.
   *
   * @default "Main"
   */
  label?: string;

  /**
   * Accessible name of the control that opens the mobile panel.
   *
   * @default "Menu"
   */
  mobileLabel?: string;

  /** Optional second row under the bar, for a search field or a toolbar. */
  secondary?: ReactNode;

  /**
   * Whether the mobile panel is open, for a consumer that owns the state.
   * Leave it unset to let the bar manage its own panel.
   */
  mobileOpen?: boolean;

  /**
   * Called when the mobile panel should open or close.
   * A router-integration consumer uses it to close the panel after a
   * navigation.
   */
  onMobileOpenChange?: (open: boolean) => void;

  /**
   * Element to render the bar as.
   * Defaults to `header`, which is the banner landmark.
   *
   * @default "header"
   */
  as?: ElementType;
}

/**
 * A navigation bar with a brand, links and actions.
 *
 * The bar is a banner landmark that contains a named navigation landmark, so a
 * reader can jump to the navigation rather than wading through it. On a narrow
 * screen the links move into a disclosure that the reader opens with a labelled
 * control: the control reports its state with `aria-expanded` and points at the
 * panel with `aria-controls`, and Escape closes the panel and returns focus to
 * the control.
 *
 * @param props - Navbar configuration options and element attributes.
 * @param props.brand - Brand content.
 * @param props.brandHref - Destination of the brand.
 * @param props.links - The navigation links.
 * @param props.actions - Actions at the trailing edge.
 * @param props.secondary - An optional second row.
 * @param props.link - Substitution for every link.
 * @param props.label - Navigation landmark name. Defaults to "Main".
 * @param props.mobileLabel - Accessible name of the mobile control. Defaults
 * to "Menu".
 * @param props.mobileOpen - Controlled panel state.
 * @param props.onMobileOpenChange - Panel state change callback.
 * @param props.position - Sticky or static. Defaults to "sticky".
 * @param props.variant - Surface treatment. Defaults to "solid".
 * @param props.align - Where the links sit. Defaults to "start".
 * @param props.as - Element to render. Defaults to "header".
 * @returns The rendered bar.
 *
 * @example
 * ```tsx
 * <Navbar
 *   brand="Ashee SMS"
 *   brandHref="/"
 *   align="center"
 *   links={[
 *     { label: "Campaigns", href: "/campaigns", isActive: true },
 *     { label: "Contacts", href: "/contacts" },
 *   ]}
 *   actions={<Button size="sm" href="/signin" variant="ghost">Sign in</Button>}
 *   link={{ component: RouterLink, props: { prefetch: true } }}
 * />
 * ```
 *
 * @see Footer - The matching end-of-page navigation.
 */

/**
 * Renders the link list of the bar.
 *
 * Both presentations of the links (the desktop row and the mobile panel) share
 * this renderer, so an item's active state, icon and router substitution can
 * never differ between them.
 *
 * @param props - The links, the substitution, and the list's own class.
 * @returns The rendered list.
 */
function NavbarLinkList({
  id,
  links,
  link,
  className,
  onNavigate,
}: {
  id?: string;
  links: NavbarLinkItem[];
  link?: NavbarLink;
  className: string;
  onNavigate?: () => void;
}) {
  return (
    <ul id={id} className={className}>
      {links.map((item, index) => (
        <li key={item.id ?? index}>
          <Link
            href={item.href}
            startIcon={item.icon}
            component={item.component ?? link?.component}
            componentProps={{ ...link?.props, ...item.componentProps }}
            aria-current={item.isActive ? "page" : undefined}
            onClick={onNavigate}
            className={cn(
              NAVBAR_LINK_CLASS,
              item.isActive && NAVBAR_LINK_ACTIVE_CLASS,
            )}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  (
    {
      brand,
      brandHref,
      links,
      actions,
      link,
      label = "Main",
      mobileLabel = "Menu",
      secondary,
      mobileOpen,
      onMobileOpenChange,
      position,
      variant,
      align,
      contained,
      containerSize,
      as,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();

    const resolved = resolveConfigCascade<NavbarConfig, Required<NavbarConfig>>(
      { position, variant, align, contained, containerSize },
      config.components?.navbar,
      FALLBACK_NAVBAR_CONFIG,
    );

    const panelId = useId();
    const toggleRef = useRef<HTMLButtonElement>(null);
    const [internalOpen, setInternalOpen] = useState(false);

    const isControlled = mobileOpen !== undefined;
    const open = isControlled ? mobileOpen : internalOpen;

    const setOpen = useCallback(
      (next: boolean) => {
        if (!isControlled) {
          setInternalOpen(next);
        }
        onMobileOpenChange?.(next);
      },
      [isControlled, onMobileOpenChange],
    );

    const handlePanelKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };

    const linksClass =
      resolved.align === "center"
        ? NAVBAR_LINKS_CENTER_CLASS
        : resolved.align === "end"
          ? NAVBAR_LINKS_END_CLASS
          : NAVBAR_LINKS_CLASS;

    const Component: ElementType = as ?? "header";

    const inner = (
      <div className={NAVBAR_INNER_CLASS}>
        {brand && (
          <div className={NAVBAR_BRAND_CLASS}>
            {brandHref ? (
              <Link
                href={brandHref}
                component={link?.component}
                componentProps={link?.props}
                className={NAVBAR_BRAND_CLASS}>
                {brand}
              </Link>
            ) : (
              brand
            )}
          </div>
        )}

        {links && links.length > 0 && (
          <nav aria-label={label} className={cn("min-w-0", linksClass)}>
            <NavbarLinkList links={links} link={link} className="flex" />
          </nav>
        )}

        {links && links.length > 0 && (
          <Button
            ref={toggleRef}
            type="button"
            variant="ghost"
            size="sm"
            icon
            className={NAVBAR_TOGGLE_CLASS}
            aria-label={mobileLabel}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen(!open)}>
            {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Button>
        )}

        {actions && <div className={NAVBAR_ACTIONS_CLASS}>{actions}</div>}
      </div>
    );

    const panel = open && links && links.length > 0 && (
      <nav aria-label={label}>
        <NavbarLinkList
          id={panelId}
          links={links}
          link={link}
          className={NAVBAR_MOBILE_PANEL_CLASS}
          onNavigate={() => setOpen(false)}
        />
      </nav>
    );

    const body = (
      <>
        {inner}
        {panel}
        {secondary && <div className={NAVBAR_SECONDARY_CLASS}>{secondary}</div>}
        {children}
      </>
    );

    return (
      <Component
        ref={ref}
        className={cn(
          NAVBAR_VARIANT_CLASS[resolved.variant],
          resolved.position === "sticky" && NAVBAR_POSITION_CLASS,
          className,
        )}
        onKeyDown={handlePanelKeyDown}
        {...rest}>
        {resolved.contained ? (
          <Container size={resolved.containerSize}>{body}</Container>
        ) : (
          body
        )}
      </Component>
    );
  },
);

Navbar.displayName = "Navbar";

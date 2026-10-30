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
  type NavbarLink,
  type NavbarLinkItem,
  resolveConfigCascade,
} from "@asheeui/core";
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
import { ChevronDownIcon } from "../../../icons/ChevronDownIcon";
import { ChevronUpIcon } from "../../../icons/ChevronUpIcon";
import { useAsheeConfig } from "../../../libs/context";
import {
  NAVBAR_ACTIONS_CLASS,
  NAVBAR_BRAND_CLASS,
  NAVBAR_INNER_CLASS,
  NAVBAR_LINK_ACTIVE_CLASS,
  NAVBAR_LINK_CLASS,
  NAVBAR_LINK_LIST_CLASS,
  NAVBAR_LINKS_CENTER_CLASS,
  NAVBAR_LINKS_CLASS,
  NAVBAR_LINKS_END_CLASS,
  NAVBAR_MOBILE_PANEL_CLASS,
  NAVBAR_POSITION_CLASS,
  NAVBAR_SECONDARY_CLASS,
  NAVBAR_TOGGLE_CLASS,
  NAVBAR_VARIANT_CLASS,
} from "../../../styles/navbar";
import { NAVBAR_BRAND_TEXT_CLASS } from "../../../styles/portable";
import { cn } from "../../../utils/cn";
import { Button } from "../../forms/button/Button";
import { Container } from "../../layouts/container/Container";
import { Link } from "../link";
import { FALLBACK_NAVBAR_CONFIG, type NavbarConfig } from "./navbar-config";

/**
 * The destinations of the bar, and the substitution applied to them.
 *
 * The types live in `@asheeui/core`, because they describe the framework's navbar rather than a
 * renderer's: the native bar reads one description of a destination and the web bar reads the same
 * one, so `disabled`, `isActive` and the substitution mean the same thing on both.
 */
export type { NavbarLink, NavbarLinkItem } from "@asheeui/core";

type BaseNavbarProps = NavbarConfig &
  Omit<HTMLAttributes<HTMLElement>, "color">;

/**
 * Props for the Navbar component.
 */
export interface NavbarProps extends BaseNavbarProps {
  /** Brand content, typically a logo and a product name. */
  brand?: ReactNode | undefined;

  /** Destination of the brand. */
  brandHref?: string | undefined;

  /** The navigation links. */
  links?: NavbarLinkItem[] | undefined;

  /** Actions shown at the trailing edge, typically a sign-in and a signup. */
  actions?: ReactNode | undefined;

  /** Substitution applied to every link the bar renders. */
  link?: NavbarLink | undefined;

  /**
   * Name of the navigation landmark.
   * Distinguishes this region from any other navigation on the page.
   *
   * @default "Main"
   */
  label?: string | undefined;

  /**
   * Accessible name of the control that opens the mobile panel.
   *
   * @default "Menu"
   */
  mobileLabel?: string | undefined;

  /** Optional second row under the bar, for a search field or a toolbar. */
  secondary?: ReactNode | undefined;

  /**
   * Whether the mobile panel is open, for a consumer that owns the state.
   * Leave it unset to let the bar manage its own panel.
   */
  mobileOpen?: boolean | undefined;

  /**
   * Called when the mobile panel should open or close.
   * A router-integration consumer uses it to close the panel after a
   * navigation.
   */
  onMobileOpenChange?: ((open: boolean) => void) | undefined;

  /**
   * Element to render the bar as.
   * Defaults to `header`, which is the banner landmark.
   *
   * @default "header"
   */
  as?: ElementType | undefined;
}

/**
 * A navigation bar with a brand, links and actions.
 *
 * The bar is a banner landmark that contains a named navigation landmark, so a
 * reader can jump to the navigation rather than wading through it. On a narrow
 * screen the links move into a disclosure that the reader opens with a labelled
 * control: the control reports its state with `aria-expanded`, points at the
 * panel with `aria-controls` while the panel it names exists, and Escape closes
 * the open panel and returns focus to the control. Escape elsewhere in the bar —
 * in a search field in the second row, say — is left to whatever owns it.
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
  id?: string | undefined;
  links: NavbarLinkItem[];
  link?: NavbarLink | undefined;
  className: string;
  onNavigate?: (() => void) | undefined;
}) {
  return (
    <ul id={id} className={className}>
      {links.map((item, index) => (
        <li key={item.id ?? index}>
          <Link
            href={item.href}
            disabled={item.disabled}
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
    const panelRef = useRef<HTMLElement>(null);
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

    // Escape belongs to the disclosure rather than to the whole bar. A bar that acts on
    // every Escape inside it takes the key away from whatever the reader is doing — a
    // search field in the second row, for instance — and moves focus out of it even when
    // there is no panel open at all. Only an open panel, reached from inside it or from
    // the control that owns it, closes and restores focus.
    const handleBarKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      if (event.key !== "Escape" || !open) return;

      const target = event.target;
      if (!(target instanceof Node)) return;

      const inPanel = panelRef.current?.contains(target) ?? false;
      const onToggle = toggleRef.current?.contains(target) ?? false;
      if (!inPanel && !onToggle) return;

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
                className={NAVBAR_BRAND_TEXT_CLASS}>
                {brand}
              </Link>
            ) : (
              brand
            )}
          </div>
        )}

        {links && links.length > 0 && (
          <nav aria-label={label} className={linksClass}>
            <NavbarLinkList
              links={links}
              link={link}
              className={NAVBAR_LINK_LIST_CLASS}
            />
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
            // `aria-controls` may only name an element that exists: the panel is only
            // rendered while it is open, so the attribute appears with it and goes away
            // with it, rather than pointing at an id nothing carries.
            aria-controls={open ? panelId : undefined}
            onClick={() => setOpen(!open)}>
            {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Button>
        )}

        {actions && <div className={NAVBAR_ACTIONS_CLASS}>{actions}</div>}
      </div>
    );

    const panel = open && links && links.length > 0 && (
      <nav ref={panelRef} aria-label={label}>
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
        onKeyDown={handleBarKeyDown}
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

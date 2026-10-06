/**
 * Navbar component for the native package.
 *
 * The component satisfies the framework's navbar contract: a bar with a brand, a set of destinations
 * and an action region, with an optional second row, with every destination rendering through the
 * framework's own `Link` so a consumer keeps its routing, and with the bar's surface, its alignment
 * and its width resolving through the configuration cascade.
 *
 * What the platform states differently is what it has for a row of destinations. The web hides its
 * row below `md` and opens a disclosure instead, because a browser's bar is a single line it cannot
 * scroll sideways; a platform's bar scrolls its row and keeps every destination in reach, so the
 * disclosure's three options — `mobileOpen`, `onMobileOpenChange` and `mobileLabel` — resolve
 * through the shared contract and change nothing here. And where the web marks the current
 * destination with `aria-current`, which is a document's way of saying where the reader is, the
 * platform states the same fact as the control's selected state, and both add an emphasis for the
 * eye.
 *
 * The module also offers the platform's own second half of a navigation: `TabBar`. The web needs no
 * such component, because its links are already in the bar; a screen's destinations belong at the
 * edge a thumb reaches, so the same destinations and the same states are offered as a bar the screen
 * places itself.
 */

import {
  NATIVE_NAVBAR_ACTIONS_CLASS,
  NATIVE_NAVBAR_ALIGN_CLASS,
  NATIVE_NAVBAR_BASE_CLASS,
  NATIVE_NAVBAR_BRAND_CLASS,
  NATIVE_NAVBAR_INNER_CLASS,
  NATIVE_NAVBAR_LINK_ACTIVE_CLASS,
  NATIVE_NAVBAR_LINK_CLASS,
  NATIVE_NAVBAR_LINKS_CLASS,
  NATIVE_NAVBAR_LINKS_ROW_CLASS,
  NATIVE_NAVBAR_POSITION_CLASS,
  NATIVE_NAVBAR_SECONDARY_CLASS,
  NATIVE_NAVBAR_VARIANT_CLASS,
  NATIVE_TAB_BAR_CLASS,
  NATIVE_TAB_BAR_ITEM_ACTIVE_CLASS,
  NATIVE_TAB_BAR_ITEM_CLASS,
  type NavbarAlign,
  type NavbarLink,
  type NavbarLinkItem,
  resolveConfigCascade,
} from "@asheeui/core";
import type { ReactNode } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { ScrollView, View } from "react-native";
import { Container } from "../../layout/Container";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { Link } from "../link";
import { Text } from "../text/Text";
import {
  FALLBACK_NATIVE_NAVBAR_CONFIG,
  type NativeNavbarConfig,
} from "./navbar-config";

/**
 * Props for the native Navbar.
 */
export interface NavbarProps
  extends NativeNavbarConfig,
    Omit<ViewProps, "children" | "style"> {
  /** Brand content, typically a logo and a product name. */
  brand?: ReactNode;

  /** Destination of the brand. */
  brandHref?: string;

  /** The destinations of the bar. */
  links?: NavbarLinkItem[];

  /** Actions at the trailing edge, typically a sign-in and a sign-up. */
  actions?: ReactNode;

  /** Substitution applied to every destination the bar renders. */
  link?: NavbarLink;

  /**
   * Name of the row of destinations.
   * The web gives it to a navigation landmark; the platform states it as the name of the tab list it
   * draws, which is the role it has for a row of destinations.
   *
   * @default "Main"
   */
  label?: string;

  /**
   * Name of the web's disclosure control.
   * The platform keeps every destination in the row, so there is no control to name here.
   *
   * @default "Menu"
   */
  mobileLabel?: string;

  /** Optional second row under the bar, for a search field or a toolbar. */
  secondary?: ReactNode;

  /**
   * Content below the bar's own rows.
   * The web passes it into the banner as it is; the platform does the same.
   */
  children?: ReactNode;

  /**
   * Whether the web's disclosure is open.
   * A consumer that owns the state on the web passes it here too, because one configuration
   * describes both platforms; the platform has no disclosure, so it changes nothing.
   */
  mobileOpen?: boolean;

  /**
   * Called when the web's disclosure should open or close.
   * The platform has no disclosure, so nothing calls it.
   */
  onMobileOpenChange?: (open: boolean) => void;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * One row of destinations, as the platform states them.
 *
 * The bar in the header and the bar at the edge render the same destinations, so both go through one
 * renderer and an item's active state, icon and substitution can never differ between them.
 *
 * @param props - The destinations, the substitution, where they sit and the row's own class.
 * @returns The rendered destinations.
 */
function Destinations({
  items,
  link,
  align,
  label,
  className,
  itemClassName,
  activeClassName,
}: {
  items: NavbarLinkItem[];
  link?: NavbarLink;
  align?: NavbarAlign;
  label?: string;
  className?: string;
  itemClassName: string;
  activeClassName: string;
}) {
  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={label}
      className={classNames(
        NATIVE_NAVBAR_LINKS_ROW_CLASS,
        align && NATIVE_NAVBAR_ALIGN_CLASS[align],
        className,
      )}>
      {items.map((item, index) => (
        <Link
          key={item.id ?? index}
          href={item.href}
          disabled={item.disabled}
          // The web's `aria-current` and the platform's selected state say the same thing.
          accessibilityRole="tab"
          accessibilityState={{
            selected: Boolean(item.isActive),
            disabled: item.disabled,
          }}
          startIcon={item.icon}
          variant={item.isActive ? "default" : "muted"}
          underline="never"
          size="sm"
          component={item.component ?? link?.component}
          componentProps={{ ...link?.props, ...item.componentProps }}
          className={classNames(
            itemClassName,
            item.isActive && activeClassName,
          )}>
          {item.label}
        </Link>
      ))}
    </View>
  );
}

/**
 * The bar at the top of a screen.
 *
 * The bar paints its surface, keeps its destinations in reach and resolves its options through the
 * standard configuration cascade, so `components.navbar` states an application's bar once. It adds
 * no width of its own when it is contained, because the framework's `Container` decides that, and
 * it carries whoever the consumer puts in it rather than owning an application's navigation state.
 *
 * @param props - The bar's options and the platform's view props.
 * @param props.brand - Brand content.
 * @param props.brandHref - Destination of the brand.
 * @param props.links - The destinations.
 * @param props.actions - Actions at the trailing edge.
 * @param props.secondary - An optional second row.
 * @param props.link - Substitution for every destination.
 * @param props.label - Name of the row of destinations. Defaults to "Main".
 * @param props.mobileLabel - Name of the web's disclosure. Defaults to "Menu"; the platform has no
 * disclosure to name.
 * @param props.mobileOpen - The web's disclosure state. Changes nothing here.
 * @param props.onMobileOpenChange - The web's disclosure callback. Never called here.
 * @param props.position - Sticky or static. Defaults to "sticky"; a native bar is pinned by being
 * placed outside the region that scrolls.
 * @param props.variant - Surface treatment. Defaults to "solid".
 * @param props.align - Where the destinations sit. Defaults to "start".
 * @param props.contained - Wrap the bar in a Container. Defaults to true.
 * @param props.containerSize - Container width when contained. Defaults to "lg".
 * @param props.className - Extra classes applied last.
 * @returns The rendered bar.
 *
 * @example
 * ```tsx
 * <Navbar
 *   brand={<Text role="label">Ashee SMS</Text>}
 *   links={[
 *     { label: "Campaigns", href: "/campaigns", isActive: true },
 *     { label: "Contacts", href: "/contacts" },
 *   ]}
 *   actions={<Button size="sm">Sign in</Button>}
 * />
 * ```
 *
 * @see TabBar - The destinations as a bar at the bottom edge.
 * @see Footer - The matching end-of-screen navigation.
 */
export function Navbar({
  brand,
  brandHref,
  links,
  actions,
  link,
  label = "Main",
  mobileLabel,
  secondary,
  mobileOpen,
  onMobileOpenChange,
  position,
  variant,
  align,
  contained,
  containerSize,
  className,
  style,
  children,
  ...rest
}: NavbarProps) {
  const config = useAsheeNativeConfig();

  const resolved = resolveConfigCascade<
    NativeNavbarConfig,
    Required<NativeNavbarConfig>
  >(
    { position, variant, align, contained, containerSize },
    config.components.navbar,
    FALLBACK_NATIVE_NAVBAR_CONFIG,
  );

  // Named so the two disclosure options are visibly read rather than forgotten: they describe the
  // web's control, and the platform has no such control, so they end here.
  void mobileLabel;
  void mobileOpen;
  void onMobileOpenChange;

  const hasLinks = Boolean(links && links.length > 0);

  const body = (
    <>
      <View className={NATIVE_NAVBAR_INNER_CLASS}>
        {brand && (
          <View className={NATIVE_NAVBAR_BRAND_CLASS}>
            {brandHref ? (
              <Link
                href={brandHref}
                underline="never"
                component={link?.component}
                componentProps={link?.props}
                className={NATIVE_NAVBAR_BRAND_CLASS}>
                {brand}
              </Link>
            ) : typeof brand === "string" ? (
              // The platform renders text through its own element; the web's brand is an element
              // already, so the difference is stated rather than left to the renderer to guess.
              <Text role="label">{brand}</Text>
            ) : (
              brand
            )}
          </View>
        )}

        {hasLinks && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className={NATIVE_NAVBAR_LINKS_CLASS}>
            <Destinations
              items={links as NavbarLinkItem[]}
              link={link}
              align={resolved.align}
              label={label}
              itemClassName={NATIVE_NAVBAR_LINK_CLASS}
              activeClassName={NATIVE_NAVBAR_LINK_ACTIVE_CLASS}
            />
          </ScrollView>
        )}

        {actions && (
          <View className={NATIVE_NAVBAR_ACTIONS_CLASS}>{actions}</View>
        )}
      </View>

      {secondary && (
        <View className={NATIVE_NAVBAR_SECONDARY_CLASS}>{secondary}</View>
      )}

      {children}
    </>
  );

  return (
    <View
      className={classNames(
        NATIVE_NAVBAR_BASE_CLASS,
        NATIVE_NAVBAR_VARIANT_CLASS[resolved.variant],
        resolved.position === "sticky" && NATIVE_NAVBAR_POSITION_CLASS,
        className,
      )}
      style={style}
      {...rest}>
      {resolved.contained ? (
        <Container size={resolved.containerSize}>{body}</Container>
      ) : (
        body
      )}
    </View>
  );
}

/**
 * Props for the native TabBar.
 */
export interface TabBarProps extends Omit<ViewProps, "children" | "style"> {
  /** The destinations of the bar, in the order they are shown. */
  items: NavbarLinkItem[];

  /** Substitution applied to every destination the bar renders. */
  link?: NavbarLink;

  /**
   * Name of the bar.
   *
   * @default "Main"
   */
  label?: string;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * The destinations as a bar at the bottom edge of a screen.
 *
 * The web has no such component: its destinations are in the bar at the top of the page, and a
 * pointer reaches them there. A thumb does not, so the platform's own navigation splits in two — a
 * header with the brand and the actions, and a bar of destinations at the edge a thumb reaches. This
 * is that half, drawing the same destinations with the same states through the same renderer, so a
 * screen offers both without describing its navigation twice.
 *
 * @param props - The destinations and the platform's view props.
 * @param props.items - The destinations, in order.
 * @param props.link - Substitution for every destination.
 * @param props.label - Name of the bar. Defaults to "Main".
 * @param props.className - Extra classes applied last.
 * @returns The rendered bar.
 *
 * @example
 * ```tsx
 * <TabBar
 *   items={[
 *     { label: "Home", icon: homeGlyph, isActive: true },
 *     { label: "Search", icon: searchGlyph },
 *   ]}
 * />
 * ```
 *
 * @see Navbar - The header the bar goes with.
 */
export function TabBar({
  items,
  link,
  label = "Main",
  className,
  style,
  ...rest
}: TabBarProps) {
  return (
    <View
      className={classNames(NATIVE_TAB_BAR_CLASS, className)}
      style={style}
      {...rest}>
      <Destinations
        items={items}
        link={link}
        label={label}
        className="flex-1 justify-around"
        itemClassName={NATIVE_TAB_BAR_ITEM_CLASS}
        activeClassName={NATIVE_TAB_BAR_ITEM_ACTIVE_CLASS}
      />
    </View>
  );
}

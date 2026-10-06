/**
 * Footer component for the native package.
 *
 * The component satisfies the framework's footer contract: a brand column, navigation
 * groups, an optional action area, social links, legal links and a copyright line. It
 * carries no product's own links: a consumer passes its navigation as data, and every
 * link renders through the framework's native `Link`, so a destination is followed the
 * platform's way.
 *
 * What differs from the web is the arrangement. The web turns the upper region into a
 * row at a breakpoint; the platform has one window, so it keeps the brand column above
 * its groups and lets the groups wrap into rows, because a footer that split its brand
 * and its navigation on a phone would leave neither enough room to read.
 *
 * Two fields the shared module marks as the web's alone are not read here: `component`
 * and `componentProps` replace an anchor with a router's link, and the platform has no
 * anchor to replace. There is no `link` prop for the same reason.
 */

import {
  type FooterGroup,
  type FooterLinkItem,
  NATIVE_FOOTER_BOTTOM_CLASS,
  NATIVE_FOOTER_BOTTOM_LINKS_CLASS,
  NATIVE_FOOTER_BRAND_COLUMN_CLASS,
  NATIVE_FOOTER_GROUP_CLASS,
  NATIVE_FOOTER_GROUPS_CLASS,
  NATIVE_FOOTER_LINK_CLASS,
  NATIVE_FOOTER_LIST_CLASS,
  NATIVE_FOOTER_SOCIAL_ROW_CLASS,
  NATIVE_FOOTER_TOP_CLASS,
  NATIVE_FOOTER_VARIANT_CLASS,
  resolveConfigCascade,
} from "@asheeui/core";
import type { ReactNode } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { View } from "react-native";
import { Container } from "../../layout/Container";
import { SECTION_SPACING_CLASS } from "../../layout/layout-styles";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { Link } from "../link";
import { Text } from "../text/Text";
import {
  FALLBACK_NATIVE_FOOTER_CONFIG,
  type NativeFooterConfig,
} from "./footer-config";

/**
 * Props for the native Footer.
 */
export interface FooterProps
  extends NativeFooterConfig,
    Omit<ViewProps, "children" | "style"> {
  /** Brand content, typically a logo and a product name. */
  brand?: ReactNode;

  /** Short description under the brand. */
  description?: ReactNode;

  /** The navigation groups. */
  groups?: FooterGroup[];

  /** Social links, rendered as a row of icon links under the groups. */
  social?: FooterLinkItem[];

  /** Legal links, rendered beside the copyright line. */
  legal?: FooterLinkItem[];

  /** The copyright line, below the navigation. */
  copyright?: ReactNode;

  /**
   * Action area in the brand column, for example a newsletter form.
   * The footer draws no control of its own: what belongs here is the consumer's own.
   */
  newsletter?: ReactNode;

  /** Content below everything else. */
  children?: ReactNode;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * Renders a list of footer links.
 *
 * @param props - The links and the list's own class.
 * @returns The rendered list.
 */
function FooterLinkList({
  links,
  className,
}: {
  links: FooterLinkItem[];
  className: string;
}) {
  return (
    <View className={className}>
      {links.map((item, index) => (
        <Link
          key={item.id ?? index}
          href={item.href}
          startIcon={item.icon}
          isExternal={item.isExternal}
          className={NATIVE_FOOTER_LINK_CLASS}>
          {item.label}
        </Link>
      ))}
    </View>
  );
}

/**
 * The last band of a page or a screen.
 *
 * The footer renders nothing it was not given: a consumer that passes only a copyright
 * line gets a footer of one line. Each group's title is announced as a heading, so a
 * reader can jump straight to the column they want, and the social and legal rows are
 * lists of links rather than loose text.
 *
 * @param props - The footer's options and the platform's view props.
 * @param props.brand - Brand content.
 * @param props.description - Short description under the brand.
 * @param props.groups - The navigation groups.
 * @param props.social - Social links.
 * @param props.legal - Legal links.
 * @param props.copyright - The copyright line.
 * @param props.newsletter - Action area in the brand column.
 * @param props.variant - Surface treatment. Defaults to "bordered".
 * @param props.spacing - Vertical padding. Defaults to "lg".
 * @param props.contained - Respect the framework's width and gutter. Defaults to true.
 * @returns The rendered footer.
 *
 * @example
 * ```tsx
 * <Footer
 *   brand="Ashee SMS"
 *   description="Campaign messaging for growing teams."
 *   groups={[
 *     { title: "Product", links: [{ label: "Campaigns", href: "https://example.com" }] },
 *   ]}
 *   copyright="Ashee Softworks"
 * />
 * ```
 *
 * @see Navbar - The matching start-of-screen navigation.
 */
export function Footer({
  brand,
  description,
  groups,
  social,
  legal,
  copyright,
  newsletter,
  variant,
  spacing,
  contained,
  containerSize,
  className,
  style,
  children,
  ...rest
}: FooterProps) {
  const config = useAsheeNativeConfig();

  const resolved = resolveConfigCascade<
    NativeFooterConfig,
    Required<NativeFooterConfig>
  >(
    { variant, spacing, contained, containerSize },
    config.components.footer,
    FALLBACK_NATIVE_FOOTER_CONFIG,
  );

  const hasBrandColumn = Boolean(brand || description || newsletter);
  const hasBottomRow = Boolean(copyright || legal || social);

  const body = (
    <>
      {(hasBrandColumn || (groups && groups.length > 0)) && (
        <View className={NATIVE_FOOTER_TOP_CLASS}>
          {hasBrandColumn && (
            <View className={NATIVE_FOOTER_BRAND_COLUMN_CLASS}>
              {brand && <Text role="heading-sm">{brand}</Text>}
              {description && (
                <Text role="body-sm" tone="muted">
                  {description}
                </Text>
              )}
              {newsletter}
            </View>
          )}

          {groups && groups.length > 0 && (
            <View className={NATIVE_FOOTER_GROUPS_CLASS}>
              {groups.map((group, index) => (
                <View
                  key={group.id ?? index}
                  className={NATIVE_FOOTER_GROUP_CLASS}>
                  {/* A group's title names the column it heads, so it is announced
                      as a heading a reader can move between. */}
                  <Text role="label" accessibilityRole="header">
                    {group.title}
                  </Text>
                  <FooterLinkList
                    links={group.links}
                    className={NATIVE_FOOTER_LIST_CLASS}
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {hasBottomRow && (
        <View className={NATIVE_FOOTER_BOTTOM_CLASS}>
          {copyright && (
            <Text role="caption" tone="muted">
              {copyright}
            </Text>
          )}

          <View className={NATIVE_FOOTER_BOTTOM_LINKS_CLASS}>
            {legal && legal.length > 0 && (
              <FooterLinkList
                links={legal}
                className={NATIVE_FOOTER_BOTTOM_LINKS_CLASS}
              />
            )}
            {social && social.length > 0 && (
              <FooterLinkList
                links={social}
                className={NATIVE_FOOTER_SOCIAL_ROW_CLASS}
              />
            )}
          </View>
        </View>
      )}

      {children}
    </>
  );

  return (
    <View
      className={classNames(
        NATIVE_FOOTER_VARIANT_CLASS[resolved.variant],
        // The footer paints its own surface and its own rhythm rather than wrapping
        // itself in a `Section`, because a footer's surface is its own vocabulary
        // (a separator, or not) rather than the shared background one.
        SECTION_SPACING_CLASS[resolved.spacing],
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
